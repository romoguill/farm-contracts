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
    serverComponentsExternalPackages: [
      '@node-rs/argon2',
      '@aws-sdk/client-s3',
      '@aws-sdk/s3-request-presigner',
    ],
  },
};

export default nextConfig;
