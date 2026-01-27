/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 't.alcy.cc',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
