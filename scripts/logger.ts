import fs from "fs"
import path from "path"

// 日志级别
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// 日志配置
const config = {
  level: LogLevel.INFO,
  logToFile: true,
  logDir: path.join(process.cwd(), "logs"),
  logFileName: "sitemap-generator.log",
  maxLogSize: 5 * 1024 * 1024, // 5MB
  maxLogFiles: 5,
}

// 确保日志目录存在
if (config.logToFile && !fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true })
}

// 日志轮转
function rotateLogIfNeeded() {
  if (!config.logToFile) return

  const logFile = path.join(config.logDir, config.logFileName)

  if (fs.existsSync(logFile)) {
    const stats = fs.statSync(logFile)

    if (stats.size >= config.maxLogSize) {
      // 移动旧日志文件
      for (let i = config.maxLogFiles - 1; i > 0; i--) {
        const oldFile = path.join(config.logDir, `${config.logFileName}.${i}`)
        const newFile = path.join(config.logDir, `${config.logFileName}.${i + 1}`)

        if (fs.existsSync(oldFile)) {
          if (i === config.maxLogFiles - 1) {
            fs.unlinkSync(oldFile) // 删除最旧的日志
          } else {
            fs.renameSync(oldFile, newFile)
          }
        }
      }

      // 重命名当前日志文件
      fs.renameSync(logFile, path.join(config.logDir, `${config.logFileName}.1`))
    }
  }
}

// 写入日志
function writeLog(level: LogLevel, message: string) {
  if (level < config.level) return

  const now = new Date()
  const timestamp = now.toISOString()
  const levelStr = LogLevel[level]
  const logMessage = `[${timestamp}] [${levelStr}] ${message}`

  // 控制台输出
  console.log(logMessage)

  // 文件输出
  if (config.logToFile) {
    rotateLogIfNeeded()
    fs.appendFileSync(path.join(config.logDir, config.logFileName), logMessage + "\n")
  }
}

// 导出日志函数
export const logger = {
  debug: (message: string) => writeLog(LogLevel.DEBUG, message),
  info: (message: string) => writeLog(LogLevel.INFO, message),
  warn: (message: string) => writeLog(LogLevel.WARN, message),
  error: (message: string) => writeLog(LogLevel.ERROR, message),
}
