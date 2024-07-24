import express from 'express';
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.controller.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();

// Route to create a new question (protected route)
router.post('/create', verifyAdminJWT, upload.fields([
    { name: 'images', maxCount: 5 } // Limit to 5 images
]), createQuestion);


// Route to get all questions (protected route)
router.get('/get-all', verifyAdminJWT, getQuestions);

// Route to get a single question by ID (protected route)
router.get('/get/:id', verifyAdminJWT, getQuestionById);

// Route to update a question (protected route)
router.put('/update/:id', verifyAdminJWT, updateQuestion);

// Route to delete a question (protected route)
router.delete('/delete/:id', verifyAdminJWT, deleteQuestion);

export default router;
