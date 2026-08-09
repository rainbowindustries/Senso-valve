/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/backoffice-admin/login',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/backoffice-admin/login',
        permanent: true,
      },
      {
        source: '/admin-panel',
        destination: '/backoffice-admin/login',
        permanent: true,
      },
    ]
  },
}

export default nextConfig