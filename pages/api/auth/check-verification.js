// pages/api/auth/check-verification.js
import twilio from 'twilio';

// Initialize Twilio client from environment variables
// Ensure these are set in your deployment environment (e.g., DigitalOcean App Platform)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Ensure this is set!

let client;
try {
    if (!accountSid || !authToken || !verifyServiceSid) {
        throw new Error("Twilio credentials or Verify Service SID are not configured in environment variables.");
    }
    client = twilio(accountSid, authToken);
} catch (error) {
    console.error("Failed to initialize Twilio client:", error.message);
}

export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // Ensure the client was initialized
    if (!client) {
         console.error("Twilio client not initialized. Check server logs for configuration errors.");
         return res.status(500).json({ message: 'Twilio configuration error.' });
    }

    const { phone, code } = req.body;

    // Basic validation
    if (!phone || !code) {
        return res.status(400).json({ message: 'Phone number and code are required.' });
    }
     if (!verifyServiceSid) {
         console.error("TWILIO_VERIFY_SERVICE_SID is not set.");
         return res.status(500).json({ message: 'Twilio Verify Service SID is not configured on the server.' });
    }


    try {
        console.log(`Attempting to check verification for: ${phone} with code: ${code} using service ${verifyServiceSid}`);
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: phone, code: code });

        console.log('Twilio verification check status:', verificationCheck.status);

        // Check if the verification was successful ("approved")
        if (verificationCheck.status === 'approved') {
            // Verification successful!
            // TODO: Implement your actual login logic here
            // (e.g., create a session, generate a JWT, redirect, etc.)

            res.status(200).json({ success: true, message: 'Verification successful!' });
        } else {
            // Verification failed (pending, canceled, expired, or incorrect code)
            res.status(400).json({ success: false, message: 'Invalid verification code.' });
        }

    } catch (error) {
        console.error('Error checking Twilio verification:', error);

        // Handle specific Twilio errors if needed, e.g., code expired or max attempts reached
        if (error.status === 404 || error.code === 20404) { // 20404 is Twilio's code for "Not Found" often meaning expired/invalid code
             res.status(400).json({ success: false, message: 'Verification code is invalid or has expired.' });
        } else {
             // Provide a generic error message for other issues
             res.status(500).json({ success: false, message: 'Failed to check verification code. Please try again later.' });
        }
    }
}
