
import { Link } from "react-router-dom";
import { Activity, Shield, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-green-400" />
            <span className="text-xl font-bold">Industrial Monitor</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link>
            <Link to="/status" className="hover:text-green-400 transition-colors">System Status</Link>
            <Link to="/logs" className="hover:text-green-400 transition-colors">Logs</Link>
            <Link to="/upload" className="hover:text-green-400 transition-colors">Upload Report</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Detect faults before they become failures
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Your real-time machinery guardian – Advanced vibration analysis and AI-powered fault detection for industrial equipment
          </p>
          <Link to="/dashboard">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 text-lg">
              View Live Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Equipment</CardTitle>
                <Shield className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">24</div>
                <p className="text-xs text-slate-400">Actively monitored</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Active Faults</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">3</div>
                <p className="text-xs text-slate-400">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">System Uptime</CardTitle>
                <Clock className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">99.7%</div>
                <p className="text-xs text-slate-400">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Advanced Vibration Analysis</h2>
              <p className="text-slate-300 mb-6">
                Our industrial monitoring system uses cutting-edge sensor technology and AI-powered analysis 
                to detect equipment faults before they lead to costly failures. Real-time vibration monitoring 
                provides early warning systems for all your critical machinery.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Real-time vibration analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">AI-powered fault detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">C/C++ embedded processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Predictive maintenance alerts</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Technology Stack</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                <div>• Vibration Sensors</div>
                <div>• C/C++ Processing</div>
                <div>• Real-time Analytics</div>
                <div>• Machine Learning</div>
                <div>• Web Dashboard</div>
                <div>• Alert Systems</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; Industrial Equipment Health Monitoring System. Built with advanced vibration analysis technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
