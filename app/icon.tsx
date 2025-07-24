import { ImageResponse } from "next/og"

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

// 更新网站图标

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#FF6B6B",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          color: "white",
          fontWeight: "bold",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    },
  )
}
