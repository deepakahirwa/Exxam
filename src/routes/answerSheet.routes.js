import express from 'express';
import { createAnswerSheet, updateAnswerSheet, getAnswerSheets, getAnswerSheetById, deleteAnswerSheet } from '../controllers/answerSheet.controller.js';
import { verifyStudentJWT } from '../middleware/student.auth.middleware.js';

const router = express.Router();

// Route to create a new answer sheet
router.post('/create', verifyStudentJWT, createAnswerSheet);

// Route to update an existing answer sheet
router.put('/update/:id', verifyStudentJWT, updateAnswerSheet);

// Route to get all answer sheets
router.get('/get-all', verifyStudentJWT, getAnswerSheets);

// Route to get a single answer sheet by ID
router.get('/get/:id', verifyStudentJWT, getAnswerSheetById);

// Route to delete an answer sheet
router.delete('/delete/:id', verifyStudentJWT, deleteAnswerSheet);

export default router;
