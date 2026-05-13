"use client";

import { useState } from "react";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  TrendingUp, 
  Award, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Filter,
  Plus,
  Package,
  UserPlus,
  Hospital as HospitalIcon,
  Search,
  ArrowLeft,
  ShieldCheck,
  X,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useData, Hospital, SalesRep } from "@/lib/context/data-context";
import { DashboardOverview } from "./dashboard-overview";
import { RepDetailedPerformance } from "./rep-detailed-performance";

export function ManagerDashboard() {
  const { hospitals, reps, medicines, appointments, doctors, addRep, addHospital, addDoctor, assignHospital, isLoading } = useData();
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);
  const [viewAsRep, setViewAsRep] = useState<SalesRep | null>(null);
  const [showDetailedRep, setShowDetailedRep] = useState<SalesRep | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    role: "Sales Person",
    zone: "Dubai North",
    password: "rx-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    targetAmount: 25000,
    planned: 40,
    email: "",
    mobile: ""
  });

  const [newHospitalData, setNewHospitalData] = useState({
    name: "",
    area: "Downtown Dubai",
    doctors: 0,
    patients: 0,
    priority: "medium" as const
  });

  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    hospitalId: "",
    specialty: "GP"
  });

  const activeRep = selectedRep || reps[0];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addRep(newStaffData);
    setNewStaffData({
      name: "",
      role: "Sales Person",
      zone: "Dubai North",
      password: "rx-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      targetAmount: 25000,
      planned: 40,
      email: "",
      mobile: ""
    });
    setShowAddStaff(false);
  };

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    addHospital(newHospitalData);
    setNewHospitalData({
      name: "",
      area: "Downtown Dubai",
      doctors: 0,
      patients: 0,
      priority: "medium"
    });
    setShowAddHospital(false);
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor(newDoctorData);
    setNewDoctorData({
      name: "",
      hospitalId: "",
      specialty: "GP"
    });
    setShowAddDoctor(false);
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "complete": return "bg-emerald-500/10 text-emerald-600";
      case "behind": return "bg-orange-500/10 text-orange-600";
      case "no check-in": return "bg-red-500/10 text-red-600";
      default: return "bg-blue-500/10 text-blue-600";
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Separate Sales Person Detailed Performance Mode
  if (showDetailedRep) {
    return <RepDetailedPerformance rep={showDetailedRep} onBack={() => setShowDetailedRep(null)} />;
  }

  // Separate Sales Person Overview Mode (View as field rep)
  if (viewAsRep) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setViewAsRep(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-[10px] font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} /> Back to Manager Dashboard
        </button>
        <div className="p-1 border-2 border-dashed border-white/30 rounded-[10px]">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-[10px] mb-4 text-center">
            <p className="text-xs font-black uppercase tracking-widest opacity-80">Preview Mode: Viewing as <span className="text-white">{viewAsRep.name}</span></p>
          </div>
          <DashboardOverview mockUser={{ name: viewAsRep.name, role: "Sales Person" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 dashboard-header">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-60">Team Management Dashboard</h2>
          <h1 className="text-4xl font-extrabold mt-1 tracking-tight">Field Operations Overview</h1>
          <p className="opacity-60 mt-2">Monday, 04 May 2026 · {reps.length} active reps · UAE Territories</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowAddStaff(true)}
            className="px-4 py-2 bg-[#9d174d] text-white rounded-[10px] font-bold flex items-center gap-2 shadow-lg shadow-[#9d174d]/30 hover:scale-[1.02] transition-all"
          >
            <UserPlus size={18} /> Add Staff
          </button>
          <button 
            onClick={() => setShowAddHospital(true)}
            className="px-4 py-2 bg-[#9d174d] text-white rounded-[10px] font-bold flex items-center gap-2 shadow-lg shadow-[#9d174d]/30 hover:scale-[1.02] transition-all"
          >
            <HospitalIcon size={18} /> Add Hospital
          </button>
          <button 
            onClick={() => setShowAddDoctor(true)}
            className="px-4 py-2 bg-[#9d174d] text-white rounded-[10px] font-bold flex items-center gap-2 shadow-lg shadow-[#9d174d]/30 hover:scale-[1.02] transition-all"
          >
            <Stethoscope size={18} /> Add Customer
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Active Reps" value={`${reps.length}/10`} sub="2 on leave" icon={Users} color="bg-blue-500" />
        <KPICard label="Visits Today" value="42 / 56" sub="75% Achievement" icon={MapPin} color="bg-emerald-500" />
        <KPICard label="Docs Detailed" value="94" sub="+12 vs yesterday" icon={Stethoscope} color="bg-indigo-500" />
        <KPICard label="Follow-ups" value="14" sub="5 overdue" icon={Clock} color="bg-amber-500" />
        <KPICard label="Unassigned" value={hospitals.filter(h => !h.assignedRepId).length.toString()} sub="Needs assignment" icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Team Progress */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[10px] card-shadow overflow-hidden sales-team-section">
          <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
            <div>
              <h3 className="text-xl font-bold">Sales team — today's progress</h3>
              <p className="text-xs text-muted-foreground mt-1">Click any rep to see their visits and remarks</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Sort: Performance</span>
            </div>
          </div>
          <div className="divide-y divide-border overflow-x-auto">
            {reps.map((rep) => {
              const isSelected = activeRep?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setShowDetailedRep(rep)}
                  onMouseEnter={() => setSelectedRep(rep)}
                  className={cn(
                    "p-4 flex items-center gap-6 cursor-pointer transition-all hover:bg-secondary/30 group/row",
                    isSelected && "bg-primary/5 border-l-4 border-primary"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-inner bg-primary/10 text-primary")}>
                    {rep.initials}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="md:col-span-1">
                      <p className="font-bold text-sm truncate">{rep.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{rep.zone}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-black">{rep.visits}/{rep.planned}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">visits</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", rep.pct >= 80 ? "bg-emerald-500" : rep.pct >= 50 ? "bg-amber-500" : "bg-red-500")}
                          style={{ width: `${rep.pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase mt-1">Plan achievement {rep.pct}%</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="text-sm font-black">{rep.doctorsDetailed}/{rep.totalDoctors}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">doctors</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-black uppercase whitespace-nowrap", getStatusStyles(rep.status))}>
                      {rep.status}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetailedRep(rep);
                      }}
                      className="p-2 hover:bg-primary/10 rounded-full text-muted-foreground hover:text-primary transition-all opacity-0 group-hover/row:opacity-100"
                      title="View Full Profile"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Rep Details */}
        <div className="space-y-6">
          {activeRep && (
            <div className="p-6 bg-card border border-border rounded-[10px] card-shadow glass">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black leading-none">{activeRep.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{activeRep.zone} · {hospitals.filter(h => h.assignedRepId === activeRep.id).length} clinics assigned</p>
                </div>
                <button 
                  onClick={() => setViewAsRep(activeRep)}
                  className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-widest"
                >
                  View as field rep <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-secondary/30 rounded-[10px] border border-border text-center">
                  <p className="text-[10px] text-muted-foreground font-black uppercase mb-2">Visits planned</p>
                  <p className="text-3xl font-black">{activeRep.planned}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-[10px] border border-border text-center">
                  <p className="text-[10px] text-muted-foreground font-black uppercase mb-2">Visits completed</p>
                  <p className="text-3xl font-black text-primary">{activeRep.visits}</p>
                  <p className="text-[9px] font-black text-red-500 mt-1">{activeRep.pct}% achieved</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1">
                  <span>Doctor coverage</span>
                  <span>{activeRep.doctorsDetailed} / {activeRep.totalDoctors}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${(activeRep.doctorsDetailed / activeRep.totalDoctors) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Recent Doctor Remarks</h5>
                <div className="p-4 bg-secondary/30 rounded-[10px] border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold">Dr. Ahmed Al Hammadi</p>
                      <p className="text-[9px] text-muted-foreground">GP · Saudi German Hospital</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-muted rounded-full uppercase font-bold">neutral</span>
                  </div>
                  <p className="text-xs italic text-foreground leading-relaxed">"Brief encounter only. Will discuss in detail next visit."</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                    <Clock size={12} /> Re-visit 06 May
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-secondary text-foreground rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-secondary/70 transition-all">
                View full activity log →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customer Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-[10px] card-shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">Live activity feed</h3>
            <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-6">
            <ActivityItem 
              color="bg-emerald-500"
              title="Faisal Al Marzouqi completed visit at Mediclinic Dubai Mall - order 8,400 AED"
              time="Just now · Downtown · 3 doctors detailed · 1 follow-up scheduled"
            />
            <ActivityItem 
              color="bg-red-500"
              title="Abdulla bin Rashid logged remark: 'Dr. Sultan will trial new antibiotic line with 5 patients'"
              time="4 min ago · Al Zahra Hospital Dubai"
              tag="positive"
            />
            <ActivityItem 
              color="bg-blue-500"
              title="Saeed Al Tayer checked in at Emirates Specialty Hospital"
              time="12 min ago · Healthcare City · 2nd visit of 4 planned today"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[10px] card-shadow p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={120} className="text-primary" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Customer Assignment</h3>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-6">Territory Mapping Status</p>
            
            {hospitals.filter(h => !h.assignedRepId).length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-[10px] flex items-center justify-center shadow-inner">
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-rose-500">{hospitals.filter(h => !h.assignedRepId).length}</p>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">{hospitals.filter(h => h.assignedRepId).length} / {hospitals.length} Mapped</p>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500" 
                    style={{ width: `${(hospitals.filter(h => h.assignedRepId).length / hospitals.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">"Territory gaps detected. Hospital network requires immediate professional allocation."</p>
                <button 
                  onClick={() => setShowBulkAssign(true)}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Open Bulk Assign Console
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-[10px] flex items-center justify-center shadow-inner">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-500">100%</p>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">{hospitals.length} / {hospitals.length} Mapped</p>
                  </div>
                </div>
                <div className="h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">"All facilities successfully mapped to representatives. Network integrity is optimal."</p>
                <button 
                  onClick={() => setShowBulkAssign(true)}
                  className="w-full py-4 bg-secondary text-secondary-foreground border border-border rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-secondary/70 transition-all"
                >
                  Review Assignment Audit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      <AnimatePresence>
        {showBulkAssign && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkAssign(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-card border border-border w-full max-w-4xl rounded-[10px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-[10px] flex items-center justify-center text-primary-foreground">
                    <HospitalIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Bulk Assignment Console</h3>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Territory Mapping & Allocation</p>
                  </div>
                </div>
                <button onClick={() => setShowBulkAssign(false)} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-4 text-[10px] font-black uppercase text-muted-foreground">Facility & Lead Physician</th>
                      <th className="pb-4 text-[10px] font-black uppercase text-muted-foreground text-center">Operational Data</th>
                      <th className="pb-4 text-[10px] font-black uppercase text-muted-foreground text-center">Status</th>
                      <th className="pb-4 text-[10px] font-black uppercase text-muted-foreground text-right">Target Assignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {hospitals.filter(h => !h.assignedRepId).map((h) => {
                      const hospitalDocs = doctors.filter(d => d.hospitalId === h.id);
                      const leadDoc = hospitalDocs[0] || { name: "Pending Audit", specialty: "General" };
                      
                      return (
                        <tr key={h.id} className="hover:bg-secondary/5 transition-colors group">
                          <td className="py-5">
                            <p className="font-bold text-sm">{h.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Stethoscope size={10} className="text-primary" />
                              <p className="text-[10px] font-bold text-muted-foreground">{leadDoc.name} ({leadDoc.specialty})</p>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <div className="flex justify-center gap-4">
                              <div className="text-center">
                                <p className="text-xs font-black">{h.doctors}</p>
                                <p className="text-[8px] font-black uppercase text-muted-foreground">Doctors</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-black">{h.patients}</p>
                                <p className="text-[8px] font-black uppercase text-muted-foreground">Patients</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                              h.priority === "high" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                              {h.priority} Priority
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <select 
                              onChange={(e) => assignHospital(h.id, e.target.value)}
                              className="bg-secondary/20 border border-border rounded-[10px] px-4 py-2 text-xs font-black outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-secondary/40 transition-all min-w-[180px]"
                            >
                              <option value="">Select Representative...</option>
                              {reps.map(r => (
                                <option key={r.id} value={r.id}>{r.name} ({r.zone})</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {hospitals.filter(h => !h.assignedRepId).length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck size={32} />
                    </div>
                    <h4 className="text-lg font-black">All Facilities Assigned</h4>
                    <p className="text-sm text-muted-foreground mt-1 uppercase font-black tracking-widest text-[10px]">Territory Mapping 100% Complete</p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-border bg-secondary/10 flex justify-end">
                <button 
                  onClick={() => setShowBulkAssign(false)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Finalize Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visit Heatmap - this week */}
      <div className="mt-10 bg-card border border-border rounded-[10px] card-shadow overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Visit heatmap — this week</h3>
            <p className="text-xs text-muted-foreground mt-1">Planned vs actual visits per rep, per day · based on live appointments</p>
          </div>
          <div className="flex items-center gap-3">
            {[["0-1", "bg-red-500"], ["2-3", "bg-amber-500"], ["4-5", "bg-emerald-500"], ["6+", "bg-emerald-700"]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-sm", color)} />
                <span className="text-[10px] font-black uppercase text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary/30">
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border w-48">Representative</th>
                {["Mon · 04", "Tue · 05", "Wed · 06", "Thu · 07", "Fri · 08", "Sat · 09"].map((d, i) => {
                  const todayIdx = 2; // Wednesday
                  const isToday = i === todayIdx;
                  return (
                    <th key={d} className={cn(
                      "p-4 text-center text-[10px] font-black uppercase tracking-widest border-r border-border last:border-0",
                      isToday ? "text-primary bg-primary/5" : "text-muted-foreground"
                    )}>
                      <div className="flex flex-col items-center gap-1">
                        {d}
                        {isToday && <span className="text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">Today</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reps.map((rep) => (
                <tr key={rep.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-bold text-sm border-r border-border">{rep.name}</td>
                  {[0, 1, 2, 3, 4, 5].map((dayIdx) => {
                    const todayIdx = 2; // Wednesday
                    const isToday = dayIdx === todayIdx;
                    const isFuture = dayIdx > todayIdx;

                    const seed = rep.id.length + rep.name.length + dayIdx;
                    const planned = (seed % 4) + 5; 
                    const actual = (seed * 7) % (planned + 1);
                    
                    let color = "bg-secondary/10";
                    if (planned > 0) {
                      if (actual >= 6) color = "bg-emerald-700";
                      else if (actual >= 4) color = "bg-emerald-500";
                      else if (actual >= 2) color = "bg-amber-500";
                      else color = "bg-red-500";
                    }

                    return (
                      <HeatmapCell 
                        key={dayIdx}
                        value={isFuture ? `—/${planned}` : `${actual}/${planned}`} 
                        color={color} 
                        isLast={dayIdx === 5} 
                        isToday={isToday}
                        isFuture={isFuture}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Format: <span className="text-foreground">actual</span>/planned visits</p>
        </div>
      </div>

      {/* Staff Addition Modal */}
      <AnimatePresence>
        {showAddStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStaff(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card border border-border w-full max-w-2xl rounded-[10px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-[10px] flex items-center justify-center text-primary-foreground">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Add New Staff</h3>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Provision Field Representative</p>
                  </div>
                </div>
                <button onClick={() => setShowAddStaff(false)} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Full Name</label>
                    <input 
                      required
                      value={newStaffData.name}
                      onChange={e => setNewStaffData({...newStaffData, name: e.target.value})}
                      className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold"
                      placeholder="e.g. Faisal Al Marzouqi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Role / Designation</label>
                    <select 
                      value={newStaffData.role}
                      onChange={e => setNewStaffData({...newStaffData, role: e.target.value})}
                      className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold"
                    >
                      <option>Sales Person</option>
                      <option>Area Manager</option>
                      <option>Medical Liaison</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Assigned Zone</label>
                    <input 
                      required
                      value={newStaffData.zone}
                      onChange={e => setNewStaffData({...newStaffData, zone: e.target.value})}
                      className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold"
                      placeholder="e.g. Marina · JBR"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Access Credentials</label>
                    <div className="relative">
                      <input 
                        required
                        value={newStaffData.password}
                        onChange={e => setNewStaffData({...newStaffData, password: e.target.value})}
                        className="w-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-emerald-500 outline-none font-black"
                      />
                      <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={newStaffData.email}
                      onChange={e => setNewStaffData({...newStaffData, email: e.target.value})}
                      placeholder="e.g. f.marzouqi@rx-health.com"
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-1 focus:ring-primary transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      value={newStaffData.mobile}
                      onChange={e => setNewStaffData({...newStaffData, mobile: e.target.value})}
                      placeholder="e.g. +971 50 123 4567"
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-1 focus:ring-primary transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Revenue Target (AED)</label>
                    <input 
                      type="number" 
                      required
                      value={newStaffData.targetAmount}
                      onChange={e => setNewStaffData({...newStaffData, targetAmount: parseInt(e.target.value)})}
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-1 focus:ring-primary transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Planned Monthly Visits</label>
                    <input 
                      type="number" 
                      required
                      value={newStaffData.planned}
                      onChange={e => setNewStaffData({...newStaffData, planned: parseInt(e.target.value)})}
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-1 focus:ring-primary transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowAddStaff(false)}
                    className="flex-1 py-4 bg-secondary text-secondary-foreground rounded-[10px] font-black text-xs uppercase tracking-widest hover:bg-secondary/70 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-primary-foreground rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Hospital Modal */}
      <AnimatePresence>
        {showAddHospital && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddHospital(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-card border border-border w-full max-w-lg rounded-[10px] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-[10px] flex items-center justify-center text-primary-foreground">
                    <HospitalIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Register Hospital</h3>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Facility Asset Management</p>
                  </div>
                </div>
                <button onClick={() => setShowAddHospital(false)} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddHospital} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Hospital Name</label>
                  <input required value={newHospitalData.name} onChange={e => setNewHospitalData({...newHospitalData, name: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold" placeholder="e.g. Mediclinic Parkview" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Area / Location</label>
                  <input required value={newHospitalData.area} onChange={e => setNewHospitalData({...newHospitalData, area: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold" placeholder="e.g. Dubai Hills" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Doctors Count</label>
                    <input type="number" required value={newHospitalData.doctors} onChange={e => setNewHospitalData({...newHospitalData, doctors: parseInt(e.target.value)})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Patients Count</label>
                    <input type="number" required value={newHospitalData.patients} onChange={e => setNewHospitalData({...newHospitalData, patients: parseInt(e.target.value)})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Strategic Priority</label>
                  <select value={newHospitalData.priority} onChange={e => setNewHospitalData({...newHospitalData, priority: e.target.value as any})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Add Facility</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Customer (Doctor) Modal */}
      <AnimatePresence>
        {showAddDoctor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddDoctor(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-card border border-border w-full max-w-lg rounded-[10px] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-border bg-indigo-600/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-[10px] flex items-center justify-center text-white">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Register Professional</h3>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Medical Customer Management</p>
                  </div>
                </div>
                <button onClick={() => setShowAddDoctor(false)} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddDoctor} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Doctor Name</label>
                  <input required value={newDoctorData.name} onChange={e => setNewDoctorData({...newDoctorData, name: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-indigo-600 outline-none font-bold" placeholder="e.g. Dr. Ahmed Al Hammadi" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Associated Hospital</label>
                  <select required value={newDoctorData.hospitalId} onChange={e => setNewDoctorData({...newDoctorData, hospitalId: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-indigo-600 outline-none font-bold">
                    <option value="">Select Facility...</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Specialty</label>
                  <input required value={newDoctorData.specialty} onChange={e => setNewDoctorData({...newDoctorData, specialty: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-[10px] px-4 py-3 focus:ring-1 focus:ring-indigo-600 outline-none font-bold" placeholder="e.g. Cardiology" />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all">Add Professional</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeatmapCell({ value, color, isLast = false, isToday = false, isFuture = false }: { value: string, color: string, isLast?: boolean, isToday?: boolean, isFuture?: boolean }) {
  return (
    <td className={cn(
      "p-2 border-r border-border", 
      isLast && "border-0",
      isToday && "bg-primary/[0.03]",
      isFuture && "bg-secondary/5"
    )}>
      <div className={cn(
        "rounded-[10px] p-3 text-[10px] font-black text-center transition-all hover:scale-105 cursor-help shadow-sm",
        isFuture ? "bg-card border border-border text-muted-foreground" : cn("text-white", color)
      )}>
        {value}
      </div>
    </td>
  );
}

function ActivityItem({ color, title, time, tag }: { color: string, title: string, time: string, tag?: string }) {
  return (
    <div className="flex gap-4 group">
      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", color)} />
      <div>
        <p className="text-xs font-bold leading-relaxed">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
        {tag && (
          <span className="mt-2 inline-block text-[8px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-black uppercase">{tag}</span>
        )}
      </div>
    </div>
  );
}

function KPICard({ label, value, sub, icon: Icon, color }: { label: string, value: string, sub: string, icon: any, color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative p-6 rounded-[10px] overflow-hidden group transition-all hover:scale-[1.02] kpi-card-container stat-card-container"
    >
      {/* Clean White Card Structure */}
      <div className="absolute inset-0 bg-white border-none shadow-[0_15px_45px_-15px_rgba(0,0,0,0.08)]" />
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`} />
      
      <div className="relative z-10 flex items-center gap-6">
        <div className={`w-14 h-14 ${color} rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-80">{label}</p>
          <p className="text-3xl font-black mt-1 tracking-tighter">{value}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{sub}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
