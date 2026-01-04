import express from 'express';

import { checkInVehicle } from '../controllers/checkin.controller.js';
import { checkOutVehicle } from '../controllers/checkout.controller.js';
import { getParkingList } from '../controllers/parkingList.controller.js';
import { getVehicleDetails } from '../controllers/vehicleDetails.controller.js';
import { getParkingDetails } from '../controllers/parkingDetails.controller.js';

import { validate } from '../middlewares/validate.middleware.js';

import { checkInSchema } from '../validators/checkin.validator.js';
import { checkOutSchema } from '../validators/checkout.validator.js';

const router = express.Router();

router.get('/getVehicleDetails/:vehicleNumber', getVehicleDetails);
router.post('/check-in',validate(checkInSchema), checkInVehicle);
router.post('/check-out', validate(checkOutSchema), checkOutVehicle);
router.get('/list', getParkingList);
router.get('/getParkingDetails/:parkingEntryId', getParkingDetails);

export default router;