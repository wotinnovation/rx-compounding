"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  Ban,
  Eye,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useData, Appointment } from "@/lib/context/data-context";
import { useAuth } from "@/lib/context/auth-context";
import { cn } from "@/lib/utils";
import { VisitCompletionForm } from "@/components/visit-completion-form";
import { AppointmentDetailModal } from "@/components/appointment-detail-modal";

import { STAFF_MEETINGS as DUMMY_MEETINGS, STAFF_UPCOMING } from "@/lib/data/staff-meetings-data";

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; pill: string }> = {
  visited:   { label: "Visited",   icon: Eye,         color: "bg-blue-500",    pill: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-emerald-500", pill: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  closed:    { label: "Closed",    icon: AlertCircle,  color: "bg-slate-500",   pill: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  cancelled: { label: "Cancelled", icon: Ban,          color: "bg-rose-500",    pill: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  scheduled: { label: "Scheduled", icon: Clock,        color: "bg-amber-500",   pill: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  upcoming:  { label: "Upcoming",  icon: Clock,        color: "bg-indigo-500",  pill: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
};

const ROWS_PER_PAGE = 10;

export default function StaffMeetingsPage() {
  const { addAppointment } = useData();
  const { user } = useAuth();
  const router = useRouter();

  // ── All hooks must be declared before any early returns ─────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMeeting, setSelectedMeeting] = useState<Appointment | null>(null);
  const [detailMeeting, setDetailMeeting] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", entityName: "", location: "",
    date: new Date().toISOString().split("T")[0],
    hour: "09:00", duration: "1h", description: "", contactPerson: "",
    type: "meeting" as Appointment["type"],
  });

  const filtered = useMemo(() => {
    return DUMMY_MEETINGS.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchSearch = m.title.toLowerCase().includes(q) || m.entityName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const currentRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: DUMMY_MEETINGS.length };
    Object.keys(STATUS_CONFIG).forEach(s => { c[s] = DUMMY_MEETINGS.filter(m => m.status === s).length; });
    return c;
  }, []);

  // ── Role Guard: Managers are redirected to their own dashboard ───────────────
  useEffect(() => {
    if (user?.role === "Manager") router.replace("/dashboard");
  }, [user, router]);

  if (user?.role === "Manager") return null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddModalOpen(false);
        setSelectedMeeting(null);
        setDetailMeeting(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({ ...formData, status: "scheduled" });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* ── Page Header ────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 sticky top-0 z-40 bg-background/90 backdrop-blur-xl py-5 -mx-4 px-4 border-b border-border/50">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-80">Operational Hub</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Staff Meetings</h1>
          <p className="text-muted-foreground mt-2 text-base font-medium">All team meetings, field visits, and coordination sessions.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input
              type="text" placeholder="Search meetings..."
              value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-11 pr-5 py-3.5 bg-secondary/30 border border-border rounded-[10px] w-60 focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-medium"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} /> Schedule
          </button>
        </div>
      </header>

      {/* ── Summary Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
              className={cn(
                "flex flex-col items-start p-5 rounded-[10px] border transition-all hover:scale-[1.03]",
                statusFilter === key ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "bg-card border-border"
              )}
            >
              <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center text-white mb-3 shadow-lg", cfg.color)}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-black">{counts[key]}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{cfg.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Status Filter Bar ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 flex items-center gap-1.5"><Filter size={12} /> Filter:</span>
        {["all", ...Object.keys(STATUS_CONFIG)].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
            className={cn(
              "px-5 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest border transition-all",
              statusFilter === s ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-muted-foreground border-border hover:bg-secondary/50"
            )}
          >
            {s === "all" ? `All (${counts.all})` : `${STATUS_CONFIG[s].label} (${counts[s]})`}
          </button>
        ))}
      </div>


      {/* ── Data Table ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[10px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border">
                {["Day & Date", "Meeting Title", "Location / Entity", "Type", "Status", "Contact", "Action"].map(h => (
                  <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {currentRows.map((m, idx) => {
                const cfg = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.scheduled;
                const StatusIcon = cfg.icon;
                return (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedMeeting(m)}
                  >
                    {/* Date */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[10px] bg-secondary/50 border border-border flex items-center justify-center text-primary">
                          <Calendar size={17} />
                        </div>
                        <div>
                          <p className="font-black text-sm leading-none">{new Date(m.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{m.hour} · {m.duration}</p>
                        </div>
                      </div>
                    </td>
                    {/* Title */}
                    <td className="px-8 py-5">
                      <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors max-w-[180px] truncate">{m.title}</p>
                      <p className="text-[9px] text-muted-foreground mt-1 truncate max-w-[180px]">{m.description}</p>
                    </td>
                    {/* Entity */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-muted-foreground shrink-0" />
                        <p className="font-bold text-sm truncate max-w-[160px]">{m.entityName}</p>
                      </div>
                    </td>
                    {/* Type */}
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        m.type === "medical" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        m.type === "audit"   ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                               "bg-purple-500/10 text-purple-500 border-purple-500/20"
                      )}>{m.type}</span>
                    </td>
                    {/* Status */}
                    <td className="px-8 py-5">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest border", cfg.pill)}>
                        <StatusIcon size={11} />
                        {m.status}
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary">
                          {m.contactPerson.charAt(0)}
                        </div>
                        <p className="text-xs font-bold truncate max-w-[100px]">{m.contactPerson}</p>
                      </div>
                    </td>
                    {/* Action */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {(m.status === "scheduled" || m.status === "upcoming") && (
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedMeeting(m); }}
                            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
                          >
                            Open Form
                          </button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); setDetailMeeting(m); }}
                          className="px-4 py-2 bg-secondary/50 text-muted-foreground border border-border rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-secondary"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm opacity-40">No records match your filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-10 py-8 border-t border-border bg-secondary/5 flex items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length} records
            </p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                className="p-2.5 border border-border rounded-[10px] disabled:opacity-30 hover:bg-secondary transition-all">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={cn("w-10 h-10 rounded-[10px] font-black text-xs border transition-all",
                    currentPage === p ? "bg-primary text-primary-foreground border-primary shadow-lg" : "border-border hover:bg-secondary text-muted-foreground"
                  )}>{p}</button>
              ))}
              {totalPages > 7 && <span className="opacity-30 text-xs">…{totalPages}</span>}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                className="p-2.5 border border-border rounded-[10px] disabled:opacity-30 hover:bg-secondary transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Visit Completion Panel ─────────────────────────────── */}
      <AnimatePresence>
        {selectedMeeting && (
          <VisitCompletionForm meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
        )}
        {detailMeeting && (
          <AppointmentDetailModal 
            meeting={detailMeeting} 
            role="Staff" 
            onClose={() => setDetailMeeting(null)} 
            onLogVisit={() => {
              setSelectedMeeting(detailMeeting);
              setDetailMeeting(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Add Meeting Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 24 }}
              className="relative bg-card border border-border w-full max-w-2xl rounded-[10px] shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-12 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
                <button type="button" onClick={() => setIsAddModalOpen(false)}
                  className="absolute top-8 right-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 z-10 transition-colors">
                  <X size={22} />
                </button>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-3">Staff Operations</p>
                  <h3 className="text-3xl font-black tracking-tighter">Schedule New Meeting</h3>
                  <p className="text-sm opacity-70 mt-2 font-medium">Define the agenda, location, and team lead.</p>
                </div>
              </div>
              {/* Modal Form */}
              <form onSubmit={handleAdd} className="p-12 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input required type="text" placeholder="Meeting Title"
                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="col-span-2 px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm focus:ring-4 focus:ring-primary/10" />
                  <input required type="text" placeholder="Entity / Facility"
                    value={formData.entityName} onChange={e => setFormData({ ...formData, entityName: e.target.value })}
                    className="px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm" />
                  <input required type="text" placeholder="Location"
                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm" />
                  <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm" />
                  <input required type="time" value={formData.hour} onChange={e => setFormData({ ...formData, hour: e.target.value })}
                    className="px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm" />
                  <input type="text" placeholder="Contact Person"
                    value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm" />
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as Appointment["type"] })}
                    className="px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm appearance-none">
                    <option value="meeting">Internal Meeting</option>
                    <option value="medical">Medical Visit</option>
                    <option value="audit">Route Audit</option>
                  </select>
                  <textarea placeholder="Notes / Agenda"
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-2 px-7 py-4 bg-secondary/20 border border-border rounded-[10px] outline-none font-bold text-sm resize-none min-h-[80px]" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)}
                    className="px-10 py-4 text-muted-foreground font-black text-xs uppercase hover:bg-secondary rounded-[10px] transition-all">
                    Discard
                  </button>
                  <button type="submit"
                    className="px-14 py-4 bg-primary text-primary-foreground font-black text-xs uppercase rounded-[10px] shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                    Confirm Meeting
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
