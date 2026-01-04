import express from 'express';

import authRoutes from './auth.routes.js';
import parkingRoutes from './parking.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import auditRoutes from './audit.routes.js';
import settingsRoutes from './settings.routes.js';
import tenantRoutes from './tenant.routes.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import tenantMiddleware from '../middlewares/tenant.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(tenantMiddleware);

router.use('/auth', authRoutes);
router.use('/parking', parkingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit', auditRoutes);
router.use('/settings', settingsRoutes);
router.use('/tenants', tenantRoutes);

export default router;