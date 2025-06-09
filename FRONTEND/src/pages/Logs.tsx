
import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Download, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Logs = () => {
  const [selectedMachine, setSelectedMachine] = useState("A-001");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock historical data
  const logData = [
    { date: "2024-01-15", time: "14:30", equipmentId: "A-001", avgVibration: 1.2, peak: 2.1, status: "normal", temp: 45 },
    { date: "2024-01-15", time: "14:29", equipmentId: "A-002", avgVibration: 4.8, peak: 6.2, status: "warning", temp: 58 },
    { date: "2024-01-15", time: "14:28", equipmentId: "A-004", avgVibration: 6.5, peak: 8.9, status: "fault", temp: 75 },
    { date: "2024-01-15", time: "14:27", equipmentId: "A-003", avgVibration: 0.9, peak: 1.4, status: "normal", temp: 42 },
    { date: "2024-01-15", time: "14:26", equipmentId: "A-005", avgVibration: 2.1, peak: 3.2, status: "normal", temp: 38 },
    { date: "2024-01-15", time: "14:25", equipmentId: "A-006", avgVibration: 5.2, peak: 7.1, status: "warning", temp: 62 },
  ];

  // Mock trend data for selected machine
  const trendData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${23 - i}:00`,
    vibration: selectedMachine === "A-001" ? 1.2 + Math.random() * 0.6 : 
               selectedMachine === "A-002" ? 4.0 + Math.random() * 1.5 :
               selectedMachine === "A-004" ? 6.0 + Math.random() * 2.0 : 1.0 + Math.random() * 0.8
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-400 bg-green-400/10";
      case "warning": return "text-yellow-400 bg-yellow-400/10";
      case "fault": return "text-red-400 bg-red-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  const filteredLogs = statusFilter === "all" ? logData : logData.filter(log => log.status === statusFilter);

  const exportData = (format: string) => {
    console.log(`Exporting data in ${format} format...`);
    // In a real app, this would generate and download the file
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
            <Link to="/status" className="hover:text-green-400 transition-colors">System Status</Link>
            <Link to="/logs" className="text-green-400">Logs</Link>
            <Link to="/upload" className="hover:text-green-400 transition-colors">Upload Report</Link>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historical Logs</h1>
          <p className="text-slate-400">View and export historical vibration data</p>
        </div>

        {/* Filters and Export */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <select className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  <option value="all">All Status</option>
                  <option value="normal">Normal Only</option>
                  <option value="warning">Warning Only</option>
                  <option value="fault">Fault Only</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => exportData('csv')} variant="outline" size="sm" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button onClick={() => exportData('excel')} variant="outline" size="sm" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button onClick={() => exportData('json')} variant="outline" size="sm" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Data Table */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Recent Log Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400">Time</TableHead>
                  <TableHead className="text-slate-400">Equipment ID</TableHead>
                  <TableHead className="text-slate-400">Avg Vibration</TableHead>
                  <TableHead className="text-slate-400">Peak</TableHead>
                  <TableHead className="text-slate-400">Temperature</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, index) => (
                  <TableRow key={index} className="border-slate-700">
                    <TableCell className="text-white">{log.date}</TableCell>
                    <TableCell className="text-white">{log.time}</TableCell>
                    <TableCell className="text-white font-mono">{log.equipmentId}</TableCell>
                    <TableCell className="text-white font-mono">{log.avgVibration} mm/s</TableCell>
                    <TableCell className="text-white font-mono">{log.peak} mm/s</TableCell>
                    <TableCell className="text-white">{log.temp}°C</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">24-Hour Trend Analysis</CardTitle>
            <div className="flex gap-2">
              <select 
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value="A-001">Compressor Unit 1 (A-001)</option>
                <option value="A-002">Pump Station 2 (A-002)</option>
                <option value="A-003">Generator 1 (A-003)</option>
                <option value="A-004">Motor Drive 3 (A-004)</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vibration" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
