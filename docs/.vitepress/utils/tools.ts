// .vitepress/utils/tools.ts

/**
 * 阅读时间计算（包含图片估算）
 */
export const calculateReadTime = (wordCount: number, imageCount: number): number => {
    // 假设阅读速度：中文 275字/分钟
    const wordTime = (wordCount / 275) * 60 // 秒

    // 图片阅读时间估算
    let imageTime = 0
    const n = imageCount
    if (n > 0) {
        if (n <= 10) {
            // 等差数列求和：13 + 14 + 15 ...
            imageTime = n * 13 + (n * (n - 1)) / 2
        } else {
            // 超过10张，每张按3秒估算
            imageTime = 175 + (n - 10) * 3
        }
    }

    // 总分钟数，向上取整
    return Math.ceil((wordTime + imageTime) / 60)
}

/**
 * 文字统计 (中英文混合)
 */
export const countWord = (data: string): number => {
    if (!data) return 0
    // 简单清洗，去除Markdown链接语法等，保留文本
    const cleanData = data.replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|<.*?>/g, '')

    const cjkPattern = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]/g
    const wordPattern = /[a-zA-Z0-9_\u00C0-\u00FF]+/g

    const cjkMatches = cleanData.match(cjkPattern) || []
    const wordMatches = cleanData.match(wordPattern) || []

    return cjkMatches.length + wordMatches.length
}

/**
 * 数字千分位转换 (e.g. 1500 -> 1.5k)
 */
export const countTransK = (count: number): string => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(count)
}

/**
 * 日期格式化
 */
export const formatDate = (hasTime = false): Intl.DateTimeFormat => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(hasTime && {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    }
    return new Intl.DateTimeFormat('zh-CN', options)
}