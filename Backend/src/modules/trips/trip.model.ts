export enum TripStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELAYED = 'delayed'
}

export enum TripPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  cargoWeight: number;
  estimatedDistance: number;
  estimatedDuration: number;
  actualDistance?: number;
  actualDuration?: number;
  status: TripStatus;
  priority: TripPriority;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripRequest {
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  cargoWeight: number;
  estimatedDistance: number;
  estimatedDuration: number;
  priority?: TripPriority;
}

export interface UpdateTripRequest {
  vehicleId?: string;
  driverId?: string;
  origin?: string;
  destination?: string;
  cargoWeight?: number;
  estimatedDistance?: number;
  estimatedDuration?: number;
  actualDistance?: number;
  actualDuration?: number;
  status?: TripStatus;
  priority?: TripPriority;
  startTime?: string;
  endTime?: string;
}

export interface TripValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}