import { checkInVehicle } from '../controllers/checkin.controller.js';
import { checkOutVehicle } from '../controllers/checkout.controller.js';
import { getParkingList } from '../controllers/parkingList.controller.js';

router.post('/check-in',validate(checkInSchema), checkInVehicle);
router.post('/check-out', validate(checkOutSchema), checkOutVehicle);
router.get('/active', getParkingList);

export default router;