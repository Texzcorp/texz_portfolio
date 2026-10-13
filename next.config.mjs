import mdx from '@next/mdx';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: { },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Keep the original request URL when redirecting legacy pages.
    skipMiddlewareUrlNormalize: true,
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    eslint: {
        // ESLint is not part of this project's dependencies; skip it during
        // `next build` so it doesn't emit an error on Vercel.
        ignoreDuringBuilds: true,
    },
};

export default withMDX(nextConfig);
