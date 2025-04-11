// pages/api/admin/requests/[id].js
import { updateAccessRequestStatus } from '../../../lib/mongodb'; // Correct path
import { ObjectId } from 'mongodb'; // Import ObjectId
//testing thethis
export default async function handler(req, res) {
    // !!! IMPORTANT: ADD AUTHENTICATION/AUTHORIZATION CHECK HERE !!!
    // Ensure only authenticated admins can access this route.
    // const isAdmin = await checkAdminAuth(req);
    // if (!isAdmin) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const { id } = req.query; // Get the request ID from the URL path

    if (req.method === 'PUT') { // Use PUT for updates
         const { status } = req.body; // Get the new status from the request body

         if (!status || (status !== 'approved' && status !== 'rejected')) {
             return res.status(400).json({ success: false, message: 'Invalid status provided. Must be "approved" or "rejected".' });
         }
         // Basic validation for ID format
         if (!id || !ObjectId.isValid(id)) {
             return res.status(400).json({ success: false, message: 'Invalid request ID format provided.' });
         }

        try {
            const result = await updateAccessRequestStatus(id, status);

            if (result.modifiedCount === 1) {
                 res.status(200).json({ success: true, message: `Request ${id} updated to ${status}` });
            } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
                res.status(200).json({ success: true, message: `Request ${id} status was already ${status}.` });
            } else {
                 res.status(404).json({ success: false, message: `Request ${id} not found.` });
             }
        } catch (error) {
            console.error(`Error updating request ${id}:`, error);
             if (error instanceof TypeError && error.message.includes("ObjectId")) {
                return res.status(400).json({ success: false, message: 'Invalid request ID format.' });
             }
            res.status(500).json({ success: false, message: 'Internal Server Error during update.' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
