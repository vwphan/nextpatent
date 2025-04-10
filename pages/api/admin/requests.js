// pages/api/admin/requests.js
import { getPendingAccessRequests } from '../../../lib/mongodb'; // Adjust path if needed

export default async function handler(req, res) {
    // !!! IMPORTANT: ADD AUTHENTICATION/AUTHORIZATION CHECK HERE !!!
    // Ensure only authenticated admins can access this route.
    // This is just a placeholder - implement proper security!
    // const isAdmin = await checkAdminAuth(req);
    // if (!isAdmin) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    if (req.method === 'GET') {
        try {
            const requests = await getPendingAccessRequests();
            res.status(200).json({ success: true, requests: requests });
        } catch (error) {
            console.error("Error fetching access requests:", error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
