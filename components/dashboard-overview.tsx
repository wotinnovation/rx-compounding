"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Pill,
  Award,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Hospital as HospitalIcon,
  X,
  Stethoscope,
  Activity,
  CheckCircle2,
  ArrowUpRight,
  ClipboardList,
  Zap,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";
import { useData, Appointment, SalesRep } from "@/lib/context/data-context";
import { ManagerDashboard } from "./manager-dashboard";
import { VisitCompletionForm } from "./visit-completion-form";
import { AppointmentDetailModal } from "./appointment-detail-modal";
import { NewAuditForm } from "./forms/new-audit-form";
import { NewFacilityForm } from "./forms/new-facility-form";
import { NewPatientForm } from "./forms/new-patient-form";
import { NewDoctorForm } from "./forms/new-doctor-form";
import { STAFF_UPCOMING, STAFF_MEETINGS } from "@/lib/data/staff-meetings-data";

export function DashboardOverview({ mockUser }: { mockUser?: { name: string, role: string } }) {
  const { user: authUser } = useAuth();
  const { hospitals, reps, doctors, appointments, isLoading } = useData();

  const [activeModal, setActiveModal] = useState<"audit" | "facility" | "patient" | "doctor" | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Appointment | null>(null);
  const [loggingMeeting, setLoggingMeeting] = useState<Appointment | null>(null);

  const user = mockUser || authUser;

  if (!user || isLoading) return null;

  const isManager = user.role === "Manager";

  if (isManager) {
    return <ManagerDashboard />;
  }

  // Today's Data
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(app => app.date === todayStr);
  const completedToday = todaysAppointments.filter(app => app.status === "completed").length;

  // Merge today's context appointments + today's scheduled staff meetings
  const todayStaffScheduled = STAFF_MEETINGS
    .filter(m => m.date === todayStr && m.status === "scheduled");
  const todaysFocus = [
    ...todaysAppointments,
    ...todayStaffScheduled.filter(sm => !todaysAppointments.find(a => a.id === sm.id))
  ].sort((a, b) => a.hour.localeCompare(b.hour));

  // Future pipeline sorted ascending by date
  const upcomingMeetings = appointments
    .filter(app => app.status === "scheduled" || app.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const stats = [
    { label: "Today's Schedule", value: todaysFocus.length.toString(), sub: `${completedToday} Completed`, icon: MapPin, color: "bg-blue-500" },
    { label: "Sales Pipeline", value: "75%", sub: "12.4k to Goal", icon: TrendingUp, color: "bg-emerald-500" },
    { label: "System Sync", value: "Active", sub: "Cloud Updated", icon: Activity, color: "bg-amber-500" },
    { label: "Market Rank", value: "#04", sub: "Top 10% Regional", icon: Award, color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 dashboard-header">
        <div>
          <h2 className="text-[9px] font-black uppercase tracking-wider min-[1400px]:block hidden text-primary mb-2 opacity-80 transition-all duration-500">
            Operations Control Center
          </h2>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">RX Intelligence Hub</h1>
          <p className="text-muted-foreground mt-4 font-medium text-lg max-w-2xl leading-relaxed">
            Welcome back, <span className="text-foreground font-black">{user.name}</span>. You have <span className="text-primary font-bold">{todaysFocus.length - completedToday} priority tasks</span> remaining today.
          </p>
        </div>
        <div className="flex items-center gap-4 px-8 py-4 bg-card border border-border rounded-[10px] shadow-2xl shadow-primary/5">
          <Clock className="text-primary" size={24} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Shift</span>
            <span className="text-sm font-black">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative p-6 rounded-[10px] overflow-hidden group transition-all hover:scale-[1.02] bg-white border-none shadow-[0_15px_45px_-15px_rgba(0,0,0,0.08)] stat-card-container"
          >
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
            <div className="relative z-10 flex items-center gap-5">
              <div className={`w-14 h-14 ${stat.color} rounded-[12px] flex items-center justify-center text-white shrink-0 shadow-xl shadow-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon size={28} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight leading-none mb-1.5">{stat.value}</p>
                <div className="flex items-center gap-1.5 opacity-60">
                  <div className={cn("w-1.5 h-1.5 rounded-full", stat.color)} />
                  <p className="text-[9px] font-bold uppercase tracking-widest truncate">{stat.sub}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN: Today's Focus */}
        <div className="lg:col-span-8 bg-card border border-border rounded-[10px] card-shadow overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
            <h3 className="text-xl font-black tracking-tight uppercase">Today's Focus</h3>
            <Zap className="text-primary" size={24} />
          </div>
          <div className="divide-y divide-border">
            {todaysFocus.slice(0, 6).map((app, i) => (
              <motion.div
                key={`${app.id}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedMeeting(app)}
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-all group"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Clock size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors truncate">{app.title}</p>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-secondary rounded uppercase tracking-widest">{app.type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <HospitalIcon size={12} className="text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase truncate max-w-[150px]">{app.entityName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" />
                        <span className="text-[10px] font-black tabular-nums">{app.hour}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">{app.location}</p>
                    <p className={cn(
                      "text-[9px] font-bold uppercase tracking-widest mt-0.5",
                      (app.id.length % 3 === 0) ? "text-amber-500" : (app.id.length % 3 === 1) ? "text-blue-500" : "text-slate-400"
                    )}>
                      {(app.id.length % 3 === 0) ? "High Priority" : (app.id.length % 3 === 1) ? "Medium Priority" : "Normal Priority"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (app.status === "completed") {
                        setSelectedMeeting(app);
                      } else {
                        setLoggingMeeting(app);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest border transition-all shadow-lg",
                      app.status === "completed"
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20"
                        : "bg-primary text-white border-primary shadow-primary/20 hover:-translate-y-0.5"
                    )}
                  >
                    {app.status === "completed" ? <CheckCircle2 size={14} /> : <ClipboardList size={14} />}
                    <span className="hidden xs:inline">{app.status === "completed" ? "Completed" : "Log Visit"}</span>
                  </button>
                </div>
              </motion.div>
            ))}
            {todaysFocus.length === 0 && (
              <div className="py-20 text-center opacity-40">
                <Zap size={40} className="mx-auto mb-4" />
                <p className="italic text-sm font-bold uppercase tracking-widest">No active tasks for this shift.</p>
              </div>
            )}
          </div>
          {todaysFocus.length > 6 && (
            <div className="p-4 bg-secondary/10 border-t border-border">
              <Link
                href="/dashboard/appointments"
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-border rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
              >
                View Full Operational Schedule <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Operational Activity Log */}
        <div className="lg:col-span-4">
          <div className="bg-card border-2 border-primary/5 rounded-[10px] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight uppercase">Activity Log</h3>
                <div className="w-8 h-8 bg-primary/10 rounded-[10px] flex items-center justify-center text-primary"><ClipboardList size={18} /></div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-secondary/20 rounded-[10px] border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
                  <p className="text-[9px] font-black uppercase text-emerald-500 mb-1">Visit Completed</p>
                  <p className="text-sm font-black tracking-tight">Successfully closed visit at Mediclinic Dubai Mall</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Just now · 3 Doctors Detailed</p>
                </div>
                <div className="p-4 bg-secondary/20 rounded-[10px] border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
                  <p className="text-[9px] font-black uppercase text-primary mb-1">Audit Logged</p>
                  <p className="text-sm font-black tracking-tight">Facility audit submitted for Al Zahra Hospital</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">12 mins ago · System Synced</p>
                </div>
                <div className="p-4 bg-secondary/20 rounded-[10px] border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
                  <p className="text-[9px] font-black uppercase text-indigo-500 mb-1">Customer Added</p>
                  <p className="text-sm font-black tracking-tight">Dr. Ahmed Al Hammadi added to professional network</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">1h ago · Dubai Hills Clinic</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">System Shortcuts</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveModal("audit")}
                    className="w-full flex items-center justify-between p-4 bg-primary/5 hover:bg-primary border border-primary/10 hover:border-primary rounded-[10px] transition-all group/action"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-primary/10 group-hover/action:bg-white/20 flex items-center justify-center text-primary group-hover/action:text-white transition-colors">
                        <Plus size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">Schedule Visit</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase group-hover:text-white/60 transition-colors">Logistics Deployment</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveModal("facility")}
                    className="w-full flex items-center justify-between p-4 bg-secondary/20 hover:bg-emerald-500 border border-border/50 hover:border-emerald-500 rounded-[10px] transition-all group/action"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-emerald-500/10 group-hover/action:bg-white/20 flex items-center justify-center text-emerald-500 group-hover/action:text-white transition-colors">
                        <HospitalIcon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">Add Clinic</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase group-hover:text-white/60 transition-colors">Register New Facility</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveModal("doctor" as any)}
                    className="w-full flex items-center justify-between p-4 bg-secondary/20 hover:bg-amber-500 border border-border/50 hover:border-amber-500 rounded-[10px] transition-all group/action"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-amber-500/10 group-hover/action:bg-white/20 flex items-center justify-center text-amber-500 group-hover/action:text-white transition-colors">
                        <Stethoscope size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">Add Doctor</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase group-hover:text-white/60 transition-colors">Onboard Professional</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveModal("patient")}
                    className="w-full flex items-center justify-between p-4 bg-secondary/20 hover:bg-indigo-500 border border-border/50 hover:border-indigo-500 rounded-[10px] transition-all group/action"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-indigo-500/10 group-hover/action:bg-white/20 flex items-center justify-center text-indigo-500 group-hover/action:text-white transition-colors">
                        <Users size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">Add Patient</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase group-hover:text-white/60 transition-colors">Onboard New Record</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: Upcoming Itinerary */}
      <div className="mt-10">
        <div className="bg-card border border-border rounded-[10px] overflow-hidden shadow-2xl h-full flex flex-col">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight uppercase">Upcoming Itinerary</h3>
              <p className="text-sm text-muted-foreground mt-1">Confirmed appointments and scheduled route audits for the week.</p>
            </div>
            <span className="px-6 py-2 bg-primary/10 text-primary rounded-[10px] text-[11px] font-black uppercase tracking-widest border border-primary/20">
              {STAFF_UPCOMING.length} Total Visits Ahead
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timeline & Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit Focus</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location Facility</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {STAFF_UPCOMING.slice(0, 5).map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group hover:bg-secondary/30 transition-all cursor-pointer"
                    onClick={() => setSelectedMeeting(app)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[10px] bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground shrink-0">
                          <Calendar size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm uppercase tracking-tight">{new Date(app.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {app.hour}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors truncate max-w-[280px]">{app.title}</p>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-secondary rounded uppercase tracking-widest mt-1 inline-block">{app.type}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <HospitalIcon size={14} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs font-black truncate max-w-[180px]">{app.entityName}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{app.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest border whitespace-nowrap",
                        app.status === "upcoming" ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", app.status === "upcoming" ? "bg-indigo-500" : "bg-primary")} />
                        {app.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal === "audit" && <NewAuditForm onClose={() => setActiveModal(null)} />}
        {activeModal === "facility" && <NewFacilityForm onClose={() => setActiveModal(null)} />}
        {activeModal === "patient" && <NewPatientForm onClose={() => setActiveModal(null)} />}
        {activeModal === "doctor" && <NewDoctorForm onClose={() => setActiveModal(null)} />}

        {selectedMeeting && (
          <AppointmentDetailModal
            meeting={selectedMeeting}
            role={user.role}
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
