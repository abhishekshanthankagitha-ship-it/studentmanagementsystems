import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Wrench, Laptop, Tablet, Smartphone,
  Send, CheckCircle2, Clock, Hash,
} from "lucide-react";

type DeviceType = "laptop" | "tablet" | "phone" | null;

interface ServiceRequest {
  device: string;
  brand: string;
  specs: string;
  problem: string;
  timeSlot: string;
  counterNo: number;
  id: number;
}

const deviceOptions = [
  { id: "laptop" as const, label: "Laptop", icon: <Laptop className="w-10 h-10" />, color: "bg-primary/10 text-primary" },
  { id: "tablet" as const, label: "Tablet", icon: <Tablet className="w-10 h-10" />, color: "bg-accent/10 text-accent" },
  { id: "phone" as const, label: "Phone", icon: <Smartphone className="w-10 h-10" />, color: "bg-warning/10 text-warning" },
];

const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

const EServices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>(null);
  const [brand, setBrand] = useState("");
  const [specs, setSpecs] = useState("");
  const [problem, setProblem] = useState("");
  const [submitted, setSubmitted] = useState<ServiceRequest | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  const handleSubmit = () => {
    if (!selectedDevice || !brand.trim() || !problem.trim()) return;

    const slot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    const counter = Math.floor(Math.random() * 8) + 1;

    const req: ServiceRequest = {
      device: selectedDevice,
      brand,
      specs,
      problem,
      timeSlot: slot,
      counterNo: counter,
      id: Date.now(),
    };

    setSubmitted(req);
    setRequests((prev) => [req, ...prev]);
    setBrand("");
    setSpecs("");
    setProblem("");
  };

  const resetForm = () => {
    setSubmitted(null);
    setSelectedDevice(null);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
              <Wrench className="w-5 h-5 text-warning-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">E-Services</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl">
        {/* Confirmation */}
        {submitted ? (
          <div className="glass rounded-xl p-8 text-center animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Service Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">Your device will be serviced at the following slot</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-secondary/30 text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">Time Slot</div>
                <div className="font-display font-bold text-foreground">{submitted.timeSlot}</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 text-center">
                <Hash className="w-5 h-5 text-warning mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">Counter Number</div>
                <div className="font-display font-bold text-foreground text-2xl">#{submitted.counterNo}</div>
              </div>
            </div>

            <div className="text-left p-4 rounded-xl bg-secondary/20 text-sm space-y-1 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Device:</span><span className="text-foreground capitalize">{submitted.device}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Brand:</span><span className="text-foreground">{submitted.brand}</span></div>
              {submitted.specs && <div className="flex justify-between"><span className="text-muted-foreground">Specs:</span><span className="text-foreground">{submitted.specs}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Issue:</span><span className="text-foreground">{submitted.problem}</span></div>
            </div>

            <button onClick={resetForm} className="px-6 py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm">
              Submit Another Request
            </button>
          </div>
        ) : (
          <>
            {/* Device Selection */}
            {!selectedDevice ? (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">Select Your Device</h2>
                <p className="text-muted-foreground text-center mb-8">Choose the device type you need serviced</p>

                <div className="grid grid-cols-3 gap-4">
                  {deviceOptions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDevice(d.id)}
                      className="glass rounded-xl p-8 flex flex-col items-center gap-3 hover:scale-105 transition-all group"
                    >
                      <div className={`w-20 h-20 rounded-2xl ${d.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {d.icon}
                      </div>
                      <span className="font-display font-semibold text-foreground">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Service Form */
              <div className="animate-fade-in">
                <button onClick={() => setSelectedDevice(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to device selection
                </button>

                <div className="glass rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2 capitalize">
                    {selectedDevice === "laptop" && <Laptop className="w-5 h-5 text-primary" />}
                    {selectedDevice === "tablet" && <Tablet className="w-5 h-5 text-accent" />}
                    {selectedDevice === "phone" && <Smartphone className="w-5 h-5 text-warning" />}
                    {selectedDevice} Service Request
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">Device Brand *</label>
                      <input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Dell, Apple, Samsung, HP..."
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">Device Specifications</label>
                      <input
                        value={specs}
                        onChange={(e) => setSpecs(e.target.value)}
                        placeholder="e.g. i5 12th Gen, 16GB RAM, 512GB SSD"
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">Describe the Problem *</label>
                      <textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Describe the issue you're facing with your device..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!brand.trim() || !problem.trim()}
                      className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" /> Submit Service Request
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Previous Requests */}
            {requests.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="font-display font-semibold text-foreground mb-3">Previous Requests</h3>
                {requests.map((r) => (
                  <div key={r.id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        {r.device === "laptop" ? <Laptop className="w-5 h-5 text-primary" /> :
                         r.device === "tablet" ? <Tablet className="w-5 h-5 text-accent" /> :
                         <Smartphone className="w-5 h-5 text-warning" />}
                      </div>
                      <div>
                        <span className="font-medium text-foreground capitalize">{r.device} — {r.brand}</span>
                        <p className="text-xs text-muted-foreground">{r.problem.slice(0, 50)}{r.problem.length > 50 ? '...' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{r.timeSlot}</div>
                      <div className="text-sm font-bold text-foreground">Counter #{r.counterNo}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EServices;
