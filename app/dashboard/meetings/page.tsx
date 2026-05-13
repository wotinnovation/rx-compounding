"use client";

import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Calendar, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  TrendingUp,
  Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData, Appointment } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";
import { VisitCompletionForm } from "@/components/visit-completion-form";

export default function MeetingsPage() {
  const { appointments, addAppointment } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMeeting, setSelectedMeeting] = useState<Appointment | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // New Meeting Form State
  const [formData, setFormData] = useState({
    title: "",
    entityName: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    hour: "10:00",
    duration: "1h",
    description: "",
    contactPerson: "",
    type: "meeting" as Appointment["type"]
  });

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.entityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pagination Logic
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAppointments.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({ ...formData, status: "scheduled" });
    setIsAddModalOpen(false);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      entityName: "",
      location: "",
      date: new Date().toISOString().split('T')[0],
      hour: "10:00",
      duration: "1h",
      description: "",
      contactPerson: "",
      type: "meeting"
    });
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "visited": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "closed": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "cancelled": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "upcoming": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sticky top-0 z-40 bg-background/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-border/50 mb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Meetings & Visited</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium italic">Operational history and field scheduling console.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" placeholder="Filter records..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3.5 bg-secondary/30 border border-border rounded-2xl w-64 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:translate-y-[-2px] transition-all"
          >
            <Plus size={18} />
            <span>New Visit</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {["all", "scheduled", "upcoming", "visited", "completed", "closed", "cancelled"].map((status) => (
          <button
            key={status} onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm",
              statusFilter === status 
                ? "bg-primary text-primary-foreground border-primary shadow-primary/20" 
                : "bg-card text-muted-foreground border-border hover:bg-secondary/50"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-2xl card-shadow flex flex-col min-h-[600px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Day & Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit Objective</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Facility</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {currentRows.map((app, idx) => (
                <motion.tr 
                  key={app.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                  className="hover:bg-secondary/20 transition-colors group cursor-pointer"
                  onClick={() => setSelectedMeeting(app)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center text-primary shadow-inner">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="font-black text-sm">{new Date(app.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {app.hour}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-200 group-hover:text-primary transition-colors uppercase tracking-tight">{app.title}</p>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{app.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-muted-foreground" />
                      <div>
                        <p className="font-bold text-sm">{app.entityName}</p>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">{app.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-inner",
                      getStatusStyle(app.status)
                    )}>
                      {app.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-secondary rounded-xl transition-all shadow-sm"><MoreHorizontal size={20} className="text-muted-foreground" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-10 border-t border-border flex items-center justify-between bg-secondary/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredAppointments.length)} of {filteredAppointments.length} Operational Records
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-3 border border-border rounded-2xl disabled:opacity-30 hover:bg-secondary transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(totalPages)].slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={cn(
                    "w-12 h-12 rounded-2xl font-black text-xs transition-all border shadow-sm",
                    currentPage === i + 1 ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20" : "bg-card border-border hover:bg-secondary text-muted-foreground"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="px-2 opacity-40">...</span>}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-3 border border-border rounded-2xl disabled:opacity-30 hover:bg-secondary transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMeeting && (
          <VisitCompletionForm meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-card w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-border">
              <div className="p-12 bg-primary text-primary-foreground relative overflow-hidden">
                <button onClick={() => setIsAddModalOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 z-10"><X size={24} /></button>
                <h3 className="text-3xl font-black tracking-tighter">Schedule Field Visit</h3>
                <p className="opacity-80 mt-2 font-medium italic">Define meeting agenda and facility requirements.</p>
              </div>
              <form onSubmit={handleAddMeeting} className="p-12 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <input required type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-8 py-5 bg-secondary/30 border border-border rounded-[2rem] outline-none font-bold" />
                  <input required type="text" placeholder="Facility Name" value={formData.entityName} onChange={(e) => setFormData({...formData, entityName: e.target.value})} className="w-full px-8 py-5 bg-secondary/30 border border-border rounded-[2rem] outline-none font-bold" />
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-8 py-5 bg-secondary/30 border border-border rounded-[2rem] outline-none font-bold" />
                  <input required type="time" value={formData.hour} onChange={(e) => setFormData({...formData, hour: e.target.value})} className="w-full px-8 py-5 bg-secondary/30 border border-border rounded-[2rem] outline-none font-bold" />
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="w-full px-8 py-5 bg-secondary/30 border border-border rounded-[2rem] outline-none appearance-none font-bold">
                    <option value="meeting">Meeting</option>
                    <option value="medical">Medical</option>
                    <option value="audit">Audit</option>
                  </select>
                </div>
                <div className="flex justify-end gap-6 pt-6">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-10 py-5 text-muted-foreground font-black text-xs uppercase hover:bg-secondary rounded-[2rem] transition-all">Discard</button>
                  <button type="submit" className="px-14 py-5 bg-primary text-primary-foreground font-black text-xs uppercase rounded-[2rem] shadow-2xl hover:scale-105 transition-all">Confirm Dispatch</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
