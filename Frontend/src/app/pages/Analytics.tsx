import { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { TrendingUp, Download, DollarSign, Fuel, TrendingDown, Activity } from 'lucide-react';

interface RevenueData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface FuelEfficiencyData {
  month: string;
  efficiency: number;
}

interface VehiclePerformance {
  vehicle: string;
  utilization: number;
  efficiency: number;
  reliability: number;
  onTime: number;
  safety: number;
}

interface ROIData {
  name: string;
  roi: number;
  revenue: number;
  cost: number;
}

interface RadarDataPoint {
  metric: string;
  value: number;
  fullMark?: number;
}

interface RegionalPerformance {
  region: string;
  trips: number;
  revenue: number;
  growth: number;
}

const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 485000, cost: 227000, profit: 258000 },
  { month: 'Feb', revenue: 512000, cost: 230000, profit: 282000 },
  { month: 'Mar', revenue: 478000, cost: 233000, profit: 245000 },
  { month: 'Apr', revenue: 545000, cost: 246000, profit: 299000 },
  { month: 'May', revenue: 589000, cost: 243000, profit: 346000 },
  { month: 'Jun', revenue: 612000, cost: 229000, profit: 383000 },
];

const fuelEfficiencyData: FuelEfficiencyData[] = [
  { month: 'Jan', efficiency: 4.1 },
  { month: 'Feb', efficiency: 4.3 },
  { month: 'Mar', efficiency: 4.0 },
  { month: 'Apr', efficiency: 4.5 },
  { month: 'May', efficiency: 4.6 },
  { month: 'Jun', efficiency: 4.8 },
];

const vehiclePerformance: VehiclePerformance[] = [
  {
    vehicle: 'Volvo FH16',
    utilization: 95,
    efficiency: 92,
    reliability: 88,
    onTime: 96,
    safety: 94,
  },
  {
    vehicle: 'Tata Prima',
    utilization: 88,
    efficiency: 85,
    reliability: 90,
    onTime: 92,
    safety: 98,
  },
  {
    vehicle: 'Scania R500',
    utilization: 92,
    efficiency: 95,
    reliability: 94,
    onTime: 98,
    safety: 91,
  },
];

const roiData: ROIData[] = [
  { name: 'Volvo FH16', roi: 145, revenue: 285000, cost: 117000 },
  { name: 'Tata Prima', roi: 132, revenue: 245000, cost: 105000 },
  { name: 'Scania R500', roi: 168, revenue: 348000, cost: 130000 },
  { name: 'BharatBenz', roi: 125, revenue: 198000, cost: 88000 },
];

const regionalPerformance: RegionalPerformance[] = [
  { region: 'North', trips: 245, revenue: 1250000, growth: 12 },
  { region: 'South', trips: 198, revenue: 980000, growth: 8 },
  { region: 'East', trips: 156, revenue: 780000, growth: -3 },
  { region: 'West', trips: 223, revenue: 1150000, growth: 15 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>('6m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Executive insights and financial performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={(value: string) => setTimeRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl text-gray-900 mt-1">₹32.21L</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl text-gray-900 mt-1">₹22.70L</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl text-gray-900 mt-1">₹9.51L</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl text-green-600 mt-1">29.5%</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Monthly revenue, costs, and profit analysis
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 700000]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="#10b981"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="#f59e0b"
                name="Operating Cost"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#1e40af"
                strokeWidth={2}
                fill="#1e40af"
                name="Net Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fuel Efficiency Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Fuel Efficiency Trend</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Average km per liter across all vehicles
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={fuelEfficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[3.5, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `${value} km/L`}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vehicle ROI */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Return on Investment</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue performance by vehicle model
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'roi') return `${value}%`;
                  return `₹${value.toLocaleString()}`;
                }}
              />
              <Bar dataKey="roi" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vehicle Performance Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Vehicle Performance</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive performance metrics across key dimensions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {vehiclePerformance.map((vehicle) => (
              <div key={vehicle.vehicle}>
                <h4 className="text-center mb-4 text-gray-900">{vehicle.vehicle}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={Object.entries(vehicle).filter(([key]) => key !== 'vehicle').map(([key, value]) => ({
                    metric: key.charAt(0).toUpperCase() + key.slice(1),
                    value: value,
                    fullMark: 100,
                  }))}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" stroke="#64748b" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
                    <Radar
                      dataKey="value"
                      stroke="#1e40af"
                      fill="#1e40af"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Trip volume and revenue by operational region
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {regionalPerformance.map((region) => (
              <div key={region.region} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">{region.region}</h4>
                  <Badge variant="secondary" className={region.growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {region.growth > 0 ? '+' : ''}{Math.abs(region.growth)}%
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Trips</p>
                  <p className="text-2xl font-semibold">{region.trips}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-semibold">₹{(region.revenue / 100000).toFixed(2)}L</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Revenue Growth Accelerating</h4>
                  <p className="text-sm text-muted-foreground">
                    Monthly revenue increased by 18% compared to last period. West region showing strongest performance.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Fuel className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Fuel Efficiency Improving</h4>
                  <p className="text-sm text-muted-foreground">
                    Fleet efficiency reached 4.8 km/L, a 12% improvement. Scania R500 leading with 95% efficiency rating.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">High Utilization Rates</h4>
                  <p className="text-sm text-muted-foreground">
                    Fleet utilization at 91%. Consider expanding capacity in North and West regions to meet demand.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Strong ROI Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Average vehicle ROI of 145%. Mahindra Blazo and Scania R500 models showing exceptional returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
