import { UserCircle2, TrendingUp, AlertTriangle, CheckCircle2, Award, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Switch } from '../components/ui/switch';

interface Driver {
  id: string;
  name: string;
  initials: string;
  licenseNumber: string;
  licenseExpiry: string;
  phoneNumber: string;
  status: 'On Duty' | 'Off Duty' | 'Suspended';
  safetyScore: number;
  totalTrips: number;
  onTimeDelivery: number;
  experience: string;
  specializations: string[];
  currentAssignment?: string;
}

const drivers: Driver[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    initials: 'MJ',
    licenseNumber: 'DL-2034-8765-1234',
    licenseExpiry: '2028-12-15',
    phoneNumber: '+91 98765 43210',
    status: 'On Duty',
    safetyScore: 94,
    totalTrips: 247,
    onTimeDelivery: 96,
    experience: '8 years',
    specializations: ['Heavy Cargo', 'Long Haul'],
    currentAssignment: 'TRP-2401 (Mumbai → Delhi)',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    initials: 'SW',
    licenseNumber: 'DL-2035-9012-5678',
    licenseExpiry: '2027-08-22',
    phoneNumber: '+91 98765 43211',
    status: 'On Duty',
    safetyScore: 98,
    totalTrips: 312,
    onTimeDelivery: 98,
    experience: '10 years',
    specializations: ['Hazmat', 'Interstate'],
    currentAssignment: 'TRP-2402 (Chennai → Bangalore)',
  },
  {
    id: '3',
    name: 'Robert Brown',
    initials: 'RB',
    licenseNumber: 'DL-2036-3456-9012',
    licenseExpiry: '2026-03-10',
    phoneNumber: '+91 98765 43212',
    status: 'Off Duty',
    safetyScore: 89,
    totalTrips: 189,
    onTimeDelivery: 92,
    experience: '6 years',
    specializations: ['Regional', 'Perishables'],
  },
  {
    id: '4',
    name: 'Emily Davis',
    initials: 'ED',
    licenseNumber: 'DL-2037-7890-3456',
    licenseExpiry: '2029-01-18',
    phoneNumber: '+91 98765 43213',
    status: 'Off Duty',
    safetyScore: 91,
    totalTrips: 156,
    onTimeDelivery: 94,
    experience: '5 years',
    specializations: ['Urban', 'Express Delivery'],
  },
  {
    id: '5',
    name: 'David Martinez',
    initials: 'DM',
    licenseNumber: 'DL-2038-1234-7890',
    licenseExpiry: '2025-11-05',
    phoneNumber: '+91 98765 43214',
    status: 'Suspended',
    safetyScore: 72,
    totalTrips: 98,
    onTimeDelivery: 85,
    experience: '3 years',
    specializations: ['Local', 'Light Cargo'],
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreBg = (score: number) => {
  if (score >= 90) return 'bg-green-100';
  if (score >= 80) return 'bg-amber-100';
  return 'bg-red-100';
};

const isLicenseExpiringSoon = (expiryDate: string) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 90;
};

export default function Drivers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Driver Management</h1>
        <p className="text-muted-foreground">
          Monitor driver performance, safety scores, and license validity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-2xl text-gray-900 mt-1">42</p>
              </div>
              <UserCircle2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Duty</p>
                <p className="text-2xl text-green-600 mt-1">24</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Safety Score</p>
                <p className="text-2xl text-emerald-600 mt-1">92</p>
              </div>
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">License Alerts</p>
                <p className="text-2xl text-amber-600 mt-1">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {drivers.map((driver) => {
          const licenseExpiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
          return (
            <Card key={driver.id} className={licenseExpiringSoon ? 'border-amber-300' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 bg-blue-600 text-white">
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {driver.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="text-gray-900">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">{driver.experience} experience</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          driver.status === 'On Duty'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : driver.status === 'Suspended'
                            ? 'bg-red-100 text-red-700 hover:bg-red-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                        }
                      >
                        {driver.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span>{driver.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* License Info */}
                <div className={`p-3 rounded-lg mb-4 ${licenseExpiringSoon ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">License Number</p>
                      <p className="text-sm text-gray-900">{driver.licenseNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                      <div className="flex items-center gap-1">
                        {licenseExpiringSoon && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <p className={`text-sm ${licenseExpiringSoon ? 'text-amber-600' : 'text-green-600'}`}>
                          {new Date(driver.licenseExpiry).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {licenseExpiringSoon && (
                    <p className="text-xs text-amber-600 mt-2">⚠ License expiring within 90 days</p>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${getScoreBg(driver.safetyScore)}`}>
                    <p className="text-xs text-muted-foreground mb-1">Safety Score</p>
                    <p className={`text-xl ${getScoreColor(driver.safetyScore)}`}>
                      {driver.safetyScore}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Trips</p>
                    <p className="text-xl text-blue-600">{driver.totalTrips}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">On-Time %</p>
                    <p className="text-xl text-purple-600">{driver.onTimeDelivery}%</p>
                  </div>
                </div>

                {/* Safety Score Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Safety Performance</span>
                    <span className={getScoreColor(driver.safetyScore)}>
                      {driver.safetyScore >= 90 ? 'Excellent' : driver.safetyScore >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <Progress value={driver.safetyScore} className="h-2" />
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current Assignment */}
                {driver.currentAssignment && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-muted-foreground">Current Trip:</span>
                      <span className="text-blue-600">{driver.currentAssignment}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={driver.status === 'On Duty'}
                      disabled={driver.status === 'Suspended'}
                    />
                    <span className="text-sm text-muted-foreground">
                      {driver.status === 'On Duty' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700">View Profile</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-blue-600 hover:text-blue-700">Trip History</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers (This Month)</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Drivers with exceptional safety and delivery records
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers
              .filter((d) => d.safetyScore >= 90)
              .slice(0, 3)
              .map((driver, index) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                          ? 'bg-gray-400'
                          : 'bg-orange-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10 bg-blue-600 text-white">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {driver.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-900">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {driver.totalTrips} trips • {driver.onTimeDelivery}% on-time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Safety Score</p>
                      <p className="text-lg text-green-600">{driver.safetyScore}</p>
                    </div>
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
