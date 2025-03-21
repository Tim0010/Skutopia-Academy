/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Enable production source maps
    productionBrowserSourceMaps: false,
    
    // Compression for optimizing performance
    compress: true,
    
    // Optimize images
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
        // Image optimization settings
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 31536000, // 1 year in seconds
    },
    
    // Configure HTTP headers for security and performance
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
                    },
                    // Cache control for static assets
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                    // Enable gzip compression
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    }
                ]
            },
            // Different cache settings for dynamic content
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, max-age=0',
                    }
                ]
            }
        ];
    },
    
    // Webpack optimization
    webpack: (config, { dev, isServer }) => {
        // Only run these optimizations in production
        if (!dev) {
            config.optimization.minimize = true;
            
            // Split chunks for better caching
            if (!isServer) {
                config.optimization.splitChunks = {
                    chunks: 'all',
                    maxInitialRequests: 20,
                    minSize: 20000
                };
            }
        }
        
        return config;
    }
};

module.exports = nextConfig; 