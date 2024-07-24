import express from 'express';
import adminRoutes from './admin.routes.js';
import studentRoutes from './student.routes.js';
import examPaperRoutes from './ExamPaper.routes.js';
import questionRoutes from './question.routes.js';
import answerKeyRoutes from './answerkey.routes.js';
// import answerSheetRoutes from './answerSheet.routes.js';

// Create a router
const router = express.Router();

// Use routes
router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);
router.use('/exampapers', examPaperRoutes);
router.use('/question', questionRoutes);
router.use('/answerkey', answerKeyRoutes);
// router.use('/answersheets', answerSheetRoutes);

export default router;
