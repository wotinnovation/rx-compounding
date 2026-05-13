"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  ChevronRight,
  Hospital as HospitalIcon,
  Pill,
  DollarSign,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  X,
  Stethoscope,
  Users as UsersIcon,
  MessageSquare,
  PackageCheck,
  Activity,
  User,
  Home,
  Truck,
  History,
  ClipboardList,
  AlertCircle,
  FlaskConical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useData, SalesRep, Sale, Hospital, Medicine, Doctor, Patient } from "@/lib/context/data-context";

export function RepDetailedPerformance({ rep, onBack }: { rep: SalesRep, onBack: () => void }) {
  const { 
    hospitals, medicines, getRepSales, sales, doctors,
    getHospitalDoctors, getHospitalPatients, getDoctorSales,
    togglePatientStatus
  } = useData();
  
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"doctors" | "patients">("doctors");
  
  const [showAllActivity, setShowAllActivity] = useState(false);
  
  const myHospitals = hospitals.filter(h => h.assignedRepId === rep.id);
  const mySales = getRepSales(rep.id);
  
  const activityItems = showAllActivity ? mySales : mySales.slice(0, 6);
  
  const totalRevenue = mySales.reduce((acc, s) => acc + (s.amount || 0), 0);
  const targetAmount = rep.targetAmount || 1; 
  const revenuePct = Math.round((totalRevenue / targetAmount) * 100);

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);
  const hospitalDoctors = selectedHospitalId ? getHospitalDoctors(selectedHospitalId) : [];
  const hospitalPatients = selectedHospitalId ? getHospitalPatients(selectedHospitalId) : [];

  const selectedDoctor = selectedDoctorId ? hospitalDoctors.find(d => d.id === selectedDoctorId) : (hospitalDoctors[0] || null);
  const doctorSales = selectedDoctor ? getDoctorSales(selectedDoctor.id) : [];

  const selectedPatient = selectedPatientId ? hospitalPatients.find(p => p.id === selectedPatientId) : null;
  const patientDoctor = selectedPatient ? doctors.find(d => d.id === selectedPatient.assignedDoctorId) : null;

  const hospitalTotalValue = selectedHospitalId ? sales.filter(s => s.hospitalId === selectedHospitalId && s.repId === rep.id).reduce((acc, s) => acc + (s.amount || 0), 0) : 0;

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-[10px] font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} /> Back to Team List
        </button>
        <div className="px-4 py-2 bg-primary/20 rounded-[10px] border border-primary/30">
          <p className="text-[10px] font-black uppercase text-primary">Performance Period: May 2026</p>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-card border border-border rounded-[10px] p-8 card-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-[10px] flex items-center justify-center font-black text-3xl text-primary-foreground shadow-xl">
              {rep.initials}
            </div>
            <div>
              <h2 className="text-3xl font-black">{rep.name}</h2>
              <p className="text-muted-foreground font-medium">{rep.zone} · Senior Sales Executive</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Monthly Sales Target</p>
            <p className="text-4xl font-black text-primary">{(totalRevenue || 0).toLocaleString()} <span className="text-sm">/ {(rep.targetAmount || 0).toLocaleString()} AED</span></p>
            <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden mt-1">
              <div 
                className={cn("h-full transition-all duration-1000", revenuePct >= 100 ? "bg-emerald-500" : "bg-primary")}
                style={{ width: `${Math.min(revenuePct, 100)}%` }}
              />
            </div>
            <p className="text-xs font-black">{revenuePct}% achieved</p>
          </div>
        </div>
      </header>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HospitalIcon className="text-primary" size={20} /> Assigned Hospitals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myHospitals.map((hospital) => (
              <motion.div 
                key={hospital.id} 
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedHospitalId(hospital.id)}
                className="p-6 bg-card border border-border rounded-[10px] card-shadow hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold group-hover:text-primary transition-colors">{hospital.name}</h4>
                  <ChevronRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/20 rounded-[10px]">
                    <p className="text-[9px] font-black uppercase opacity-60">Doctors</p>
                    <p className="text-lg font-black">{hospital.doctors}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-[10px]">
                    <p className="text-[9px] font-black uppercase opacity-60">Patients</p>
                    <p className="text-lg font-black">{hospital.patients}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="text-primary" size={20} /> Field Activity Log
          </h3>
          <div className="bg-card border border-border rounded-[10px] card-shadow overflow-hidden">
            <div className="divide-y divide-border">
              {activityItems.map((sale) => {
                const med = medicines.find(m => m.id === sale.medicineId);
                const hospital = hospitals.find(h => h.id === sale.hospitalId);
                const doctor = doctors.find(d => d.id === sale.doctorId);
                return (
                  <div key={sale.id} className="p-5 hover:bg-primary/[0.03] transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-200 group-hover:text-primary transition-colors">{med?.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Stethoscope size={10} className="text-primary" />
                          <span className="text-[10px] font-black uppercase text-primary/80 tracking-tighter">Visit with {doctor?.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">{(sale.amount || 0).toLocaleString()} <span className="text-[9px] opacity-60">AED</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={10} className="text-emerald-500" />
                        <p className="text-[10px] text-muted-foreground font-bold truncate">
                          {hospital?.name} · {hospital?.area}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={10} className="text-blue-500" />
                        <p className="text-[10px] text-muted-foreground font-black opacity-80 uppercase tracking-tighter">
                          {new Date(sale.date).toLocaleDateString()} at {sale.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!showAllActivity && mySales.length > 6 && (
              <button 
                onClick={() => setShowAllActivity(true)}
                className="w-full py-4 bg-secondary/20 hover:bg-secondary/40 text-[10px] font-black uppercase tracking-widest text-primary transition-all border-t border-border"
              >
                View Full Activity Log ({mySales.length - 6} more items)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OVERLAY SPLIT LAYOUT */}
      <AnimatePresence>
        {selectedHospital && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedHospitalId(null); setSelectedDoctorId(null); }} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative bg-card border border-border w-full max-w-7xl h-[85vh] rounded-[10px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-[10px] flex items-center justify-center text-primary-foreground shadow-lg">
                    <HospitalIcon size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{selectedHospital.name}</h3>
                    <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">{selectedHospital.area} · Network Audit</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mr-10">
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-muted-foreground">Network Value</p>
                    <p className="text-xl font-black text-primary">{hospitalTotalValue.toLocaleString()} AED</p>
                  </div>
                  <button onClick={() => { setSelectedHospitalId(null); setSelectedDoctorId(null); }} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70 transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* SPLIT CONTENT */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row divide-x divide-border">
                {/* LEFT LIST */}
                <div className="w-full lg:w-[400px] overflow-y-auto p-8 space-y-8 bg-secondary/5">
                  <div className="flex bg-white/50 p-1 rounded-[10px] border border-border">
                    <button onClick={() => setViewMode("doctors")} className={cn("flex-1 py-3 rounded-[10px] font-black text-[10px] uppercase tracking-widest transition-all", viewMode === "doctors" ? "bg-primary text-white shadow-lg" : "text-muted-foreground")}>Doctors</button>
                    <button onClick={() => setViewMode("patients")} className={cn("flex-1 py-3 rounded-[10px] font-black text-[10px] uppercase tracking-widest transition-all", viewMode === "patients" ? "bg-emerald-500 text-white shadow-lg" : "text-muted-foreground")}>Patients</button>
                  </div>

                  <div className="space-y-2">
                    {viewMode === "doctors" ? (
                      hospitalDoctors.map(doc => (
                        <div key={doc.id} onClick={() => setSelectedDoctorId(doc.id)} className={cn("p-4 rounded-[10px] border transition-all cursor-pointer flex justify-between", selectedDoctorId === doc.id ? "bg-white border-primary shadow-lg ring-1 ring-primary/20" : "bg-white/40 border-border")}>
                          <p className="font-bold text-sm">{doc.name}</p>
                          <ChevronRight size={16} />
                        </div>
                      ))
                    ) : (
                      hospitalPatients.map(pat => (
                        <div key={pat.id} onClick={() => setSelectedPatientId(pat.id)} className="p-4 rounded-[10px] border border-border bg-white/40 hover:border-emerald-500 transition-all cursor-pointer flex justify-between">
                          <p className="font-bold text-sm">{pat.name}</p>
                          <ChevronRight size={16} />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* RIGHT PANE */}
                <div className="flex-1 overflow-y-auto p-10 bg-white">
                  {viewMode === "doctors" && selectedDoctor ? (
                    <div className="space-y-8">
                      <h4 className="text-3xl font-black">{selectedDoctor.name} · Provisions</h4>
                      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-secondary/30">
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Medicine Details</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Logistics & Timing</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Qty / Status</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Value (AED)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {doctorSales.map((sale, idx) => {
                              const med = medicines.find(m => m.id === sale.medicineId);
                              // Check if this is the first time this medicine is given to this doctor in this list
                              const isFirstTime = doctorSales.slice(0, idx).filter(s => s.medicineId === sale.medicineId).length === 0;
                              
                              return (
                                <React.Fragment key={sale.id}>
                                  <tr className="hover:bg-secondary/5 transition-colors">
                                    <td className="p-6">
                                      <div className="flex items-center gap-4">
                                        <div className={cn(
                                          "w-12 h-12 rounded-[10px] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                          sale.isCompound ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"
                                        )}>
                                          {sale.isCompound ? <FlaskConical size={24} /> : <PackageCheck size={24} />}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <p className="font-bold text-base tracking-tight">{med?.name}</p>
                                            {isFirstTime ? (
                                              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-tighter">New Provision</span>
                                            ) : (
                                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded uppercase tracking-tighter">Repeat</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-muted-foreground font-black uppercase mt-1 tracking-widest">
                                            {med?.category} · {sale.isCompound ? "Custom Compound" : "Standard Pack"}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-6 text-center">
                                      <div className="inline-flex flex-col items-center gap-1">
                                        <div className="px-3 py-1 bg-secondary/30 rounded-lg flex items-center gap-1.5">
                                          <CalendarIcon size={12} className="text-primary" />
                                          <span className="text-[11px] font-bold">{new Date(sale.date).toLocaleDateString()}</span>
                                          <span className="text-[11px] text-muted-foreground">at {sale.time}</span>
                                        </div>
                                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 flex items-center gap-1.5 mt-1">
                                          <Truck size={12} />
                                          <span className="text-[9px] font-black uppercase">ETA: {sale.deliveryNeededDate}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-6 text-center">
                                      <p className="text-lg font-black">{sale.quantity}</p>
                                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Units Delivered</p>
                                    </td>
                                    <td className="p-6 text-right">
                                      <p className="text-lg font-black text-primary">{(sale.amount || 0).toLocaleString()}</p>
                                      <p className="text-[9px] font-black uppercase text-muted-foreground">AED Total</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={4} className="p-6 pt-0">
                                      <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="bg-secondary/10 rounded-[10px] p-4 border border-border flex gap-3">
                                            <MessageSquare size={16} className="text-primary shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Representative Remarks</p>
                                              <p className="text-xs text-muted-foreground italic leading-relaxed">"{sale.notes || "No interaction notes recorded."}"</p>
                                            </div>
                                          </div>
                                          <div className="bg-blue-50/30 rounded-[10px] p-4 border border-blue-100 flex gap-3">
                                            <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-[8px] font-black uppercase text-blue-600 tracking-widest mb-1">Delivery Endpoint</p>
                                              <p className="text-xs text-blue-900 font-bold">Main Pharmacy · Receiving Gate 4</p>
                                            </div>
                                          </div>
                                        </div>
                                        {sale.isCompound && (
                                          <div className="bg-amber-50/50 rounded-[10px] p-4 border border-dashed border-amber-200 flex gap-3">
                                            <FlaskConical size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-[9px] font-black uppercase text-amber-600 tracking-widest mb-1">Compound Formula & Mixing Details</p>
                                              <p className="text-xs text-amber-900 leading-relaxed italic">{sale.compoundDetails}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : viewMode === "patients" ? (
                    <div className="space-y-8">
                      <h4 className="text-3xl font-black">Facility Patients</h4>
                      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-emerald-50/50">
                            <tr>
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-700">Patient</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-700 text-center">Condition</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-700 text-right">Physician</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {hospitalPatients.map(pat => {
                              const doc = doctors.find(d => d.id === pat.assignedDoctorId);
                              return (
                                <tr 
                                  key={pat.id} 
                                  onClick={() => setSelectedPatientId(pat.id)}
                                  className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                                >
                                  <td className="p-6">
                                    <div className="flex items-center gap-4">
                                      <div className={cn(
                                        "w-10 h-10 rounded-[10px] flex items-center justify-center font-black transition-colors",
                                        pat.status === "active" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                                      )}>
                                        {pat.name[0]}
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm">{pat.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <div className={cn("w-2 h-2 rounded-full", pat.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                          <span className={cn("text-[9px] font-black uppercase tracking-tighter", pat.status === "active" ? "text-emerald-600" : "text-slate-400")}>
                                            {pat.status}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-6 text-center text-xs font-bold text-muted-foreground">{pat.age}Y · {pat.gender}</td>
                                  <td className="p-6 text-center">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">{pat.condition}</span>
                                  </td>
                                  <td className="p-6 text-right font-bold text-sm">{(doctors.find(d => d.id === pat.assignedDoctorId))?.name}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE PATIENT MODAL */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPatientId(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 40 }} 
              className="relative bg-white w-full max-w-2xl rounded-[10px] shadow-2xl overflow-hidden border border-border"
            >
              {/* Profile Top */}
              <div className={cn(
                "p-10 text-white relative transition-colors duration-500",
                selectedPatient.status === "active" ? "bg-emerald-500" : "bg-slate-500"
              )}>
                <button onClick={() => setSelectedPatientId(null)} className="absolute top-8 right-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><X size={20} /></button>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 rounded-[10px] flex items-center justify-center text-5xl font-black">{selectedPatient.name[0]}</div>
                  <div>
                    <h3 className="text-4xl font-black tracking-tight">{selectedPatient.name}</h3>
                    <div className="flex gap-3 mt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedPatient.gender}</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedPatient.age} Years Old</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                        selectedPatient.status === "active" ? "bg-emerald-400 text-emerald-900" : "bg-slate-400 text-slate-900"
                      )}>
                        {selectedPatient.status === "active" ? <CheckCircle2 size={12} /> : <X size={12} />}
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-10 space-y-10 max-h-[50vh] overflow-y-auto">
                {/* Status Toggle Area */}
                <div className="p-6 bg-secondary/20 rounded-[10px] border border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Patient Management Status</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Toggle medical case availability</p>
                  </div>
                  <button 
                    onClick={() => togglePatientStatus(selectedPatient.id)}
                    className="relative"
                  >
                    <div 
                      className={cn(
                        "w-14 h-8 rounded-full p-1 transition-colors cursor-pointer",
                        selectedPatient.status === "active" ? "bg-emerald-500" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 bg-white rounded-full transition-transform",
                        selectedPatient.status === "active" ? "translate-x-6" : "translate-x-0"
                      )} />
                    </div>
                  </button>
                </div>
                {/* Logistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest"><Home size={14} className="text-emerald-500" /> Home Address</div>
                    <p className="font-bold text-sm leading-relaxed p-4 bg-secondary/20 rounded-[10px] border border-border">{selectedPatient.homeAddress}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest"><Truck size={14} className="text-primary" /> Delivery Address</div>
                    <p className="font-bold text-sm leading-relaxed p-4 bg-primary/5 rounded-[10px] border border-primary/20 text-primary">{selectedPatient.deliveryAddress}</p>
                  </div>
                </div>

                {/* Medication Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><ClipboardList size={14} className="text-emerald-500" /> Medication Audit</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[10px]">
                      <p className="text-[10px] font-black uppercase text-emerald-700 mb-3 flex items-center gap-1.5"><PackageCheck size={12} /> New Prescriptions</p>
                      <div className="space-y-2">
                        {selectedPatient.newMedicines.map(med => (
                          <div key={med} className="flex items-center gap-2 font-bold text-sm text-emerald-900"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {med}</div>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 bg-secondary/30 border border-border rounded-[10px]">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-3 flex items-center gap-1.5"><History size={12} /> Medical History</p>
                      <div className="space-y-2 opacity-60">
                        {selectedPatient.previousMedicines.map(med => (
                          <div key={med} className="flex items-center gap-2 font-bold text-sm line-through"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> {med}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physician Section */}
                <div className="pt-8 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-[10px] flex items-center justify-center shadow-lg shadow-blue-500/20"><Stethoscope size={24} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assigned Physician</p>
                      <p className="font-bold text-lg">{(doctors.find(d => d.id === selectedPatient.assignedDoctorId))?.name}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase">
                    <AlertCircle size={14} /> Critical Care Active
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-secondary/20 border-t border-border flex justify-end gap-3">
                <button onClick={() => setSelectedPatientId(null)} className="px-10 py-4 bg-emerald-500 text-white font-black text-xs uppercase rounded-[10px] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">Acknowledge Profile</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPICardSmall({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="p-4 bg-white border border-border rounded-[10px] flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center text-white shadow-md", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
        <p className="text-base font-black">{value}</p>
      </div>
    </div>
  );
}
