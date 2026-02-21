import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleStatus } from './vehicle.model';

export class VehicleService {
  private vehicles: Vehicle[] = [];
  private nextId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleVehicles: Vehicle[] = [
      {
        id: (this.nextId++).toString(),
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        licensePlate: 'ABC-123',
        status: VehicleStatus.ACTIVE,
        mileage: 15000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: (this.nextId++).toString(),
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        licensePlate: 'XYZ-789',
        status: VehicleStatus.ACTIVE,
        mileage: 25000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: (this.nextId++).toString(),
        make: 'Ford',
        model: 'F-150',
        year: 2020,
        licensePlate: 'DEF-456',
        status: VehicleStatus.MAINTENANCE,
        mileage: 45000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.vehicles = sampleVehicles;
  }

  getAllVehicles(): Vehicle[] {
    return [...this.vehicles];
  }

  getVehicleById(id: string): Vehicle | null {
    return this.vehicles.find(vehicle => vehicle.id === id) || null;
  }

  createVehicle(vehicleData: CreateVehicleRequest): Vehicle {
    const newVehicle: Vehicle = {
      id: (this.nextId++).toString(),
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      licensePlate: vehicleData.licensePlate,
      status: vehicleData.status || VehicleStatus.ACTIVE,
      mileage: vehicleData.mileage || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  updateVehicle(id: string, updateData: UpdateVehicleRequest): Vehicle | null {
    const vehicleIndex = this.vehicles.findIndex(vehicle => vehicle.id === id);
    
    if (vehicleIndex === -1) {
      return null;
    }

    const existingVehicle = this.vehicles[vehicleIndex];
    const updatedVehicle: Vehicle = {
      ...existingVehicle,
      ...updateData,
      updatedAt: new Date()
    };

    this.vehicles[vehicleIndex] = updatedVehicle;
    return updatedVehicle;
  }

  deleteVehicle(id: string): boolean {
    const vehicleIndex = this.vehicles.findIndex(vehicle => vehicle.id === id);
    
    if (vehicleIndex === -1) {
      return false;
    }

    this.vehicles.splice(vehicleIndex, 1);
    return true;
  }

  getVehiclesByStatus(status: VehicleStatus): Vehicle[] {
    return this.vehicles.filter(vehicle => vehicle.status === status);
  }

  searchVehicles(query: string): Vehicle[] {
    const lowerQuery = query.toLowerCase();
    return this.vehicles.filter(vehicle => 
      vehicle.make.toLowerCase().includes(lowerQuery) ||
      vehicle.model.toLowerCase().includes(lowerQuery) ||
      vehicle.licensePlate.toLowerCase().includes(lowerQuery)
    );
  }
}