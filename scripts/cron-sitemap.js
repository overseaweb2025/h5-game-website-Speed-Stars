const cron = require("node-cron")
const { exec } = require("child_process")
const path = require("path")

// 配置定时任务 - 默认每周一凌晨3点执行
// 格式: 秒 分 时 日 月 星期
cron.schedule("0 0 3 * * 1", () => {
  console.log("Running sitemap generation...")

  // 执行生成脚本
  exec("npx ts-node --project tsconfig.server.json scripts/generate-sitemap.ts", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
      return
    }
    console.log(`Stdout: ${stdout}`)
  })
})

console.log("Sitemap cron job scheduled")
