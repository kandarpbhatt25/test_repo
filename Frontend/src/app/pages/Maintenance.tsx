import { Wrench, AlertTriangle, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

interface MaintenanceRecord {
  id: string;
  vehicle: string;
  licensePlate: string;
  serviceType: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  scheduledDate: string;
  completedDate?: string;
  technician?: string;
  cost?: number;
  odometer: string;
}

const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'MNT-001',
    vehicle: 'Volvo FH16',
    licensePlate: 'VN-4523',
    serviceType: 'Scheduled Service',
    description: 'Regular 15,000 km maintenance service',
    priority: 'Medium',
    status: 'Scheduled',
    scheduledDate: '2026-02-24',
    odometer: '142,500 km',
  },
  {
    id: 'MNT-002',
    vehicle: 'Tata Prima',
    licensePlate: 'MH-7821',
    serviceType: 'Brake System',
    description: 'Brake pad replacement and inspection',
    priority: 'High',
    status: 'In Progress',
    scheduledDate: '2026-02-20',
    technician: 'David Martinez',
    odometer: '98,250 km',
  },
  {
    id: 'MNT-003',
    vehicle: 'Scania R500',
    licensePlate: 'GJ-1892',
    serviceType: 'Oil Change',
    description: 'Engine oil and filter replacement',
    priority: 'Low',
    status: 'Scheduled',
    scheduledDate: '2026-02-28',
    odometer: '203,450 km',
  },
  {
    id: 'MNT-004',
    vehicle: 'Mahindra Blazo',
    licensePlate: 'DL-3267',
    serviceType: 'Tire Replacement',
    description: 'Replace worn front tires',
    priority: 'Critical',
    status: 'Overdue',
    scheduledDate: '2026-02-18',
    odometer: '156,900 km',
  },
  {
    id: 'MNT-005',
    vehicle: 'BharatBenz',
    licensePlate: 'TN-5643',
    serviceType: 'Annual Inspection',
    description: 'Comprehensive annual vehicle inspection',
    priority: 'Medium',
    status: 'Completed',
    scheduledDate: '2026-02-15',
    completedDate: '2026-02-16',
    technician: 'Lisa Anderson',
    cost: 8500,
    odometer: '45,200 km',
  },
];

const priorityConfig = {
  Low: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  Medium: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  High: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  Critical: 'bg-red-100 text-red-700 hover:bg-red-100',
};

const statusConfig = {
  Scheduled: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  'In Progress': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  Completed: 'bg-green-100 text-green-700 hover:bg-green-100',
  Overdue: 'bg-red-100 text-red-700 hover:bg-red-100',
};

export default function Maintenance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Maintenance & Service</h1>
        <p className="text-muted-foreground">
          Track vehicle maintenance schedules and service history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl text-blue-600 mt-1">5</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl text-purple-600 mt-1">2</p>
              </div>
              <Wrench className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl text-red-600 mt-1">1</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed (30d)</p>
                <p className="text-2xl text-green-600 mt-1">18</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule & History</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Chronological view of all maintenance activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceRecords.map((record) => (
              <div
                key={record.id}
                className={`p-5 border-l-4 rounded-lg bg-white ${
                  record.status === 'Overdue'
                    ? 'border-l-red-500 bg-red-50/30'
                    : record.status === 'In Progress'
                    ? 'border-l-purple-500'
                    : record.status === 'Completed'
                    ? 'border-l-green-500'
                    : 'border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-900">{record.id}</h3>
                      <Badge variant="secondary" className={statusConfig[record.status]}>
                        {record.status}
                      </Badge>
                      <Badge variant="secondary" className={priorityConfig[record.priority]}>
                        {record.priority} Priority
                      </Badge>
                      {record.status === 'In Progress' && (
                        <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                          Vehicle Unavailable
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="text-gray-900">
                        {record.vehicle} - {record.licensePlate}
                      </span>
                      <span>•</span>
                      <span>{record.odometer}</span>
                    </div>
                  </div>
                  {record.status !== 'Completed' && (
                    <Button size="sm" variant="outline">
                      {record.status === 'In Progress' ? 'Mark Complete' : 'Start Service'}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="text-sm text-gray-900">{record.serviceType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm text-gray-900">{record.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                      <p className="text-sm text-gray-900">
                        {new Date(record.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {record.completedDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-sm text-gray-900">
                          {new Date(record.completedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {record.technician && (
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Technician</p>
                        <p className="text-sm text-gray-900">{record.technician}</p>
                      </div>
                    </div>
                  )}
                  {record.cost && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Cost:</span>
                      <span className="text-sm text-gray-900">₹{record.cost.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {record.status === 'In Progress' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Service Progress</span>
                      <span className="text-gray-900">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance (Next 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-900">Volvo FH16 - VN-4523</p>
                  <p className="text-xs text-muted-foreground">Scheduled Service</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Feb 24</p>
                  <p className="text-xs text-amber-600">In 3 days</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-900">Scania R500 - GJ-1892</p>
                  <p className="text-xs text-muted-foreground">Oil Change</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Feb 28</p>
                  <p className="text-xs text-muted-foreground">In 7 days</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-900">Ashok Leyland - KA-9214</p>
                  <p className="text-xs text-muted-foreground">Tire Rotation</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Mar 05</p>
                  <p className="text-xs text-muted-foreground">In 12 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl text-gray-900 mt-1">₹42,500</p>
                </div>
                <div className="text-sm text-green-600">-12% from last month</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Routine Maintenance</span>
                  <span className="text-gray-900">₹28,000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Repairs</span>
                  <span className="text-gray-900">₹10,500</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Parts Replacement</span>
                  <span className="text-gray-900">₹4,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
