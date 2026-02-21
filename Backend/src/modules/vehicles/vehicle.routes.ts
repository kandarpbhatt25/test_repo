import { Router } from 'express';
import { VehicleController } from './vehicle.controller';

const router = Router();
const vehicleController = new VehicleController();

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;