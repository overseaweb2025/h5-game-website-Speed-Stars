import { logger } from "./logger"

// 测试特定URL的状态
async function testUrl(url: string) {
  logger.info(`Testing URL: ${url}`)

  try {
    const response = await fetch(url)
    logger.info(`Status: ${response.status}`)
    logger.info(`Content-Type: ${response.headers.get("content-type")}`)
    logger.info(`Last-Modified: ${response.headers.get("last-modified")}`)
  } catch (error) {
    logger.error(`Error testing URL: ${error}`)
  }
}

// 测试主函数
async function main() {
  const baseUrl = "https://speed-stars.net"

  // 测试几个关键URL
  await testUrl(`${baseUrl}/`)
  await testUrl(`${baseUrl}/games`)
  await testUrl(`${baseUrl}/games/speed-stars`)
  await testUrl(`${baseUrl}/games/speed-stars-2`)
  await testUrl(`${baseUrl}/non-existent-page`) // 应该返回404
}

main().catch((error) => {
  logger.error(`Unhandled error: ${error}`)
})
