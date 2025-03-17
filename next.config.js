/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            }
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: blob: https: http: https://images.unsplash.com;
              connect-src 'self' https://*.supabase.co https://supabase.co https://*.supabase.io https://www.googletagmanager.com https://raw.githubusercontent.com;
              frame-src 'self';
              object-src 'none';
            `.replace(/\s+/g, ' ').trim()
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig; 