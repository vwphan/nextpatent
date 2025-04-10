// pages/api/auth/start-verification.js
import twilio from 'twilio'; // Make sure to install twilio: npm install twilio

// Initialize Twilio client from environment variables
// Ensure these are set in your deployment environment (e.g., DigitalOcean App Platform)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// You'll also need your Twilio Verify Service SID
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Add this environment variable!

let client;
try {
    if (!accountSid || !authToken || !verifyServiceSid) {
        throw new Error("Twilio credentials or Verify Service SID are not configured in environment variables.");
    }
    client = twilio(accountSid, authToken);
} catch (error) {
    console.error("Failed to initialize Twilio client:", error.message);
    // You might want to handle this more gracefully depending on your needs
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


    const { phone } = req.body;

    // Basic validation
    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required.' });
    }
    if (!verifyServiceSid) {
         console.error("TWILIO_VERIFY_SERVICE_SID is not set.");
         return res.status(500).json({ message: 'Twilio Verify Service SID is not configured on the server.' });
    }


    try {
        console.log(`Attempting to send verification to: ${phone} using service ${verifyServiceSid}`);
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: phone, channel: 'sms' }); // Or 'call'

        console.log('Twilio verification status:', verification.status);

        // Important: Send a JSON response back to the frontend
        res.status(200).json({ success: true, message: `Verification code sent to ${phone}` });

    } catch (error) {
        console.error('Error sending Twilio verification:', error);
        // Provide a generic error message to the client for security
        res.status(500).json({ success: false, message: 'Failed to send verification code. Please try again later.' });
    }
}
