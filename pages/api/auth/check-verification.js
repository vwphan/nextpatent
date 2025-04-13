// pages/api/auth/check-verification.js
import twilio from 'twilio';

// Initialize Twilio client from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client; // Defined at module scope
try {
    // Initialization logic - NO 'phone' variable used here
    if (!accountSid || !authToken || !verifyServiceSid) {
        throw new Error("Twilio credentials or Verify Service SID are not configured in environment variables.");
    }
    client = twilio(accountSid, authToken);
} catch (error) {
    // Log initialization errors
    console.error("Failed to initialize Twilio client:", error.message);
}

// The main handler function starts here
export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // Check if client was initialized successfully *before* using it
    if (!client) {
         console.error("Twilio client not initialized. Check server logs for configuration errors.");
         // Return error because client is needed below
         return res.status(500).json({ success: false, message: 'Twilio configuration error on server.' });
    }
    if (!verifyServiceSid) {
         console.error("TWILIO_VERIFY_SERVICE_SID is not set.");
         return res.status(500).json({ success: false, message: 'Twilio Verify Service SID is not configured on the server.' });
    }


    // 'phone' and 'code' are defined *inside* the handler, from the request
    const { phone, code } = req.body;

    // Basic validation
    if (!phone || !code) {
        return res.status(400).json({ success: false, message: 'Phone number and code are required.' });
    }

    // This is where the main logic using 'phone' and 'client' goes
    try {
        // ---> E.164 Formatting logic MUST be INSIDE the handler function <---
        let formattedPhone = phone;
        // Ensure the phone number starts with '+' for E.164 format
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
            console.log(`Formatted phone number for check to E.164: ${formattedPhone}`);
        }
        // ---> End of E.164 Formatting logic <---

        console.log(`Attempting to check verification for: ${formattedPhone} with code: ${code} using service ${verifyServiceSid}`);
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: formattedPhone, code: code }); // Use formattedPhone

        console.log('Twilio verification check status:', verificationCheck.status);

        if (verificationCheck.status === 'approved') {
            res.status(200).json({ success: true, message: 'Verification successful!' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid verification code.' });
        }

    } catch (error) {
        console.error('Error checking Twilio verification:', error);
        if (error.status === 404 || error.code === 20404) {
             res.status(400).json({ success: false, message: 'Verification code is invalid or has expired.' });
        } else {
             res.status(500).json({ success: false, message: 'Failed to check verification code. Please try again later.' });
        }
    }
} // End of the handler function
