import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Preconnect to important domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://qkdbcpyrtqkihaeuobxo.supabase.co" crossOrigin="anonymous" />

                {/* Google Fonts */}
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

                {/* Meta tags */}
                <meta name="description" content="Skutopia Academy - Learn STEM subjects with personalized mentorship" />
                <meta name="theme-color" content="#2196F3" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
} 