import { Request, Response, NextFunction } from 'express';
import { TripService } from './trip.service';
import { CreateTripRequest, UpdateTripRequest, TripStatus } from './trip.model';

export class TripController {
  private tripService: TripService;

  constructor() {
    this.tripService = new TripService();
  }

  getAllTrips = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { status, driver, vehicle, search } = req.query;
      
      let trips = this.tripService.getAllTrips();
      
      if (status) {
        trips = this.tripService.getTripsByStatus(status as TripStatus);
      }
      
      if (driver && typeof driver === 'string') {
        trips = this.tripService.getTripsByDriver(driver);
      }
      
      if (vehicle && typeof vehicle === 'string') {
        trips = this.tripService.getTripsByVehicle(vehicle);
      }
      
      if (search && typeof search === 'string') {
        trips = this.tripService.searchTrips(search);
      }
      
      res.status(200).json({
        count: trips.length,
        data: trips
      });
    } catch (error) {
      next(error);
    }
  };

  getTripById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const trip = this.tripService.getTripById(Array.isArray(id) ? id[0] : id);
      
      if (!trip) {
        res.status(404).json({ error: 'Trip not found' });
        return;
      }
      
      res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  };

  createTrip = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const tripData: CreateTripRequest = req.body;
      
      const result = this.tripService.createTrip(tripData);
      
      if (!result.trip) {
        res.status(400).json({ 
          error: 'Trip creation failed', 
          details: result.errors,
          warnings: result.warnings
        });
        return;
      }
      
      const statusCode = result.warnings.length > 0 ? 201 : 201;
      res.status(statusCode).json({
        trip: result.trip,
        warnings: result.warnings
      });
    } catch (error) {
      next(error);
    }
  };

  updateTrip = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const updateData: UpdateTripRequest = req.body;
      
      const result = this.tripService.updateTrip(Array.isArray(id) ? id[0] : id, updateData);
      
      if (!result.trip) {
        res.status(400).json({ 
          error: 'Trip update failed', 
          details: result.errors,
          warnings: result.warnings
        });
        return;
      }
      
      res.status(200).json({
        trip: result.trip,
        warnings: result.warnings
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTrip = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const result = this.tripService.deleteTrip(Array.isArray(id) ? id[0] : id);
      
      if (!result.success) {
        res.status(400).json({ 
          error: 'Trip deletion failed', 
          details: result.errors
        });
        return;
      }
      
      res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  startTrip = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const result = this.tripService.startTrip(Array.isArray(id) ? id[0] : id);
      
      if (!result.trip) {
        res.status(400).json({ 
          error: 'Trip start failed', 
          details: result.errors
        });
        return;
      }
      
      res.status(200).json(result.trip);
    } catch (error) {
      next(error);
    }
  };

  completeTrip = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const { actualDistance, actualDuration } = req.body;
      
      const result = this.tripService.completeTrip(
        Array.isArray(id) ? id[0] : id, 
        actualDistance, 
        actualDuration
      );
      
      if (!result.trip) {
        res.status(400).json({ 
          error: 'Trip completion failed', 
          details: result.errors
        });
        return;
      }
      
      res.status(200).json(result.trip);
    } catch (error) {
      next(error);
    }
  };

  cancelTrip = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const result = this.tripService.cancelTrip(Array.isArray(id) ? id[0] : id);
      
      if (!result.trip) {
        res.status(400).json({ 
          error: 'Trip cancellation failed', 
          details: result.errors
        });
        return;
      }
      
      res.status(200).json(result.trip);
    } catch (error) {
      next(error);
    }
  };
}