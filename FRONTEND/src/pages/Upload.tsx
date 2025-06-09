
import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Upload, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const UploadReport = () => {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedOutput, setParsedOutput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['.exe', '.bin', '.txt', '.log', '.out'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          // Simulate parsed output
          setParsedOutput(`Diagnostic Report - ${file.name}
          
Analyzed Equipment: Motor Drive 3 (A-004)
Analysis Duration: 30 minutes
Sample Rate: 1000 Hz

VIBRATION ANALYSIS RESULTS:
- RMS Vibration: 6.5 mm/s (CRITICAL)
- Peak Frequency: 1800 Hz
- Dominant Harmonics: 2x, 3x rotational frequency
- Bearing Condition: FAULT DETECTED

TEMPERATURE READINGS:
- Operating Temperature: 75°C (HIGH)
- Bearing Temperature: 82°C (CRITICAL)

RECOMMENDATIONS:
⚠️ IMMEDIATE ACTION REQUIRED
- Schedule emergency maintenance
- Check bearing lubrication
- Inspect rotor alignment
- Consider temporary shutdown

FAULT PROBABILITY: 94.7%
ESTIMATED TIME TO FAILURE: 2-5 days`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setParsedOutput("");
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
            <Link to="/logs" className="hover:text-green-400 transition-colors">Logs</Link>
            <Link to="/upload" className="text-green-400">Upload Report</Link>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Diagnostic Report</h1>
          <p className="text-slate-400">Upload C++ diagnostic output for advanced analysis</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5" />
              File Upload
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Accepts: .exe, .bin, .txt, .log, .out files from C++ diagnostic tools
            </p>
          </CardHeader>
          <CardContent>
            {uploadStatus === "idle" && (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive 
                    ? "border-green-400 bg-green-400/10" 
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Drop your diagnostic file here</h3>
                <p className="text-slate-400 mb-6">or click to browse</p>
                <Button 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="bg-green-500 hover:bg-green-600 text-black"
                >
                  Choose File
                </Button>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".exe,.bin,.txt,.log,.out"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            )}

            {uploadStatus === "uploading" && (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold mb-4">Processing File...</h3>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <div 
                    className="bg-green-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-slate-400">{uploadProgress}% complete</p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
                <p className="text-slate-400 mb-4">File processed and analyzed</p>
                <Button onClick={resetUpload} variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  Upload Another File
                </Button>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Failed</h3>
                <p className="text-slate-400 mb-4">Invalid file type or corrupted file</p>
                <Button onClick={resetUpload} className="bg-green-500 hover:bg-green-600 text-black">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parsed Output Section */}
        {parsedOutput && uploadStatus === "success" && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Diagnostic Analysis Results</CardTitle>
              <p className="text-slate-400 text-sm">Parsed output from uploaded diagnostic file</p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={parsedOutput}
                readOnly
                className="bg-slate-900 border-slate-600 text-green-400 font-mono text-sm h-96 resize-none"
              />
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="font-semibold text-red-400">Critical Issues Detected</span>
                </div>
                <ul className="text-sm text-red-300 space-y-1">
                  <li>• High vibration levels detected (6.5 mm/s)</li>
                  <li>• Bearing fault probability: 94.7%</li>
                  <li>• Temperature exceeding safe limits</li>
                  <li>• Immediate maintenance required</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadReport;
