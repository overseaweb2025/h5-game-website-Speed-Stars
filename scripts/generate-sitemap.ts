import fs from "fs"
import path from "path"
import { JSDOM } from "jsdom"
import fetch from "node-fetch"
import { SitemapStream, streamToPromise } from "sitemap"
import { Readable } from "stream"
import { createGzip } from "zlib"

// 配置项
const CONFIG = {
  baseUrl: "https://speed-stars.net",
  outputPath: path.join(process.cwd(), "public"),
  maxDepth: 5, // 最大爬取深度
  concurrency: 5, // 并发请求数
  excludePatterns: [
    /\.(jpg|jpeg|png|gif|svg|webp|css|js|json|txt|pdf|zip|rar|doc|docx|xls|xlsx|ppt|pptx)$/i,
    /\/api\//,
    /\/admin\//,
    /\/_next\//,
    /\/node_modules\//,
    /\/.git\//,
  ],
  changefreqMap: {
    "/": "daily",
    "/games": "daily",
    "/games/": "weekly",
    "/blog": "weekly",
    "/blog/": "monthly",
    "/about": "monthly",
    "/contact": "monthly",
    "/help": "monthly",
    "/terms": "yearly",
    "/privacy": "yearly",
    "/cookies": "yearly",
    "/dmca": "yearly",
  } as Record<string, string>,
  priorityMap: {
    "/": 1.0,
    "/games": 0.9,
    "/games/": 0.8,
    "/blog": 0.8,
    "/blog/": 0.7,
    "/about": 0.6,
    "/contact": 0.6,
    "/help": 0.7,
    "/terms": 0.4,
    "/privacy": 0.4,
    "/cookies": 0.3,
    "/dmca": 0.3,
  } as Record<string, number>,
}

// 存储已访问的URL和它们的状态
const visitedUrls = new Map<string, { status: number; lastModified?: string }>()

// 获取URL的状态码和最后修改时间
async function checkUrl(url: string): Promise<{ status: number; lastModified?: string }> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    const lastModified = response.headers.get("last-modified") || undefined
    return { status: response.status, lastModified }
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error)
    return { status: 0 } // 请求失败
  }
}

// 从HTML中提取链接
function extractLinks(html: string, baseUrl: string): string[] {
  const dom = new JSDOM(html)
  const links = Array.from(dom.window.document.querySelectorAll("a[href]"))
    .map((a) => {
      try {
        const href = a.getAttribute("href") || ""
        // 将相对URL转换为绝对URL
        const url = new URL(href, baseUrl)
        return url.href
      } catch {
        return null
      }
    })
    .filter(
      (url): url is string =>
        url !== null && url.startsWith(CONFIG.baseUrl) && !CONFIG.excludePatterns.some((pattern) => pattern.test(url)),
    )

  return [...new Set(links)] // 去重
}

// 爬取URL并递归爬取其中的链接
async function crawlUrl(url: string, depth = 0): Promise<void> {
  // 检查是否已访问过或超出最大深度
  if (visitedUrls.has(url) || depth > CONFIG.maxDepth) {
    return
  }

  console.log(`Crawling ${url} (depth: ${depth})`)

  // 检查URL状态
  const { status, lastModified } = await checkUrl(url)
  visitedUrls.set(url, { status, lastModified })

  // 如果状态码为200，则爬取页面内容并提取链接
  if (status === 200) {
    try {
      const response = await fetch(url)
      const contentType = response.headers.get("content-type") || ""

      // 只处理HTML内容
      if (contentType.includes("text/html")) {
        const html = await response.text()
        const links = extractLinks(html, url)

        // 并发爬取链接
        const promises = []
        for (const link of links) {
          // 限制并发数
          if (promises.length >= CONFIG.concurrency) {
            await Promise.race(promises)
          }

          const promise = crawlUrl(link, depth + 1)
            .catch((error) => console.error(`Error crawling ${link}:`, error))
            .finally(() => {
              const index = promises.indexOf(promise)
              if (index !== -1) {
                promises.splice(index, 1)
              }
            })

          promises.push(promise)
        }

        // 等待所有爬取完成
        await Promise.all(promises)
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
    }
  }
}

// 确定URL的changefreq
function getChangefreq(url: string): string {
  const path = new URL(url).pathname

  // 检查精确匹配
  if (CONFIG.changefreqMap[path]) {
    return CONFIG.changefreqMap[path]
  }

  // 检查前缀匹配
  for (const [prefix, freq] of Object.entries(CONFIG.changefreqMap)) {
    if (prefix.endsWith("/") && path.startsWith(prefix)) {
      return freq
    }
  }

  return "monthly" // 默认值
}

// 确定URL的优先级
function getPriority(url: string): number {
  const path = new URL(url).pathname

  // 检查精确匹配
  if (CONFIG.priorityMap[path] !== undefined) {
    return CONFIG.priorityMap[path]
  }

  // 检查前缀匹配
  for (const [prefix, priority] of Object.entries(CONFIG.priorityMap)) {
    if (prefix.endsWith("/") && path.startsWith(prefix)) {
      return priority
    }
  }

  return 0.5 // 默认值
}

// 生成sitemap.xml
async function generateSitemap(): Promise<void> {
  // 过滤出状态码为200的URL
  const validUrls = Array.from(visitedUrls.entries())
    .filter(([, { status }]) => status === 200)
    .map(([url, { lastModified }]) => ({
      url,
      lastmod: lastModified ? new Date(lastModified).toISOString() : new Date().toISOString(),
      changefreq: getChangefreq(url),
      priority: getPriority(url),
    }))
    .sort((a, b) => b.priority - a.priority) // 按优先级排序

  // 创建sitemap流
  const stream = new SitemapStream({ hostname: CONFIG.baseUrl })
  const data = await streamToPromise(Readable.from(validUrls).pipe(stream))

  // 写入sitemap.xml
  fs.writeFileSync(path.join(CONFIG.outputPath, "sitemap.xml"), data.toString())
  console.log(`Generated sitemap.xml with ${validUrls.length} URLs`)

  // 创建gzip版本
  const gzipped = await streamToPromise(Readable.from(data).pipe(createGzip()))
  fs.writeFileSync(path.join(CONFIG.outputPath, "sitemap.xml.gz"), gzipped)
  console.log("Generated sitemap.xml.gz")

  // 更新sitemap索引
  updateSitemapIndex()
}

// 更新sitemap索引
function updateSitemapIndex(): void {
  const now = new Date().toISOString()
  const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${CONFIG.baseUrl}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${CONFIG.baseUrl}/sitemap-games.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${CONFIG.baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`

  fs.writeFileSync(path.join(CONFIG.outputPath, "sitemap-index.xml"), indexContent)
  console.log("Updated sitemap-index.xml")
}

// 主函数
async function main(): Promise<void> {
  console.log("Starting sitemap generation...")
  const startTime = Date.now()

  // 从根URL开始爬取
  await crawlUrl(CONFIG.baseUrl)

  // 生成sitemap
  await generateSitemap()

  const duration = (Date.now() - startTime) / 1000
  console.log(`Sitemap generation completed in ${duration.toFixed(2)} seconds`)
}

// 执行主函数
main().catch((error) => {
  console.error("Error generating sitemap:", error)
  process.exit(1)
})
