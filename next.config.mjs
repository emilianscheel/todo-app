import withPWA from 'next-pwa';


/** @type {import('next').NextConfig} */
const withConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    buildExcludes: ["app-build-manifest.json"],
})

export default withConfig({
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    reactStrictMode: true,
});
