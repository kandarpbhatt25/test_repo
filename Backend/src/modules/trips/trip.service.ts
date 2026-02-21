import { Trip, CreateTripRequest, UpdateTripRequest, TripStatus, TripPriority } from './trip.model';
import { TripLifecycleManager } from './trip.lifecycle';
import { TripValidator } from './trip.validator';

export class TripService {
  private trips: Trip[] = [];
  private nextId = 1;
  private lifecycleManager: TripLifecycleManager;

  constructor() {
    this.lifecycleManager = new TripLifecycleManager();
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleTrips: Trip[] = [
      {
        id: (this.nextId++).toString(),
        vehicleId: '1',
        driverId: '1',
        origin: 'New York',
        destination: 'Boston',
        cargoWeight: 500,
        estimatedDistance: 300,
        estimatedDuration: 5,
        status: TripStatus.PLANNED,
        priority: TripPriority.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: (this.nextId++).toString(),
        vehicleId: '2',
        driverId: '2',
        origin: 'Los Angeles',
        destination: 'San Francisco',
        cargoWeight: 300,
        estimatedDistance: 600,
        estimatedDuration: 8,
        status: TripStatus.IN_PROGRESS,
        priority: TripPriority.HIGH,
        startTime: new Date(),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date()
      }
    ];

    this.trips = sampleTrips;
  }

  getAllTrips(): Trip[] {
    return [...this.trips];
  }

  getTripById(id: string): Trip | null {
    return this.trips.find(trip => trip.id === id) || null;
  }

  createTrip(tripData: CreateTripRequest): { trip: Trip | null; errors: string[]; warnings: string[] } {
    // Basic validation
    const basicValidation = TripValidator.validateCreateTrip(tripData);
    if (!basicValidation.isValid) {
      return {
        trip: null,
        errors: basicValidation.errors,
        warnings: basicValidation.warnings
      };
    }

    // Business rule validation
    const businessValidation = this.lifecycleManager.validateTripCreation(tripData);
    if (!businessValidation.isValid) {
      return {
        trip: null,
        errors: businessValidation.errors,
        warnings: businessValidation.warnings
      };
    }

    const newTrip: Trip = {
      id: (this.nextId++).toString(),
      vehicleId: tripData.vehicleId,
      driverId: tripData.driverId,
      origin: tripData.origin,
      destination: tripData.destination,
      cargoWeight: tripData.cargoWeight,
      estimatedDistance: tripData.estimatedDistance,
      estimatedDuration: tripData.estimatedDuration,
      status: TripStatus.PLANNED,
      priority: tripData.priority || TripPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trips.push(newTrip);
    return {
      trip: newTrip,
      errors: [],
      warnings: [...basicValidation.warnings, ...businessValidation.warnings]
    };
  }

  updateTrip(id: string, updateData: UpdateTripRequest): { trip: Trip | null; errors: string[]; warnings: string[] } {
    const tripIndex = this.trips.findIndex(trip => trip.id === id);
    
    if (tripIndex === -1) {
      return {
        trip: null,
        errors: ['Trip not found'],
        warnings: []
      };
    }

    const validation = TripValidator.validateUpdateTrip(updateData);
    if (!validation.isValid) {
      return {
        trip: null,
        errors: validation.errors,
        warnings: validation.warnings
      };
    }

    const existingTrip = this.trips[tripIndex];
    const updatedTrip: Trip = {
      ...existingTrip,
      ...updateData,
      startTime: updateData.startTime ? new Date(updateData.startTime) : existingTrip.startTime,
      endTime: updateData.endTime ? new Date(updateData.endTime) : existingTrip.endTime,
      updatedAt: new Date()
    };

    this.trips[tripIndex] = updatedTrip;
    return {
      trip: updatedTrip,
      errors: [],
      warnings: validation.warnings
    };
  }

  deleteTrip(id: string): { success: boolean; errors: string[] } {
    const tripIndex = this.trips.findIndex(trip => trip.id === id);
    
    if (tripIndex === -1) {
      return {
        success: false,
        errors: ['Trip not found']
      };
    }

    const trip = this.trips[tripIndex];
    
    // Can only delete planned or cancelled trips
    if (trip.status === TripStatus.IN_PROGRESS) {
      return {
        success: false,
        errors: ['Cannot delete trip that is in progress']
      };
    }

    // If trip is in progress, cancel it first
    if (trip.status === TripStatus.PLANNED) {
      this.trips.splice(tripIndex, 1);
      return {
        success: true,
        errors: []
      };
    }

    this.trips.splice(tripIndex, 1);
    return {
      success: true,
      errors: []
    };
  }

  startTrip(id: string): { trip: Trip | null; errors: string[] } {
    const trip = this.getTripById(id);
    
    if (!trip) {
      return {
        trip: null,
        errors: ['Trip not found']
      };
    }

    if (trip.status !== TripStatus.PLANNED) {
      return {
        trip: null,
        errors: ['Only planned trips can be started']
      };
    }

    const startedTrip = this.lifecycleManager.startTrip(trip);
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex !== -1) {
      this.trips[tripIndex] = startedTrip;
    }

    return {
      trip: startedTrip,
      errors: []
    };
  }

  completeTrip(id: string, actualDistance?: number, actualDuration?: number): { trip: Trip | null; errors: string[] } {
    const trip = this.getTripById(id);
    
    if (!trip) {
      return {
        trip: null,
        errors: ['Trip not found']
      };
    }

    if (trip.status !== TripStatus.IN_PROGRESS) {
      return {
        trip: null,
        errors: ['Only in-progress trips can be completed']
      };
    }

    const completedTrip = this.lifecycleManager.completeTrip(trip, actualDistance, actualDuration);
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex !== -1) {
      this.trips[tripIndex] = completedTrip;
    }

    return {
      trip: completedTrip,
      errors: []
    };
  }

  cancelTrip(id: string): { trip: Trip | null; errors: string[] } {
    const trip = this.getTripById(id);
    
    if (!trip) {
      return {
        trip: null,
        errors: ['Trip not found']
      };
    }

    if (trip.status === TripStatus.COMPLETED) {
      return {
        trip: null,
        errors: ['Cannot cancel completed trip']
      };
    }

    if (trip.status === TripStatus.CANCELLED) {
      return {
        trip: null,
        errors: ['Trip is already cancelled']
      };
    }

    const cancelledTrip = this.lifecycleManager.cancelTrip(trip);
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex !== -1) {
      this.trips[tripIndex] = cancelledTrip;
    }

    return {
      trip: cancelledTrip,
      errors: []
    };
  }

  getTripsByStatus(status: TripStatus): Trip[] {
    return this.trips.filter(trip => trip.status === status);
  }

  getTripsByDriver(driverId: string): Trip[] {
    return this.trips.filter(trip => trip.driverId === driverId);
  }

  getTripsByVehicle(vehicleId: string): Trip[] {
    return this.trips.filter(trip => trip.vehicleId === vehicleId);
  }

  searchTrips(query: string): Trip[] {
    const lowerQuery = query.toLowerCase();
    return this.trips.filter(trip => 
      trip.origin.toLowerCase().includes(lowerQuery) ||
      trip.destination.toLowerCase().includes(lowerQuery)
    );
  }
}