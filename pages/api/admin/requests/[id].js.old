// pages/api/admin/requests/[id].js
import { updateAccessRequestStatus } from '../../../lib/mongodb'; // Adjust path

export default async function handler(req, res) {
    // !!! IMPORTANT: ADD AUTHENTICATION/AUTHORIZATION CHECK HERE !!!
    // const isAdmin = await checkAdminAuth(req);
    // if (!isAdmin) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { id } = req.query; // Get the request ID from the URL path
    const { status } = req.body; // Get the new status from the request body

    if (req.method === 'PUT') { // Use PUT for updates
         if (!status || (status !== 'approved' && status !== 'rejected')) {
             return res.status(400).json({ success: false, message: 'Invalid status provided.' });
         }
        try {
            const result = await updateAccessRequestStatus(id, status);
            if (result.modifiedCount === 1) {
                 res.status(200).json({ success: true, message: `Request ${id} updated to ${status}` });
            } else {
                 res.status(404).json({ success: false, message: `Request ${id} not found or status unchanged.` });
            }
        } catch (error) {
            console.error(`Error updating request ${id}:`, error);
            // Handle potential ObjectId format errors
             if (error.message.includes("Argument passed in must be a string of 12 bytes or a string of 24 hex characters")) {
                return res.status(400).json({ success: false, message: 'Invalid request ID format.' });
            }
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
