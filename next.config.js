/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    output: 'export',
    distDir: "_static",
    images: {
        unoptimized: true
    },
}

// next.config.js
module.exports = {
  // ...
    nextConfig,
  env: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  },
};
