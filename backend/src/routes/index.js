import express from 'express';

import authRoutes from './auth.routes.js';
import parkingRoutes from './parking.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import auditRoutes from './audit.routes.js';
import settingsRoutes from './settings.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/parking', parkingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit', auditRoutes);
router.use('/settings', settingsRoutes);

export default router;