import express from 'express';
import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    loginStudent,
    logoutStudent
} from '../controllers/student.cotroller.js';  // Import the student controller functions
import { verifyStudentJWT } from '../middleware/student.auth.middleware.js';  // Import student JWT verification middleware
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';  // Import multer middleware for file uploads

const router = express.Router();

// Route to create a new student (protected route), verifyStudentJWT
router.post('/create', verifyAdminJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    }
]), createStudent);

// Route to get all students (protected route)
router.get('/get-all-student', verifyAdminJWT, getStudents);

// Route to get a single student by ID (protected route)
router.get('/get-student/:id', verifyStudentJWT, getStudentById);

// Route to update a student (protected route)
router.put('/update/:id', verifyStudentJWT, updateStudent);

// Route to delete a student (protected route)
router.delete('/delete/:id', verifyAdminJWT, deleteStudent);

// Route to log in a student (unprotected route)
router.post('/login', loginStudent);

// Route to log out a student (protected route)
router.post('/logout', verifyStudentJWT, logoutStudent);

export default router;
