import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const withConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

export default withConfig({
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
});
