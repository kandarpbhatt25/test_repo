export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: VehicleStatus;
  mileage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status?: VehicleStatus;
  mileage?: number;
}

export interface UpdateVehicleRequest {
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  status?: VehicleStatus;
  mileage?: number;
}