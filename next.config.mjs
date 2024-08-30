/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },
};

export default nextConfig;
