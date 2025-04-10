// Temporary content for pages/api/auth/start-verification.js for debugging
export default async function handler(req, res) {
    // Log message RIGHT AT THE START of the handler
    console.log("--- Minimal start-verification handler reached ---");

    if (req.method === 'POST') {
        const { phone } = req.body;
        console.log("--- Minimal handler received phone:", phone, " ---");
        // Return simple success without calling Twilio
        res.status(200).json({ success: true, message: `Minimal API OK for ${phone}` });
    } else {
        console.log(`--- Minimal handler received non-POST method: ${req.method} ---`);
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
