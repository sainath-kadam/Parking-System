import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  checkInVehicle,
  checkOutVehicle,
  getActiveParkingList
} from '../controllers/parking.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/check-in', checkInVehicle);
router.post('/check-out', checkOutVehicle);
router.get('/active', getActiveParkingList);

export default router;
