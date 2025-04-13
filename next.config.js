/** @type {import('next').NextConfig} */
module.exports = { // <-- Export the config options directly
  //Soutput: 'export',
  distDir: "_static",
  images: {
    unoptimized: true
  },
  env: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  },
  // Add any other top-level config options here if needed
};
