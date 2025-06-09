
import { Link } from "react-router-dom";
import { Activity, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Status = () => {
  const statusData = [
    { name: 'Healthy', value: 18, color: '#22c55e' },
    { name: 'Warning', value: 3, color: '#eab308' },
    { name: 'Fault', value: 3, color: '#ef4444' }
  ];

  const allEquipment = [
    { id: "A-001", name: "Compressor Unit 1", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-002", name: "Pump Station 2", status: "warning", lastCheck: "1 min ago" },
    { id: "A-003", name: "Generator 1", status: "healthy", lastCheck: "3 min ago" },
    { id: "A-004", name: "Motor Drive 3", status: "fault", lastCheck: "30 sec ago" },
    { id: "A-005", name: "Conveyor Belt A", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-006", name: "Turbine Unit 1", status: "warning", lastCheck: "1 min ago" },
    { id: "A-007", name: "Hydraulic Press 1", status: "healthy", lastCheck: "4 min ago" },
    { id: "A-008", name: "Air Compressor 2", status: "fault", lastCheck: "45 sec ago" },
    { id: "A-009", name: "Cooling Fan Array", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-010", name: "Conveyor Belt B", status: "healthy", lastCheck: "3 min ago" },
    { id: "A-011", name: "Boiler Unit 1", status: "warning", lastCheck: "1 min ago" },
    { id: "A-012", name: "CNC Machine 1", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-013", name: "Robotic Arm 1", status: "healthy", lastCheck: "90 sec ago" },
    { id: "A-014", name: "Packaging Unit", status: "fault", lastCheck: "20 sec ago" },
    { id: "A-015", name: "Quality Scanner", status: "healthy", lastCheck: "3 min ago" },
    { id: "A-016", name: "Material Handler", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-017", name: "Ventilation System", status: "healthy", lastCheck: "4 min ago" },
    { id: "A-018", name: "Emergency Generator", status: "healthy", lastCheck: "5 min ago" },
    { id: "A-019", name: "Water Pump 1", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-020", name: "Backup Compressor", status: "healthy", lastCheck: "3 min ago" },
    { id: "A-021", name: "Main Motor Drive", status: "healthy", lastCheck: "1 min ago" },
    { id: "A-022", name: "Secondary Pump", status: "healthy", lastCheck: "2 min ago" },
    { id: "A-023", name: "Climate Control", status: "healthy", lastCheck: "4 min ago" },
    { id: "A-024", name: "Power Distribution", status: "healthy", lastCheck: "3 min ago" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning": return <Clock className="h-4 w-4 text-yellow-400" />;
      case "fault": return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy": return "border-l-green-400 bg-green-400/5";
      case "warning": return "border-l-yellow-400 bg-yellow-400/5";
      case "fault": return "border-l-red-400 bg-red-400/5";
      default: return "border-l-slate-400 bg-slate-400/5";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">Industrial Monitor</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link>
            <Link to="/status" className="text-green-400">System Status</Link>
            <Link to="/logs" className="hover:text-green-400 transition-colors">Logs</Link>
            <Link to="/upload" className="hover:text-green-400 transition-colors">Upload Report</Link>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Health Status</h1>
          <p className="text-slate-400">Complete overview of all monitored equipment</p>
          <p className="text-sm text-slate-500 mt-1">Last updated: {new Date().toLocaleString()}</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Equipment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Equipment</p>
                    <p className="text-3xl font-bold text-white">24</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">System Health</p>
                    <p className="text-3xl font-bold text-green-400">75%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Critical Issues</p>
                    <p className="text-3xl font-bold text-red-400">3</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Equipment Grid */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allEquipment.map((equipment) => (
                <div
                  key={equipment.id}
                  className={`p-4 rounded-lg border-l-4 ${getStatusColor(equipment.status)} bg-slate-700/50`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white text-sm">{equipment.name}</h3>
                    {getStatusIcon(equipment.status)}
                  </div>
                  <p className="text-xs text-slate-400 mb-1">ID: {equipment.id}</p>
                  <p className="text-xs text-slate-500">Last check: {equipment.lastCheck}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Threshold Legend */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium text-white">Healthy</p>
                  <p className="text-sm text-slate-400">Normal operation, vibration {'< 2.0 mm/s'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-white">Warning</p>
                  <p className="text-sm text-slate-400">Elevated levels, vibration 2.0-5.0 mm/s</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-white">Fault</p>
                  <p className="text-sm text-slate-400">Critical condition, vibration {'> 5.0 mm/s'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Status;
