import { useState } from 'react';
import { MapPin, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

interface Trip {
  id: string;
  vehicle: string;
  driver: string;
  origin: string;
  destination: string;
  cargoWeight: number;
  maxCapacity: number;
  status: 'Draft' | 'Scheduled' | 'In Transit' | 'Completed';
  departureDate: string;
  estimatedArrival: string;
}

const trips: Trip[] = [
  {
    id: 'TRP-2401',
    vehicle: 'Volvo FH16 - VN-4523',
    driver: 'Mike Johnson',
    origin: 'Mumbai',
    destination: 'Delhi',
    cargoWeight: 26,
    maxCapacity: 28,
    status: 'In Transit',
    departureDate: '2026-02-20',
    estimatedArrival: '2026-02-22',
  },
  {
    id: 'TRP-2402',
    vehicle: 'Tata Prima - MH-7821',
    driver: 'Sarah Williams',
    origin: 'Chennai',
    destination: 'Bangalore',
    cargoWeight: 22,
    maxCapacity: 25,
    status: 'Scheduled',
    departureDate: '2026-02-21',
    estimatedArrival: '2026-02-22',
  },
  {
    id: 'TRP-2403',
    vehicle: 'Ashok Leyland - KA-9214',
    driver: 'Robert Brown',
    origin: 'Kolkata',
    destination: 'Pune',
    cargoWeight: 15,
    maxCapacity: 18,
    status: 'Draft',
    departureDate: '2026-02-23',
    estimatedArrival: '2026-02-25',
  },
];

const stepStages = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'In Transit', value: 'In Transit' },
  { label: 'Completed', value: 'Completed' },
];

export default function TripDispatcher() {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [error, setError] = useState('');

  const maxCapacity = 28; // This would be fetched from selected vehicle

  const handleCreateTrip = () => {
    setError('');
    
    const weight = parseFloat(cargoWeight);
    if (weight > maxCapacity) {
      setError(`Cargo weight exceeds vehicle capacity of ${maxCapacity} tons`);
      toast.error('Validation Error', {
        description: `Cargo weight exceeds vehicle capacity of ${maxCapacity} tons`,
      });
      return;
    }

    toast.success('Trip Created', {
      description: 'Trip has been successfully created and saved as draft',
    });

    // Reset form
    setSelectedVehicle('');
    setSelectedDriver('');
    setOrigin('');
    setDestination('');
    setCargoWeight('');
    setDepartureDate('');
  };

  const getStepStatus = (tripStatus: string, stepValue: string) => {
    const statusOrder = ['Draft', 'Scheduled', 'In Transit', 'Completed'];
    const tripIndex = statusOrder.indexOf(tripStatus);
    const stepIndex = statusOrder.indexOf(stepValue);
    
    if (stepIndex < tripIndex) return 'completed';
    if (stepIndex === tripIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Trip Dispatcher</h1>
        <p className="text-muted-foreground">
          Create and manage delivery trips with real-time tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip Creation Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create New Trip</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details to dispatch a vehicle
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Select Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Choose vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volvo-vn4523">Volvo FH16 - VN-4523 (28t)</SelectItem>
                  <SelectItem value="tata-mh7821">Tata Prima - MH-7821 (25t)</SelectItem>
                  <SelectItem value="ashok-ka9214">Ashok Leyland - KA-9214 (18t)</SelectItem>
                  <SelectItem value="mahindra-dl3267">Mahindra Blazo - DL-3267 (30t)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver">Select Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Choose driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                  <SelectItem value="robert">Robert Brown</SelectItem>
                  <SelectItem value="emily">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  placeholder="e.g., Mumbai"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Delhi"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo Weight (tons)</Label>
              <Input
                id="cargo"
                type="number"
                placeholder="e.g., 24"
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value)}
              />
              {selectedVehicle && (
                <p className="text-xs text-muted-foreground">
                  Max capacity: {maxCapacity} tons
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departure">Departure Date</Label>
              <Input
                id="departure"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedVehicle('');
                  setSelectedDriver('');
                  setOrigin('');
                  setDestination('');
                  setCargoWeight('');
                  setDepartureDate('');
                  setError('');
                }}
              >
                Clear
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateTrip}
              >
                Create Trip
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Trips List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active & Scheduled Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="in-transit">In Transit</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-5 border rounded-lg hover:border-blue-300 transition-colors bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900">{trip.id}</h3>
                          <Badge
                            variant="secondary"
                            className={
                              trip.status === 'In Transit'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                : trip.status === 'Scheduled'
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                                : trip.status === 'Draft'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                : 'bg-green-100 text-green-700 hover:bg-green-100'
                            }
                          >
                            {trip.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{trip.vehicle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">Driver: {trip.driver}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Departs: {new Date(trip.departureDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-gray-900">{trip.origin}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-gray-900">{trip.destination}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Cargo Load</p>
                        <p className="text-sm text-gray-900">
                          {trip.cargoWeight} / {trip.maxCapacity} tons
                        </p>
                      </div>
                      <div className="flex-1 max-w-xs mx-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              (trip.cargoWeight / trip.maxCapacity) * 100 > 90
                                ? 'bg-red-500'
                                : (trip.cargoWeight / trip.maxCapacity) * 100 > 75
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${(trip.cargoWeight / trip.maxCapacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-900">
                        {Math.round((trip.cargoWeight / trip.maxCapacity) * 100)}%
                      </p>
                    </div>

                    {/* Trip Lifecycle Steps */}
                    <div className="flex items-center justify-between">
                      {stepStages.map((step, index) => {
                        const status = getStepStatus(trip.status, step.value);
                        return (
                          <div key={step.value} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  status === 'completed'
                                    ? 'bg-emerald-500 text-white'
                                    : status === 'current'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                {status === 'completed' ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : status === 'current' ? (
                                  <Clock className="w-4 h-4" />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {step.label}
                              </p>
                            </div>
                            {index < stepStages.length - 1 && (
                              <div
                                className={`w-12 h-0.5 mx-1 ${
                                  status === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
