/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@prisma/client'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-67f953912205445f932ab892164f22e5.r2.dev',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
