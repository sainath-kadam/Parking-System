import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getDashboardStats } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getDashboardStats);

export default router;
