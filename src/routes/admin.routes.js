import express from 'express';
import {
    createAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin
} from '../controllers/admin.controllers.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();

// Route to create a new admin (protected route), verifyAdminJWT

router.post('/create', upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    }
]), createAdmin);

// Route to get all admins (protected route)
router.get('/get-all-admin', verifyAdminJWT, getAdmins);

// Route to get a single admin by ID (protected route)
router.get('/get-admin/:id', verifyAdminJWT, getAdminById);

// Route to update an admin (protected route)
router.put('/update/:id', verifyAdminJWT, updateAdmin);

// Route to delete an admin (protected route)
router.delete('/delete/:id', verifyAdminJWT, deleteAdmin);

// Route to log in an admin (unprotected route)
router.post('/login', loginAdmin);

// Route to log out an admin (protected route)
router.post('/logout', verifyAdminJWT, logoutAdmin);

export default router;
