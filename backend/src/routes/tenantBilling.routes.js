import express from 'express';
import { addTenantPayment, applyAdjustment } from '../controllers/tenantBilling.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('SYSTEM_OWNER'));

router.post('/:tenantId/payment', addTenantPayment);
router.post('/:tenantId/adjustment', applyAdjustment);

export default router;