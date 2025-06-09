import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [vibrationData, setVibrationData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Generate mock vibration data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 1000);
        data.push({
          time: time.toLocaleTimeString(),
          machine1: 1.2 + Math.random() * 0.8,
          machine2: 2.1 + Math.random() * 1.2,
          machine3: 0.8 + Math.random() * 0.5,
          machine4: 3.2 + Math.random() * 2.1,
        });
      }
      setVibrationData(data);
    };

    generateData();
    const interval = setInterval(generateData, 2000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const equipmentData = [
    { id: "A-001", name: "Compressor Unit 1", vibration: 1.8, status: "normal", temp: 45 },
    { id: "A-002", name: "Pump Station 2", vibration: 4.2, status: "warning", temp: 58 },
    { id: "A-003", name: "Generator 1", vibration: 0.9, status: "normal", temp: 42 },
    { id: "A-004", name: "Motor Drive 3", vibration: 6.1, status: "fault", temp: 72 },
    { id: "A-005", name: "Conveyor Belt A", vibration: 2.1, status: "normal", temp: 38 },
    { id: "A-006", name: "Turbine Unit 1", vibration: 5.8, status: "warning", temp: 65 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "normal": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "warning": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "fault": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "normal": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <Clock className="h-4 w-4" />;
      case "fault": return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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
            <Link to="/dashboard" className="text-green-400">Dashboard</Link>
            <Link to="/status" className="hover:text-green-400 transition-colors">System Status</Link>
            <Link to="/logs" className="hover:text-green-400 transition-colors">Logs</Link>
            <Link to="/upload" className="hover:text-green-400 transition-colors">Upload Report</Link>
          </div>
          <div className="text-sm text-slate-400">
            {currentTime.toLocaleString()}
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Monitoring Dashboard</h1>
          <p className="text-slate-400">Real-time vibration analysis and equipment health monitoring</p>
        </div>

        {/* Real-time Chart */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Real-Time Vibration Data</CardTitle>
            <p className="text-slate-400 text-sm">Vibration amplitude (mm/s) over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vibrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line type="monotone" dataKey="machine1" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="machine2" stroke="#eab308" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="machine3" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="machine4" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Equipment Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentData.map((equipment) => (
              <Card key={equipment.id} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{equipment.name}</CardTitle>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(equipment.status)}`}>
                      {getStatusIcon(equipment.status)}
                      <span className="text-xs font-medium capitalize">{equipment.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">ID: {equipment.id}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Vibration:</span>
                      <span className="font-mono font-bold text-white">{equipment.vibration.toFixed(1)} mm/s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Temperature:</span>
                      <span className="font-mono text-white">{equipment.temp}°C</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          equipment.vibration < 2 ? 'bg-green-400' : 
                          equipment.vibration < 5 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.min((equipment.vibration / 8) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Vibration Thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">Normal</p>
                  <p className="text-sm text-slate-400">{'< 2.0 mm/s'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">Warning</p>
                  <p className="text-sm text-slate-400">2.0 - 5.0 mm/s</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">Fault</p>
                  <p className="text-sm text-slate-400">{'> 5.0 mm/s'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
