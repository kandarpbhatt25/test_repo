import { Request, Response, NextFunction } from 'express';
import { VehicleService } from './vehicle.service';
import { VehicleValidator } from './vehicle.validator';
import { CreateVehicleRequest, UpdateVehicleRequest, VehicleStatus } from './vehicle.model';

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  getAllVehicles = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { status, search } = req.query;
      
      let vehicles = this.vehicleService.getAllVehicles();
      
      if (status) {
        vehicles = this.vehicleService.getVehiclesByStatus(status as VehicleStatus);
      }
      
      if (search && typeof search === 'string') {
        vehicles = this.vehicleService.searchVehicles(search);
      }
      
      res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      next(error);
    }
  };

  getVehicleById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const vehicle = this.vehicleService.getVehicleById(Array.isArray(id) ? id[0] : id);
      
      if (!vehicle) {
        res.status(404).json({ 
          success: false,
          error: 'Vehicle not found' 
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  };

  createVehicle = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const vehicleData: CreateVehicleRequest = req.body;
      
      const validationErrors = VehicleValidator.validateCreateVehicle(vehicleData);
      if (validationErrors.length > 0) {
        res.status(400).json({ 
          success: false,
          error: 'Validation failed', 
          details: validationErrors 
        });
        return;
      }
      
      const newVehicle = this.vehicleService.createVehicle(vehicleData);
      res.status(201).json({
        success: true,
        data: newVehicle
      });
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const updateData: UpdateVehicleRequest = req.body;
      
      const validationErrors = VehicleValidator.validateUpdateVehicle(updateData);
      if (validationErrors.length > 0) {
        res.status(400).json({ 
          success: false,
          error: 'Validation failed', 
          details: validationErrors 
        });
        return;
      }
      
      const vehicleId = Array.isArray(id) ? id[0] : id;
      const updatedVehicle = this.vehicleService.updateVehicle(vehicleId, updateData);
      
      if (!updatedVehicle) {
        res.status(404).json({ 
          success: false,
          error: 'Vehicle not found' 
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: updatedVehicle
      });
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const vehicleId = Array.isArray(id) ? id[0] : id;
      const deleted = this.vehicleService.deleteVehicle(vehicleId);
      
      if (!deleted) {
        res.status(404).json({ 
          success: false,
          error: 'Vehicle not found' 
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}