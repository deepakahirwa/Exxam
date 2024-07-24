import express from 'express';
import {
    createExamPaper,
    getExamPapers,
    getExamPaperById,
    updateExamPaper,
    deleteExamPaper
} from '../controllers/ExamPaper.controller.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

// Route to create a new exam paper (protected route)
router.post('/create', verifyAdminJWT, createExamPaper);

// Route to get all exam papers (protected route)
router.get('/get-all-examPapers', verifyAdminJWT, getExamPapers);

// Route to get a single exam paper by ID (protected route)
router.get('/get-examPaper/:id', verifyAdminJWT, getExamPaperById);

// Route to update an exam paper (protected route)
router.put('/update/:id', verifyAdminJWT, updateExamPaper);

// Route to delete an exam paper (protected route)
router.delete('/delete/:id', verifyAdminJWT, deleteExamPaper);

export default router;
