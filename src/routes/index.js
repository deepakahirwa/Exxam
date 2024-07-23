import express from 'express';
import adminRoutes from './admin.routes.js';
// import studentRoutes from './student.routes.js';
// import examPaperRoutes from './questionPaper.routes.js';
// import questionRoutes from './question.routes.js';
// import answerKeyRoutes from './answerKey.routes.js';
// import answerSheetRoutes from './answerSheet.routes.js';

// Create a router
const router = express.Router();

// Use routes
router.use('/admin', adminRoutes);
// router.use('/students', studentRoutes);
// router.use('/exampapers', examPaperRoutes);
// router.use('/questions', questionRoutes);
// router.use('/answerkeys', answerKeyRoutes);
// router.use('/answersheets', answerSheetRoutes);

export default router;
