const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true, // 프로덕션 빌드에서 소스맵 생성
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 환경에서 클라이언트 및 서버 사이드 소스맵 활성화
      config.devtool = 'eval-source-map'
    }
    return config
  },
}

export default nextConfig
