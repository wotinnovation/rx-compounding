"use client";

import React, { useState } from "react";
import { 
  Receipt, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  TrendingUp, 
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  Plane,
  Coffee,
  Home,
  MoreHorizontal,
  Search,
  Gift,
  Building2,
  Pill,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import { useData, ExpenseRequest, Appointment } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";
import { AppointmentDetailModal } from "@/components/appointment-detail-modal";
import { GiftDetailModal } from "@/components/gift-detail-modal";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { 
    expenses, updateExpenseStatus, 
    appointments, updateAppointment,
    giftMeetups, updateGiftMeetupStatus,
    approveSamples, medicines
  } = useData();
  const isManager = user?.role === "Manager";

  const [activeTab, setActiveTab] = useState<"all" | "expenses" | "visits" | "gifts" | "samples">("all");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    type: "travel" as const,
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In this unified view, new claims are handled by context
    setIsAdding(false);
  };

  const myExpenses = expenses.filter(e => e.staffName === user?.name);
  const pendingExpenses = expenses.filter(e => e.status === "pending");
  const pendingVisits = appointments.filter(a => a.status === "pending_approval");
  const pendingGifts = giftMeetups.filter(g => g.status === "pending_approval");
  const pendingSamples = appointments.filter(a => a.freeSamples && a.freeSamples.some(s => !s.approved));

  // Combined Pending List for "All" tab
  const allPending = [
    ...pendingExpenses.map(e => ({ ...e, category: 'Expense', title: e.description })),
    ...pendingVisits.map(v => ({ ...v, category: 'Visit', item: v.title })),
    ...pendingGifts.map(g => ({ ...g, category: 'Gift/Meetup', title: g.item })),
    ...pendingSamples.map(s => ({ ...s, category: 'Samples', title: 'Clinical Sample Provision' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const stats = [
    { label: "Total Reimbursed", value: "AED 4,250", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Action Required", value: isManager ? allPending.length : myExpenses.filter(e => e.status === "pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Monthly Growth", value: "+12.5%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const handleRowClick = (item: any) => {
    if (item.category === 'Visit' || item.category === 'Samples') setSelectedAppointment(item);
    if (item.category === 'Gift/Meetup') setSelectedGift(item);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 dashboard-header">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-80 min-[1400px]:block hidden">
            Financial Operations
          </h2>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">Approvals & Expenses</h1>
          <p className="text-muted-foreground mt-4 font-medium text-lg max-w-2xl leading-relaxed">
            {isManager 
              ? "Review and authorize field expense claims and operational budget requests." 
              : "Track your operational expenses and managerial approval status in real-time."}
          </p>
        </div>
        {!isManager && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all"
          >
            <Plus size={18} /> New Claim
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-card border border-border rounded-[10px] card-shadow flex items-center justify-between group"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
            </div>
            <div className={cn("w-14 h-14 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={28} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <ShieldCheck size={24} className="text-primary" /> {isManager ? "Pending Authorizations" : "My Request Status"}
            </h3>
            <div className="flex bg-secondary/50 p-1 rounded-lg border border-border overflow-x-auto max-w-full no-scrollbar">
              <button onClick={() => setActiveTab("all")} className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-md transition-all whitespace-nowrap", activeTab === "all" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>All Requests</button>
              <button onClick={() => setActiveTab("expenses")} className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-md transition-all whitespace-nowrap", activeTab === "expenses" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>Expenses</button>
              <button onClick={() => setActiveTab("visits")} className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-md transition-all whitespace-nowrap", activeTab === "visits" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>Visit Reports</button>
              <button onClick={() => setActiveTab("gifts")} className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-md transition-all whitespace-nowrap", activeTab === "gifts" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>Gifts & Meetups</button>
              <button onClick={() => setActiveTab("samples")} className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-md transition-all whitespace-nowrap", activeTab === "samples" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}>Samples</button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[10px] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/10">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Log Description & Type</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Staff & Facility</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Value / Qty</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(() => {
                    let displayItems: any[] = [];
                    if (activeTab === "all") displayItems = allPending;
                    else if (activeTab === "expenses") displayItems = pendingExpenses.map(e => ({ ...e, category: 'Expense', title: e.description }));
                    else if (activeTab === "visits") displayItems = pendingVisits.map(v => ({ ...v, category: 'Visit', title: v.title }));
                    else if (activeTab === "gifts") displayItems = pendingGifts.map(g => ({ ...g, category: 'Gift/Meetup', title: g.item }));
                    else if (activeTab === "samples") displayItems = pendingSamples.map(s => ({ ...s, category: 'Samples', title: 'Clinical Sample Provision' }));

                    return displayItems.map((item: any, i) => (
                      <motion.tr 
                        key={`${item.category}-${item.id}`} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.05 }} 
                        onClick={() => handleRowClick(item)}
                        className="group hover:bg-secondary/30 transition-all cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-[10px] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg",
                              item.category === 'Expense' ? "bg-amber-500" : (item.category === 'Visit' ? "bg-primary" : (item.category === 'Samples' ? "bg-emerald-500" : "bg-blue-600"))
                            )}>
                              {item.category === 'Expense' ? <Wallet size={18} /> : (item.category === 'Visit' ? <ShieldCheck size={18} /> : (item.category === 'Samples' ? <Pill size={18} /> : <Gift size={18} />))}
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">{item.title || item.description || item.item}</p>
                              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1 opacity-60">{item.category} · {item.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-bold">{item.staffName}</p>
                          <p className="text-[9px] font-black uppercase text-muted-foreground mt-0.5 tracking-widest">{item.entityName || item.hospitalName || "Field Location"}</p>
                        </td>
                        <td className="px-8 py-6 text-center font-black tabular-nums text-sm">
                          {item.amount ? `AED ${item.amount.toLocaleString()}` : (item.cost ? `AED ${item.cost.toLocaleString()}` : (item.freeSamples ? `${item.freeSamples.filter((s:any) => !s.approved).reduce((sum:number, s:any) => sum + s.qty, 0)} Units` : "Report"))}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item);
                            }}
                            className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            Review & Audit
                          </button>
                        </td>
                      </motion.tr>
                    ));
                  })()}
                  {allPending.length === 0 && ( activeTab === "all" ) && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground opacity-30"><ShieldCheck size={32} /></div>
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Clear Workspace: No pending requests</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex items-center gap-2 px-6 py-2 bg-secondary/30 rounded-full border border-border">
            <ShieldCheck size={14} className="text-primary" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Strategic Authorizations Archive</h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden shadow-2xl shadow-black/5">
          <div className="p-8 bg-secondary/5 border-b border-border flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Process Log</p>
              <h3 className="text-xl font-black">Historical Verification</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase"><CheckCircle2 size={12} /> Authorized</div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-600 rounded-full text-[9px] font-black uppercase"><XCircle size={12} /> Revoked</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Type & Subject</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Beneficiary / Staff</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Value</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Final Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(() => {
                  const historicalExpenses = expenses.filter(e => e.status !== "pending").map(e => ({ ...e, category: 'Expense' }));
                  const historicalVisits = appointments.filter(a => a.status === "completed" || a.status === "cancelled").map(a => ({ ...a, category: 'Visit', amount: 0 }));
                  const historicalGifts = giftMeetups.filter(g => g.status !== "pending_approval").map(g => ({ ...g, category: 'Gift/Meetup', amount: g.cost || 0 }));
                  const historicalSamples = appointments.filter(a => a.freeSamples && a.freeSamples.every(s => s.approved)).map(a => ({ ...a, category: 'Samples', amount: 0 }));
                  const allHistory = [...historicalExpenses, ...historicalVisits, ...historicalGifts, ...historicalSamples].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                  return allHistory.map((item: any, i) => (
                    <motion.tr key={`${item.category}-${item.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="group hover:bg-secondary/20 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center text-white shadow-lg", item.category === 'Expense' ? "bg-amber-500" : (item.category === 'Visit' ? "bg-primary" : (item.category === 'Samples' ? "bg-emerald-500" : "bg-blue-600")))}>
                            {item.category === 'Expense' ? <Wallet size={18} /> : (item.category === 'Visit' ? <ShieldCheck size={18} /> : (item.category === 'Samples' ? <Pill size={18} /> : <Gift size={18} />))}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-tight">{item.description || item.title || item.item || "Provision Log"}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{item.category} · {item.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold">{item.staffName}</p>
                        <p className="text-[9px] font-black uppercase text-muted-foreground mt-0.5 tracking-widest">{item.hospitalName || item.entityName || "Medical Facility"}</p>
                      </td>
                      <td className="px-8 py-6 text-center font-black tabular-nums text-sm">{item.amount > 0 ? `AED ${item.amount.toLocaleString()}` : "—"}</td>
                      <td className="px-8 py-6 text-right">
                        <span className={cn("inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest", (item.status === 'approved' || item.status === 'completed' || item.category === 'Samples') ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                          {(item.status === 'approved' || item.status === 'completed' || item.category === 'Samples') ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {item.status?.replace('_', ' ') || 'Authorized'}
                        </span>
                      </td>
                    </motion.tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentDetailModal 
            meeting={selectedAppointment}
            role="Manager"
            onClose={() => setSelectedAppointment(null)}
          />
        )}
        {selectedGift && (
          <GiftDetailModal 
            item={selectedGift}
            onClose={() => setSelectedGift(null)}
            onApprove={(id, comment) => updateGiftMeetupStatus(id, "approved", comment)}
            onReject={(id, comment) => updateGiftMeetupStatus(id, "rejected", comment)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
