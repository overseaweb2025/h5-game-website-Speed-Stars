/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=self, gyroscope=self, magnetometer=self, ambient-light-sensor=self, camera=self, microphone=self, geolocation=self'
          },
          {
            key: 'Feature-Policy',
            value: 'accelerometer "self"; gyroscope "self"; magnetometer "self"; ambient-light-sensor "self"; camera "self"; microphone "self"; geolocation "self"'
          }
        ],
      },
      {
        source: '/game/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=*, gyroscope=*, magnetometer=*, ambient-light-sensor=*, camera=*, microphone=*, geolocation=*'
          },
          {
            key: 'Feature-Policy',
            value: 'accelerometer *; gyroscope *; magnetometer *; ambient-light-sensor *; camera *; microphone *; geolocation *'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ],
      }
    ]
  },
}

export default nextConfig
