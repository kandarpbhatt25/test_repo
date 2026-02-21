import {
  Truck,
  AlertTriangle,
  TrendingUp,
  Package,
  Activity,
  MapPin,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const fleetUtilizationData = [
  { month: 'Jan', utilization: 78 },
  { month: 'Feb', utilization: 82 },
  { month: 'Mar', utilization: 75 },
  { month: 'Apr', utilization: 88 },
  { month: 'May', utilization: 85 },
  { month: 'Jun', utilization: 91 },
];

const vehicleStatusData = [
  { name: 'Active', value: 24, color: '#10b981' },
  { name: 'In Maintenance', value: 3, color: '#f59e0b' },
  { name: 'Available', value: 8, color: '#06b6d4' },
  { name: 'Retired', value: 2, color: '#64748b' },
];

const recentTrips = [
  {
    id: 'TRP-2401',
    vehicle: 'Volvo FH16 - VN-4523',
    driver: 'Mike Johnson',
    route: 'Mumbai → Delhi',
    status: 'In Transit',
    progress: 65,
  },
  {
    id: 'TRP-2402',
    vehicle: 'Tata Prima - MH-7821',
    driver: 'Sarah Williams',
    route: 'Chennai → Bangalore',
    status: 'In Transit',
    progress: 85,
  },
  {
    id: 'TRP-2403',
    vehicle: 'Ashok Leyland - KA-9214',
    driver: 'Robert Brown',
    route: 'Kolkata → Pune',
    status: 'Scheduled',
    progress: 0,
  },
  {
    id: 'TRP-2404',
    vehicle: 'Mahindra Blazo - DL-3267',
    driver: 'Emily Davis',
    route: 'Hyderabad → Ahmedabad',
    status: 'Completed',
    progress: 100,
  },
];

const maintenanceAlerts = [
  {
    vehicle: 'Volvo FH16 - VN-4523',
    issue: 'Scheduled Service',
    priority: 'Medium',
    dueDate: '3 days',
  },
  {
    vehicle: 'Tata Prima - MH-7821',
    issue: 'Brake Inspection',
    priority: 'High',
    dueDate: 'Overdue',
  },
  {
    vehicle: 'Scania R500 - GJ-1892',
    issue: 'Oil Change',
    priority: 'Low',
    dueDate: '7 days',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Command Center</h1>
        <p className="text-muted-foreground">
          Real-time overview of your fleet operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Fleet</CardTitle>
            <Truck className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">24</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Maintenance Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">3</div>
            <p className="text-xs text-muted-foreground">1 overdue, 2 upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Utilization Rate</CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">91%</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+6% efficiency gain</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending Cargo</CardTitle>
            <Package className="w-4 h-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">847 tons</div>
            <p className="text-xs text-muted-foreground">Across 12 shipments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Utilization Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fleet Utilization Trend</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Monthly utilization rate over 6 months
                </p>
              </div>
              <Select defaultValue="6months">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={fleetUtilizationData}>
                <defs>
                  <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#1e40af"
                  strokeWidth={2}
                  fill="url(#utilizationGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current fleet distribution
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {vehicleStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Live tracking of ongoing deliveries
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-900">{trip.id}</span>
                        <Badge
                          variant={
                            trip.status === 'In Transit'
                              ? 'default'
                              : trip.status === 'Completed'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={
                            trip.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : trip.status === 'Completed'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : ''
                          }
                        >
                          {trip.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{trip.vehicle}</p>
                    </div>
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{trip.driver}</span>
                    <span>•</span>
                    <span>{trip.route}</span>
                  </div>
                  <Progress value={trip.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Alerts</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Upcoming service requirements
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-900">{alert.vehicle}</span>
                    <Badge
                      variant={
                        alert.priority === 'High'
                          ? 'destructive'
                          : alert.priority === 'Medium'
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        alert.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          : alert.priority === 'Low'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          : ''
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{alert.issue}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due: {alert.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
