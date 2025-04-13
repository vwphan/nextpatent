// pages/api/auth/start-verification.js
import twilio from 'twilio';

// Initialize Twilio client from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client;
try {
    if (!accountSid || !authToken || !verifyServiceSid) {
        throw new Error("Twilio credentials or Verify Service SID are not configured in environment variables.");
    }
    client = twilio(accountSid, authToken);
} catch (error) {
    console.error("Failed to initialize Twilio client:", error.message);
    // This error will prevent the handler from working, log it server-side
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
         return res.status(500).json({ success: false, message: 'Twilio configuration error on server.' });
    }
     if (!verifyServiceSid) {
         console.error("TWILIO_VERIFY_SERVICE_SID is not set.");
         return res.status(500).json({ success: false, message: 'Twilio Verify Service SID is not configured on the server.' });
    }


    const { phone } = req.body;

    // Basic validation
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    try {
        console.log(`Attempting to start verification for: ${phone} using service ${verifyServiceSid}`);
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: phone, channel: 'sms' }); // Specify SMS channel

        console.log('Twilio verification initiation status:', verification.status); // Should be 'pending' if successful

        // Let the frontend know the code was sent (or at least the request was accepted by Twilio)
        res.status(200).json({ success: true, message: 'Verification code sent successfully!' });

    } catch (error) {
        console.error('Error sending Twilio verification:', error);
        // Provide a generic error message, but log the specific error server-side
        res.status(500).json({ success: false, message: 'Failed to send verification code. Please try again later.' });
    }
}
