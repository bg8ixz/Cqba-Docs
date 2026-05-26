import path from "node:path";
import fs from "node:fs";

const DIR_PATH = path.resolve("docs");
const WHITE_LIST = [
  "index.md",
  ".vitepress",
  "node_modules",
  ".idea",
  "assets",
];

const isDirectory = (path) => fs.lstatSync(path).isDirectory();

const intersections = (arr1, arr2) =>
  Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))));

function getList(params, path1, pathname, rewrites) {
  const res = [];
  for (let file in params) {
    const dir = path.join(path1, params[file]);
    const isDir = isDirectory(dir);
    if (isDir) {
      const files = fs.readdirSync(dir);
      res.push({
        text: params[file],
        collapsible: true,
        items: getList(files, dir, `${pathname}/${params[file]}`, rewrites),
      });
    } else {
      const name = path.basename(params[file]);
      const suffix = path.extname(params[file]);
      if (suffix !== ".md") {
        continue;
      }
      let link = `${pathname}/${name}`;
      
      if (rewrites) {
        link = applyRewrites(link, rewrites);
      }
      
      res.push({
        text: name,
        link: link,
      });
    }
  }
  res.map((item) => {
    item.text = item.text.replace(/\.md$/, "");
  });
  return res;
}

function applyRewrites(link, rewrites) {
  let cleanLink = link.replace(/^\//, '').replace(/\.md$/, '');
  
  for (const [source, target] of Object.entries(rewrites)) {
    if (source.includes(':slug*')) {
      const sourcePrefix = source.replace('/:slug*', '');
      const targetPrefix = target.replace('/:slug*', '');
      
      if (cleanLink.startsWith(sourcePrefix)) {
        const rest = cleanLink.substring(sourcePrefix.length);
        if (rest === '' || rest === '/index') {
          return `/${targetPrefix}/`;
        }
        return `/${targetPrefix}${rest}`;
      }
    }
    else if (cleanLink === source.replace(/\.md$/, '')) {
      return `/${target.replace(/\.md$/, '')}`;
    }
  }
  
  return `/${cleanLink}`;
}

export const set_sidebar = (pathname, rewrites = {}) => {
  const dirPath = path.join(DIR_PATH, pathname);
  const files = fs.readdirSync(dirPath);
  const items = intersections(files, WHITE_LIST);
  return getList(items, dirPath, pathname, rewrites);
};