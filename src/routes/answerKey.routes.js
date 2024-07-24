import express from 'express';
import {
    createAnswerKey,
    getAnswerKeys,
    getAnswerKeyById,
    updateAnswerKey,
    deleteAnswerKey
} from '../controllers/answerkey.controller.js';
import { verifyStudentJWT } from '../middleware/student.auth.middleware.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';
const router = express.Router();

// Route to create a new answer key (protected route)
router.post('/create', verifyStudentJWT, createAnswerKey);

// Route to get all answer keys (protected route)
router.get('/get-all', verifyAdminJWT, getAnswerKeys);

// Route to get a single answer key by ID (protected route)
router.get('/get/:id', verifyStudentJWT, getAnswerKeyById);

// Route to update an answer key (protected route)
router.put('/update/:id', verifyStudentJWT, updateAnswerKey);

// Route to delete an answer key (protected route)
router.delete('/delete/:id', verifyStudentJWT, deleteAnswerKey);

export default router;
