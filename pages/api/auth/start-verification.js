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

    // ---> Make sure this line exists and is correct <---
    const { phone } = req.body;
    // ---> This line gets the phone number from the request body <---

    // Basic validation
    if (!phone) {
        // If 'phone' is missing from the request body, this error is returned.
        return res.status(400).json({ success: false, message: 'Phone number is required in the request body.' });
    }

    // Now, inside the try block, we can safely use the 'phone' variable
    try {
        let formattedPhone = phone; // Use the 'phone' variable extracted above
        // Ensure the phone number starts with '+' for E.164 format
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
            console.log(`Formatted phone number to E.164: ${formattedPhone}`);
        }

        console.log(`Attempting to start verification for: ${formattedPhone} using service ${verifyServiceSid}`);
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: formattedPhone, channel: 'sms' }); // Use formattedPhone

        console.log('Twilio verification initiation status:', verification.status);

        res.status(200).json({ success: true, message: 'Verification code sent successfully!' });

    } catch (error) {
        console.error('Error sending Twilio verification:', error); // Log the actual error object
        // Check if the error is a ReferenceError (though it shouldn't be now)
        if (error instanceof ReferenceError) {
             res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
        } else {
             // Handle other errors (like Twilio API errors)
             res.status(500).json({ success: false, message: 'Failed to send verification code. Please try again later.' });
        }
    }
}
