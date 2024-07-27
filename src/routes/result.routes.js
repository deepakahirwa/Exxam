import express from 'express';
import { getallExamAverage } from '../controllers/result.controller.js';
import { verifyStudentJWT } from '../middleware/student.auth.middleware.js';
import { createClassResult, getClassResult, getFirstRank, getLastRank, getAverageScore } from '../controllers/result.controller.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';


const router = express.Router();

router.post('/create', verifyAdminJWT, createClassResult);
router.get('/:examPaperId', verifyStudentJWT, getClassResult);
router.get('/:examPaperId/first-rank', verifyStudentJWT, getFirstRank);
router.get('/:examPaperId/last-rank', verifyStudentJWT, getLastRank);
router.get('/:examPaperId/average-score', verifyStudentJWT, getAverageScore);
router.get('/all-exam/average',getallExamAverage);
export default router;
