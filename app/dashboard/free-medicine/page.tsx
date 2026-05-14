"use client";

import React, { useState, useMemo } from "react";
import { 
  Gift, 
  Package, 
  Users, 
  Send, 
  Check, 
  History, 
  Search, 
  Building2, 
  User, 
  Calendar,
  Filter,
  Clock,
  TrendingDown,
  AlertCircle,
  BarChart4
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";
import { FREE_SAMPLES_DATA, FreeSample } from "@/lib/data/free-samples-data";

const sampleInventory = [
  { id: 1, name: "VitaPlus Multi", stock: 50, category: "Vitamins" },
  { id: 2, name: "PainAway Gel", stock: 30, category: "Analgesic" },
  { id: 3, name: "KidneyHealth Tea", stock: 100, category: "Herbal" },
  { id: 4, name: "Amoxicillin 500mg", stock: 120, category: "Antibiotic" },
  { id: 5, name: "Lipitor 20mg", stock: 85, category: "Statins" },
];

export default function FreeMedicinePage() {
  const { user } = useAuth();
  const isManager = user?.role === "Manager";
  const { reps, appointments, medicines, updateAppointment } = useData();
  
  const [activeTab, setActiveTab] = useState<"provision" | "history">(isManager ? "history" : "provision");
  const [selectedMed, setSelectedMed] = useState<number | null>(null);
  const [beneficiary, setBeneficiary] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const combinedHistory = useMemo(() => {
    // Static data
    const staticData = [...FREE_SAMPLES_DATA].map(item => ({ ...item, source: 'static' as const }));

    // Real data from appointments
    const realData = appointments.flatMap(app => 
      (app.freeSamples || []).map((s, idx) => ({
        id: `${app.id}-${idx}`,
        appId: app.id,
        staffName: app.staffName || "Unknown",
        medicineName: medicines.find(m => m.id === s.medicineId)?.name || "Unknown",
        hospitalName: app.hospitalName || app.entityName,
        doctorName: app.doctorName || "Unknown",
        quantity: s.qty,
        date: app.date,
        status: (s.approved ? "Confirmed" : "Waiting for Approval") as any,
        source: 'real' as const
      }))
    );

    let base = [...realData, ...staticData].map(item => {
      if ((item as any).source === 'static') {
        return {
          ...item,
          status: (item.status === "delivered" ? "Confirmed" : "Waiting for Approval") as any
        };
      }
      return item;
    });

    if (!isManager) {
      base = base.filter(s => s.staffName === user?.name || s.staffName === "Priya Nair");
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return base.filter(s => 
        s.staffName.toLowerCase().includes(q) || 
        s.medicineName.toLowerCase().includes(q) || 
        s.hospitalName.toLowerCase().includes(q) ||
        s.doctorName.toLowerCase().includes(q)
      );
    }
    return base;
  }, [isManager, user, searchQuery, reps, appointments, medicines]);

  const handleApprove = (appId: string) => {
    const app = appointments.find(a => a.id === appId);
    if (!app || !app.freeSamples) return;
    const updatedSamples = app.freeSamples.map(s => ({ ...s, approved: true }));
    updateAppointment(appId, { freeSamples: updatedSamples });
  };

  const handleProvide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed || !beneficiary) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setSelectedMed(null);
        setBeneficiary("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 dashboard-header">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-80 min-[1400px]:block hidden">
            Resource Deployment
          </h2>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">Free Provisions</h1>
          <p className="text-muted-foreground mt-4 font-medium text-lg max-w-2xl leading-relaxed">
            {isManager 
              ? "Comprehensive audit of field sample distributions and inventory depletion across all territories." 
              : "Manage clinical samples and compassionate care provisions for your assigned medical facilities."}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-[10px] shadow-xl">
          {!isManager && (
            <button 
              onClick={() => setActiveTab("provision")} 
              className={cn("px-6 py-2.5 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all", activeTab === "provision" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary")}
            >
              <Send size={14} /> New Provision
            </button>
          )}
          <button 
            onClick={() => setActiveTab("history")} 
            className={cn("px-6 py-2.5 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all", activeTab === "history" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary")}
          >
            <History size={14} /> {isManager ? "Distribution Audit" : "Personal History"}
          </button>
        </div>
      </header>

      {/* Deployment Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center text-primary"><Package size={20} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Dispatched</p>
          </div>
          <h3 className="text-3xl font-black tabular-nums">{combinedHistory.reduce((acc, curr) => acc + curr.quantity, 0)} Units</h3>
          <p className="text-[9px] font-bold text-emerald-500 mt-1 uppercase">+14% vs last week</p>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-amber-500/10 flex items-center justify-center text-amber-600"><Clock size={20} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Audit</p>
          </div>
          <h3 className="text-3xl font-black tabular-nums">{combinedHistory.filter(h => h.status === "Waiting for Approval").length} Logs</h3>
          <p className="text-[9px] font-bold text-amber-500 mt-1 uppercase">Attention Required</p>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-blue-500/10 flex items-center justify-center text-blue-600"><TrendingDown size={20} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock Reserves</p>
          </div>
          <h3 className="text-3xl font-black tabular-nums">{sampleInventory.reduce((acc, curr) => acc + curr.stock, 0)} Units</h3>
          <p className="text-[9px] font-bold text-blue-500 mt-1 uppercase">Across 5 categories</p>
        </div>
        <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-indigo-500/10 flex items-center justify-center text-indigo-600"><BarChart4 size={20} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Highest Impact</p>
          </div>
          <h3 className="text-xl font-black uppercase truncate">Amoxicillin 500mg</h3>
          <p className="text-[9px] font-bold text-indigo-500 mt-1 uppercase">Top deployed asset</p>
        </div>
      </div>
      
      {/* Inventory Depletion Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-card border border-border rounded-[10px] p-10 card-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight">Inventory Depletion Audit</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Live stock monitoring across all clinical assets</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Audit Status</p>
              <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-emerald-500/20">Operational</span>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            {sampleInventory.map((item) => {
              const distributed = combinedHistory.filter(s => s.medicineName === item.name).reduce((acc, s) => acc + s.quantity, 0);
              const total = item.stock + distributed;
              const pct = (distributed / total) * 100;
              return (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{item.name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black tabular-nums">{item.stock} <span className="text-[10px] text-muted-foreground">/ {total} Units</span></p>
                      <p className="text-[9px] font-black uppercase text-primary">{distributed} Dispatched</p>
                    </div>
                  </div>
                  <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden border border-border shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - pct}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full shadow-lg",
                        (100 - pct) < 20 ? "bg-rose-500 shadow-rose-500/30" : 
                        (100 - pct) < 50 ? "bg-amber-500 shadow-amber-500/30" : 
                        "bg-emerald-500 shadow-emerald-500/30"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-indigo-600 rounded-[10px] p-8 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <BarChart4 size={120} />
            </div>
            <h3 className="text-xl font-black mb-2">Regional Balance</h3>
            <p className="text-xs text-indigo-100 uppercase font-black tracking-widest mb-6 opacity-80">Territory Distribution Audit</p>
            <div className="space-y-4 relative z-10">
              {[
                { label: "Deira Hub", pct: 45 },
                { label: "Jumeirah District", pct: 28 },
                { label: "Sharjah Sector", pct: 15 },
                { label: "Other Regions", pct: 12 }
              ].map((region) => (
                <div key={region.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{region.label}</span>
                    <span>{region.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${region.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-8 bg-card border border-border rounded-[10px] shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-amber-500" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Critical Threshold</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">"3 items have dropped below the 30% reserve threshold. Immediate replenishment audit recommended for Deira territory."</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "provision" ? (
          <motion.div 
            key="provision"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Inventory Selection */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Package size={24} className="text-primary" /> Select Provision Stock
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {sampleInventory.length} Items Available
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sampleInventory.map((med) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={med.id}
                    onClick={() => setSelectedMed(med.id)}
                    className={cn(
                      "p-6 rounded-[10px] border-2 transition-all cursor-pointer relative overflow-hidden group",
                      selectedMed === med.id 
                        ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                        : "border-border bg-card hover:border-primary/20"
                    )}
                  >
                    <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">{med.category}</p>
                      <h4 className="text-lg font-black tracking-tight">{med.name}</h4>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-black tabular-nums">{med.stock}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Units in Reserve</p>
                        </div>
                        {selectedMed === med.id && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                            <Check size={18} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dispatch Form */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-[10px] p-10 shadow-2xl relative overflow-hidden sticky top-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-2xl font-black tracking-tight mb-8">Dispatch Intelligence</h3>
                
                <form onSubmit={handleProvide} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Destination Facility</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        required
                        type="text"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        placeholder="e.g. Hope Specialized Clinic"
                        className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Provision Quantity</label>
                    <div className="relative group">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        required
                        type="number"
                        min="1"
                        max="20"
                        defaultValue="5"
                        className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1 italic">Maximum deployment restricted to 20 units per facility audit.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedMed || isSending || isSent}
                    className={cn(
                      "w-full py-5 rounded-[10px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3",
                      isSent ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                      !selectedMed ? "bg-muted text-muted-foreground cursor-not-allowed" :
                      "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] border-none"
                    )}
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isSent ? (
                      <><Check size={20} /> Deployment Confirmed</>
                    ) : (
                      <><Send size={18} /> Execute Dispatch</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder={isManager ? "Search staff or facility..." : "Search distributions..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" 
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-4 bg-card border border-border rounded-[10px] text-muted-foreground hover:text-primary transition-colors shadow-sm">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[10px] shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/10">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timestamp & Date</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Resource / Medicine</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Medical Facility</th>
                      {isManager && <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Staff</th>}
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {combinedHistory.map((sample, i) => (
                      <motion.tr 
                        key={sample.id} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.02 }} 
                        className="group hover:bg-secondary/30 transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[10px] bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground shrink-0"><Calendar size={16} /></div>
                            <span className="text-xs font-black tabular-nums">{new Date(sample.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{sample.medicineName}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Clinical Sample</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-muted-foreground" />
                            <p className="text-xs font-black truncate max-w-[200px]">{sample.hospitalName}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <User size={12} className="text-muted-foreground" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{sample.doctorName}</p>
                          </div>
                        </td>
                        {isManager && (
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                {sample.staffName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-xs font-black">{sample.staffName}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-8 py-6 text-center">
                          {sample.status === "Waiting for Approval" && isManager && (sample as any).source === 'real' ? (
                            <button 
                              onClick={() => handleApprove((sample as any).appId)}
                              className="px-4 py-2 bg-emerald-500 text-white rounded-[10px] text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                            >
                              Approve Now
                            </button>
                          ) : (
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase",
                              sample.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                            )}>
                              {sample.status === "Confirmed" ? <Check size={12} /> : <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                              {sample.status}
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {sample.quantity} Units
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
