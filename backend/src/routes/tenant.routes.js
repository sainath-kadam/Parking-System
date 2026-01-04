import express from 'express';
import { createTenant, listTenants, disableTenant } from '../controllers/tenant.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('SYSTEM_OWNER'));

router.post('/', createTenant);
router.get('/', listTenants);
router.patch('/:tenantId/disable', disableTenant);
router.patch('/:tenantId/enable', enableTenant);

export default router;