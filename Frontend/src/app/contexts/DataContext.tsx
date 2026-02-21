import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Data interfaces
export interface Vehicle {
  id: string;
  name: string;
  model: string;
  licensePlate: string;
  type: string;
  capacity: string;
  odometer: string;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  lastService: string;
  region: string;
  year?: number;
  mileage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  phone: string;
  email: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  currentVehicle?: string;
  totalTrips: number;
  rating: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  status: 'Draft' | 'Scheduled' | 'In Transit' | 'Completed';
  progress: number;
  startDate?: string;
  endDate?: string;
  cargoLoad: number;
  cargoCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  scheduledDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  vehicleId?: string;
  tripId?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

// Data state interface
interface DataState {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: Maintenance[];
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

// Action types
type DataAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VEHICLES'; payload: Vehicle[] }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: { id: string; data: Partial<Vehicle> } }
  | { type: 'DELETE_VEHICLE'; payload: string }
  | { type: 'SET_DRIVERS'; payload: Driver[] }
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'UPDATE_DRIVER'; payload: { id: string; data: Partial<Driver> } }
  | { type: 'DELETE_DRIVER'; payload: string }
  | { type: 'SET_TRIPS'; payload: Trip[] }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: { id: string; data: Partial<Trip> } }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'SET_MAINTENANCE'; payload: Maintenance[] }
  | { type: 'ADD_MAINTENANCE'; payload: Maintenance }
  | { type: 'UPDATE_MAINTENANCE'; payload: { id: string; data: Partial<Maintenance> } }
  | { type: 'DELETE_MAINTENANCE'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; data: Partial<Expense> } }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload?: Partial<DataState> };

// Initial state
const initialState: DataState = {
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  expenses: [],
  loading: false,
  error: null,
};

// Reducer
function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload };
    
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id
            ? { ...vehicle, ...action.payload.data }
            : vehicle
        ),
      };
    
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== action.payload),
      };
    
    case 'SET_DRIVERS':
      return { ...state, drivers: action.payload };
    
    case 'ADD_DRIVER':
      return { ...state, drivers: [...state.drivers, action.payload] };
    
    case 'UPDATE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.map(driver =>
          driver.id === action.payload.id
            ? { ...driver, ...action.payload.data }
            : driver
        ),
      };
    
    case 'DELETE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.filter(driver => driver.id !== action.payload),
      };
    
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] };
    
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.id === action.payload.id
            ? { ...trip, ...action.payload.data }
            : trip
        ),
      };
    
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload),
      };
    
    case 'SET_MAINTENANCE':
      return { ...state, maintenance: action.payload };
    
    case 'ADD_MAINTENANCE':
      return { ...state, maintenance: [...state.maintenance, action.payload] };
    
    case 'UPDATE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.map(maint =>
          maint.id === action.payload.id
            ? { ...maint, ...action.payload.data }
            : maint
        ),
      };
    
    case 'DELETE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.filter(maint => maint.id !== action.payload),
      };
    
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id
            ? { ...expense, ...action.payload.data }
            : expense
        ),
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Storage utilities
const STORAGE_KEY = 'fleetflow_data';

const saveToStorage = (state: DataState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

const loadFromStorage = (): Partial<DataState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return {};
  }
};

// Context
const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
} | null>(null);

// Provider component
interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = loadFromStorage();
    if (Object.keys(storedData).length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedData });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (state.vehicles.length > 0 || state.drivers.length > 0 || state.trips.length > 0) {
      saveToStorage(state);
    }
  }, [state]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

// Hook to use the context
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Helper functions for common operations
export function useDataHelpers() {
  const { state, dispatch } = useData();

  const getVehicleById = (id: string) => state.vehicles.find(v => v.id === id);
  const getDriverById = (id: string) => state.drivers.find(d => d.id === id);
  const getTripById = (id: string) => state.trips.find(t => t.id === id);

  const getVehiclesByStatus = (status: Vehicle['status']) => 
    state.vehicles.filter(v => v.status === status);
  
  const getDriversByStatus = (status: Driver['status']) => 
    state.drivers.filter(d => d.status === status);
  
  const getTripsByStatus = (status: Trip['status']) => 
    state.trips.filter(t => t.status === status);

  const getTripsByVehicle = (vehicleId: string) => 
    state.trips.filter(t => t.vehicleId === vehicleId);
  
  const getTripsByDriver = (driverId: string) => 
    state.trips.filter(t => t.driverId === driverId);

  return {
    ...state,
    dispatch,
    getVehicleById,
    getDriverById,
    getTripById,
    getVehiclesByStatus,
    getDriversByStatus,
    getTripsByStatus,
    getTripsByVehicle,
    getTripsByDriver,
  };
}
