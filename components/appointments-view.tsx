"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Calendar as CalendarIcon, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  X,
  ChevronLeft, 
  ChevronRight,
  Activity,
  Zap,
  LayoutList,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData, Appointment } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";
import { VisitCompletionForm } from "@/components/visit-completion-form";
import { AppointmentDetailModal } from "@/components/appointment-detail-modal";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; pill: string }> = {
  scheduled: { label: "Scheduled", icon: Clock, color: "bg-blue-500", pill: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-emerald-500", pill: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  upcoming:  { label: "Upcoming",  icon: CalendarIcon, color: "bg-indigo-500", pill: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  visited:   { label: "Visited",   icon: Activity, color: "bg-amber-500", pill: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

interface AppointmentsViewProps {
  title: string;
  subtitle: string;
  data: Appointment[];
  role: "Manager" | "Staff";
}

export function AppointmentsView({ title, subtitle, data, role }: AppointmentsViewProps) {
  const { isLoading } = useData();
  const [view, setView] = useState<"list" | "calendar">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMeeting, setSelectedMeeting] = useState<Appointment | null>(null);
  const [loggingMeeting, setLoggingMeeting] = useState<Appointment | null>(null);
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 13));

  const filtered = useMemo(() => {
    return data.filter(app => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = app.title.toLowerCase().includes(q) || 
                           app.entityName.toLowerCase().includes(q) ||
                           (app.contactPerson && app.contactPerson.toLowerCase().includes(q));
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  }, [currentDate]);

  const shiftWeek = (weeks: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + weeks * 7);
    setCurrentDate(nextDate);
  };

  if (isLoading) return null;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-80">
            {role === "Manager" ? "Strategic Oversight" : "Logistical Intelligence"}
          </h2>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">{title}</h1>
          <p className="text-muted-foreground mt-4 font-medium text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-[10px] shadow-xl">
          <button onClick={() => setView("list")} className={cn("px-4 py-2.5 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all", view === "list" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary")}>
            <LayoutList size={16} /> List
          </button>
          <button onClick={() => setView("calendar")} className={cn("px-4 py-2.5 rounded-[8px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all", view === "calendar" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary")}>
            <CalendarDays size={16} /> Calendar
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input type="text" placeholder="Search operations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {["all", "scheduled", "upcoming", "completed", "visited"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-6 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border", statusFilter === s ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground")}>{s}</button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex bg-card border border-border rounded-[10px] overflow-hidden shadow-sm">
                <button onClick={() => shiftWeek(-1)} className="p-3 hover:bg-secondary border-r border-border transition-colors"><ChevronLeft size={20} /></button>
                <div className="px-6 py-3 font-black text-xs uppercase tracking-widest min-w-[200px] text-center">{startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(new Date(startOfWeek).setDate(startOfWeek.getDate() + 6)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <button onClick={() => shiftWeek(1)} className="p-3 hover:bg-secondary border-l border-border transition-colors"><ChevronRight size={20} /></button>
              </div>
              <button onClick={() => setCurrentDate(new Date(2026, 4, 13))} className="px-6 py-3 bg-secondary/50 border border-border rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Today</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border border-border rounded-[10px] shadow-2xl overflow-hidden relative">
        {view === "list" ? (
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timeline & Objective</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Medical Facility</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Personnel & Patient</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((app, i) => (
                  <motion.tr key={app.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} onClick={() => setSelectedMeeting(app)} className="group hover:bg-secondary/30 transition-all cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0"><CalendarIcon size={18} /></div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{app.title}</p>
                          <p className="text-[10px] font-bold text-muted-foreground mt-1 line-clamp-1 max-w-[300px]">{app.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {app.hour}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="text-[9px] font-black px-2 py-0.5 bg-secondary rounded uppercase tracking-widest">{app.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black truncate max-w-[200px]">{app.hospitalName || app.entityName}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{app.location}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[7px] font-black text-blue-600">D</div>
                           <p className="text-xs font-bold">{app.doctorName || app.contactPerson}</p>
                        </div>
                        {app.patientName && (
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-[7px] font-black text-pink-600">P</div>
                             <p className="text-[10px] font-bold text-muted-foreground">{app.patientName}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                           <p className="text-[8px] font-black uppercase text-muted-foreground">Staff:</p>
                           <p className="text-[9px] font-bold text-primary">{app.staffName || "System"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={cn("inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest border", STATUS_CONFIG[app.status]?.pill || "bg-secondary text-muted-foreground")}>{app.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative z-10 overflow-x-auto">
            <div className="grid grid-cols-8 border-b border-border bg-secondary/10 min-w-[1200px] calendar-grid-container">
              <div className="p-6 border-r border-border flex items-center justify-center bg-background/50"><Clock size={18} className="text-muted-foreground" /></div>
              {DAYS.map((day, idx) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + idx);
                const isToday = date.toDateString() === new Date(2026, 4, 13).toDateString();
                return (
                  <div key={day} className={cn("p-6 text-center border-r last:border-0 border-border flex flex-col items-center", isToday ? "bg-primary/5" : "bg-background/20")}>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{day}</span>
                    <span className={cn("text-xl font-black tabular-nums", isToday ? "text-primary" : "text-foreground/80")}>{date.getDate()}</span>
                  </div>
                );
              })}
            </div>
            <div className="relative min-w-[1200px] calendar-grid-container">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-border last:border-0 group min-h-[140px]">
                  <div className="p-6 border-r border-border text-[10px] font-black text-muted-foreground flex items-center justify-center bg-secondary/5 group-hover:bg-secondary/20 transition-colors">{hour}</div>
                  {DAYS.map((_, dayIdx) => {
                    const dayDate = new Date(startOfWeek);
                    dayDate.setDate(startOfWeek.getDate() + dayIdx);
                    const dayDateStr = dayDate.toISOString().split('T')[0];
                    const hourApps = filtered.filter(a => a.date === dayDateStr && a.hour === hour);
                    return (
                      <div key={dayIdx} className="p-2 border-r last:border-0 border-border relative hover:bg-primary/5 transition-all group/cell">
                        {hourApps.map((app) => (
                          <motion.div key={app.id} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={() => setSelectedMeeting(app)} className={cn("absolute inset-2 rounded-[10px] p-3 shadow-2xl text-[10px] flex flex-col justify-between z-10 border border-white/10 hover:scale-[1.05] transition-all cursor-pointer", app.type === "medical" ? "bg-blue-600 text-white" : app.type === "meeting" ? "bg-purple-600 text-white" : "bg-emerald-600 text-white")}>
                            <p className="font-black uppercase tracking-tighter mb-1 leading-tight">{app.title}</p>
                            <div className="flex flex-col gap-0.5">
                              <p className="opacity-80 font-bold truncate">{app.hospitalName || app.entityName}</p>
                              <p className="text-[8px] font-black uppercase opacity-60">Staff: {app.staffName || "Unassigned"}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-2 opacity-70 italic"><MapPin size={8} /> {app.location}</div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMeeting && (
          <AppointmentDetailModal 
            meeting={selectedMeeting} 
            role={role}
            onClose={() => setSelectedMeeting(null)} 
            onLogVisit={() => {
              setLoggingMeeting(selectedMeeting);
              setSelectedMeeting(null);
            }}
          />
        )}
        {loggingMeeting && (
          <VisitCompletionForm 
            meeting={loggingMeeting} 
            onClose={() => setLoggingMeeting(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
