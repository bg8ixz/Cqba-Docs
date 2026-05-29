import fs from 'fs';
import path from 'path';
import { createRewrites } from 'vitepress-plugin-permalink';

const projectRoot = process.cwd();
const docsRoot = path.join(projectRoot, 'docs');
const outputFile = path.join(projectRoot, 'docs/.vitepress/sidebar.mts');

const EXPAND_DEPTH = 1;               // 深度 >= 1 时折叠
const REMOVE_NUMBER_PREFIX = true;
const PREFIX_SEPARATOR = '.';
const SORT_BY_NUMERIC_PREFIX = true;
const IGNORE_INDEX_MD = true;

const rewrites = createRewrites({ srcDir: 'docs' });

function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 1. 解析 frontmatter，获取 title 字段
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        if (title) return title;
      }
    }
    
    // 2. 其次：文件名（去除扩展名，并移除数字前缀）
    const fileName = path.basename(filePath, '.md');
    const cleanedFileName = fileName.replace(/^\d+\s*\.\s*/, '');
    if (cleanedFileName) return cleanedFileName;
    
    // 3. 最后：H1 标题
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) return h1Match[1].trim();
    
    // 3 属于几乎永远不会被用到的后备方案
    return fileName;
  } catch (err) {
    const fileName = path.basename(filePath, '.md');
    return fileName.replace(/^\d+\s*\.\s*/, '') || fileName;
  }
}

function getAllMdFiles(dir, base = '') {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    let relPath = base ? path.join(base, item.name) : item.name;
    relPath = relPath.replace(/\\/g, '/');
    if (item.isDirectory()) {
      results.push(...getAllMdFiles(fullPath, relPath));
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const original = relPath;
      const permalinkMd = rewrites[original];
      if (!permalinkMd) {
        console.warn(`⚠️ 未找到映射: ${original}`);
        continue;
      }
      const permalink = '/' + permalinkMd.replace(/\.md$/, '');
      const title = extractTitle(fullPath);
      results.push({ original, permalink, title });
    }
  }
  return results;
}

function parsePrefix(name) {
  const match = name.match(/^(\d+)\s*\.\s*(.+)$/);
  if (match) {
    return { prefix: parseInt(match[1], 10), name: match[2] };
  }
  return { prefix: null, name };
}

function buildTree(files) {
  const tree = {};
  for (const file of files) {
    const parts = file.original.split('/');
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const fileName = part.replace(/\.md$/, '');
      if (isLast) {
        if (!current[fileName]) {
          current[fileName] = { ...file, isFile: true };
        }
      } else {
        if (!current[part]) {
          current[part] = { isDir: true, children: {} };
        }
        current = current[part].children;
      }
    }
  }
  return tree;
}

function sortNode(node) {
  const entries = Object.entries(node);
  if (SORT_BY_NUMERIC_PREFIX) {
    entries.sort((a, b) => {
      const aPrefix = parsePrefix(a[0]).prefix ?? Infinity;
      const bPrefix = parsePrefix(b[0]).prefix ?? Infinity;
      if (aPrefix !== bPrefix) return aPrefix - bPrefix;
      return a[0].localeCompare(b[0]);
    });
  } else {
    entries.sort((a, b) => a[0].localeCompare(b[0]));
  }
  const sorted = {};
  for (const [key, value] of entries) {
    sorted[key] = value;
    if (value.children) sortNode(value.children);
  }
  return sorted;
}

function convertTreeToSidebar(node, depth = 0) {
  const items = [];
  for (const [key, value] of Object.entries(node)) {
    if (IGNORE_INDEX_MD && key === 'index') continue;
    if (value.isFile) {
      let displayText = value.title || key;
      items.push({ text: displayText, link: value.permalink });
    } else if (value.children) {
      let displayName = key;
      if (REMOVE_NUMBER_PREFIX) {
        const { name } = parsePrefix(key);
        displayName = name || key;
      }
      const children = convertTreeToSidebar(value.children, depth + 1);
      const shouldCollapse = depth >= EXPAND_DEPTH;
      const item = { text: displayName, items: children };
      if (shouldCollapse) item.collapsed = true;
      items.push(item);
    }
  }
  return items;
}

// ========== 返回侧边栏数组 ==========
function generateSidebarArray() {
  console.log('🔍 开始扫描 Markdown 文件...');
  const files = getAllMdFiles(docsRoot);
  console.log(`📄 找到 ${files.length} 个 Markdown 文件`);
  console.log('🌲 构建树形结构...');
  let tree = buildTree(files);
  tree = sortNode(tree);
  return convertTreeToSidebar(tree, 0);
}

// 导出动态生成函数（顶层）
export function generateSidebar() {
  return generateSidebarArray();
}

// 如果是直接运行本脚本，则生成静态 sidebar.mts 文件
if (import.meta.url === `file://${process.argv[1]}`) {
  const sidebarItems = generateSidebarArray();
  const outputContent = `// 此文件由 generateSidebar.mjs 自动生成，请勿手动修改
const sidebar = ${JSON.stringify(sidebarItems, null, 2)};
export default sidebar;
`;
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputFile, outputContent);
  console.log(`✅ 侧边栏配置已生成到 ${outputFile}`);
}