import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// 安全密钥，应该存储在环境变量中
const API_SECRET = process.env.SITEMAP_API_SECRET || "change-this-to-a-secure-secret"

export async function POST(request: NextRequest) {
  try {
    // 验证请求
    const authorization = request.headers.get("authorization")
    if (!authorization || authorization !== `Bearer ${API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 执行生成脚本
    const { stdout, stderr } = await execAsync("npx ts-node --project tsconfig.server.json scripts/generate-sitemap.ts")

    if (stderr) {
      // Sitemap generation error - silently handled
      return NextResponse.json({ error: stderr }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Sitemap generated successfully",
      details: stdout,
    })
  } catch (error) {
    // Error generating sitemap - silently handled
    return NextResponse.json(
      {
        error: "Failed to generate sitemap",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
