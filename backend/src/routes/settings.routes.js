import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import {
  getSettings,
  updateSettings
} from '../controllers/settings.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['SYSTEM_OWNER']));

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
