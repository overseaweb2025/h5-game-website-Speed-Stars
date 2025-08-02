import { ImageResponse } from "next/og"

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(to right, #FF6B6B, #4ECDC4)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: 32,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: "bold", marginBottom: 24 }}>Speed Stars</div>
        <div style={{ fontSize: 36, textAlign: "center", maxWidth: "80%" }}>Exciting HTML5 Games for Everyone</div>
      </div>
    ),
    {
      ...size,
    },
  )
}
