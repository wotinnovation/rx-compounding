"use client";

import React, { useState } from "react";
import { useData, SalesRep } from "@/lib/context/data-context";
import { RepDetailedPerformance } from "@/components/rep-detailed-performance";
import { 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronRight,
  Stethoscope,
  MapPin,
  DollarSign,
  X,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TeamPerformancePage() {
  const { reps, isLoading, sales, hospitals, addRep } = useData();
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "Sales Person",
    zone: "Dubai North",
    password: "rx-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    targetAmount: 25000,
    planned: 40,
    email: "",
    mobile: ""
  });

  if (isLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filteredReps = reps.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedRep) {
    return <RepDetailedPerformance rep={selectedRep} onBack={() => setSelectedRep(null)} />;
  }

  const avgPct = reps.length > 0 
    ? Math.round(reps.reduce((acc, r) => {
        const rev = sales.filter(s => s.repId === r.id).reduce((a, s) => a + (s.amount || 0), 0);
        return acc + (r.targetAmount > 0 ? (rev / r.targetAmount) * 100 : 0);
      }, 0) / reps.length) 
    : 0;

  const handleAddRep = (e: React.FormEvent) => {
    e.preventDefault();
    addRep(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      role: "Sales Person",
      zone: "Dubai North",
      password: "rx-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      targetAmount: 25000,
      planned: 40,
      email: "",
      mobile: ""
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-60">Field Operations</h2>
          <h1 className="text-4xl font-extrabold mt-1 tracking-tight">Team Performance</h1>
          <p className="opacity-60 mt-2">Manage and analyze individual sales representative achievements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all font-bold flex items-center gap-2"
          >
            <Users size={18} /> Add New Staff
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search reps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-primary w-48 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Team Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Avg Achievement" value={`${avgPct}%`} icon={TrendingUp} color="bg-emerald-500" />
        <KPICard label="Total Doctors Covered" value={`${reps.reduce((acc, r) => acc + r.doctorsDetailed, 0)} / ${reps.reduce((acc, r) => acc + r.totalDoctors, 0)}`} icon={Stethoscope} color="bg-indigo-500" />
        <KPICard label="Current Revenue" value={`${sales.reduce((acc, s) => acc + (s.amount || 0), 0).toLocaleString()} AED`} icon={DollarSign} color="bg-blue-500" />
        <KPICard label="Unassigned Customers" value={hospitals.filter(h => !h.assignedRepId).length.toString()} icon={MapPin} color="bg-rose-500" />
      </div>

      {/* Rep List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReps.map((rep) => {
          const repSales = sales.filter(s => s.repId === rep.id);
          const revenue = repSales.reduce((acc, s) => acc + (s.amount || 0), 0);
          const revenuePct = rep.targetAmount > 0 ? Math.round((revenue / rep.targetAmount) * 100) : 0;

          return (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white border-none rounded-[10px] p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.08)] cursor-pointer transition-all group"
              onClick={() => setSelectedRep(rep)}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-[10px] flex items-center justify-center font-black text-lg">
                  {rep.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{rep.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{rep.zone}</p>
                </div>
                <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Visit Coverage</p>
                    <p className="text-lg font-black">{rep.visits} <span className="text-xs opacity-40">/ {rep.planned}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Visit Achievement</p>
                    <p className="text-lg font-black text-emerald-500">{rep.planned > 0 ? Math.round((rep.visits / rep.planned) * 100) : 0}%</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Revenue Target</span>
                    <span>{revenuePct}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", revenuePct >= 100 ? "bg-emerald-500" : "bg-primary")}
                      style={{ width: `${Math.min(revenuePct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ADD STAFF MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAddModalOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative bg-card border border-border w-full max-w-2xl rounded-[10px] shadow-2xl overflow-hidden"
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
                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddRep} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Michael Chen"
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Role / Designation</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    >
                      <option>Sales Person</option>
                      <option>Area Manager</option>
                      <option>Medical Liaison</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Assigned Zone</label>
                    <input 
                      type="text" 
                      required
                      value={formData.zone}
                      onChange={e => setFormData({...formData, zone: e.target.value})}
                      placeholder="e.g. Dubai South"
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Access Credentials</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full px-5 py-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-black"
                      />
                      <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. m.chen@rx-health.com"
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                      placeholder="e.g. +971 50 123 4567"
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Revenue Target (AED)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.targetAmount}
                      onChange={e => setFormData({...formData, targetAmount: parseInt(e.target.value)})}
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Planned Monthly Visits</label>
                    <input 
                      type="number" 
                      required
                      value={formData.planned}
                      onChange={e => setFormData({...formData, planned: parseInt(e.target.value)})}
                      className="w-full px-5 py-3 bg-secondary/20 border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 bg-secondary text-secondary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/70 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPICard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="p-6 bg-card border border-border rounded-[10px] card-shadow flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-[10px] flex items-center justify-center text-white shadow-lg", color)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
}
