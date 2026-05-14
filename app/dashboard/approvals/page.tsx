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
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import { useData, ExpenseRequest } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { expenses, addExpense, updateExpenseStatus } = useData();
  const isManager = user?.role === "Manager";

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: "travel" as const,
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      staffId: "u-current",
      staffName: user?.name || "Anonymous",
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description
    });
    setIsAdding(false);
    setFormData({
      type: "travel",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  const myExpenses = expenses.filter(e => e.staffName === user?.name);
  const pendingForManager = expenses.filter(e => e.status === "pending");

  const stats = [
    { label: "Total Reimbursed", value: "AED 4,250", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Claims", value: isManager ? pendingForManager.length : myExpenses.filter(e => e.status === "pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Monthly Growth", value: "+12.5%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

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

      {/* Stats Cards */}
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
        {/* Main Tracker Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Receipt size={24} className="text-primary" /> {isManager ? "Pending Authorizations" : "My Expense Tracker"}
            </h3>
            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border">
              <button className="px-4 py-1.5 text-[10px] font-black uppercase bg-card rounded-md shadow-sm border border-border">All</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground">Pending</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground">Approved</button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[10px] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/10">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Claim Details</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Amount</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                    {isManager && <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(isManager ? pendingForManager : myExpenses).map((exp, i) => (
                    <motion.tr 
                      key={exp.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-secondary/30 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[10px] bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform">
                            {exp.type === 'travel' && <Plane size={18} />}
                            {exp.type === 'meal' && <Coffee size={18} />}
                            {exp.type === 'accommodation' && <Home size={18} />}
                            {exp.type === 'other' && <Receipt size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">{exp.description}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2 mt-1">
                              <Calendar size={12} /> {exp.date} · <User size={12} /> {exp.staffName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-black tabular-nums text-sm">
                        AED {exp.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase",
                          exp.status === 'approved' ? "bg-emerald-500/10 text-emerald-600" :
                          exp.status === 'rejected' ? "bg-rose-500/10 text-rose-600" :
                          "bg-amber-500/10 text-amber-600"
                        )}>
                          {exp.status === 'approved' && <CheckCircle2 size={12} />}
                          {exp.status === 'rejected' && <XCircle size={12} />}
                          {exp.status === 'pending' && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                          {exp.status}
                        </span>
                      </td>
                      {isManager && (
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updateExpenseStatus(exp.id, 'approved')}
                              className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all active:scale-95"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button 
                              onClick={() => updateExpenseStatus(exp.id, 'rejected')}
                              className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 hover:scale-110 transition-all active:scale-95"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                  {(isManager ? pendingForManager : myExpenses).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground opacity-30">
                          <Receipt size={32} />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No active claims found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info / Insights Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-[10px] p-8 card-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" /> Policy Overview
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="p-4 bg-secondary/30 rounded-[10px] border border-border">
                <p className="text-[10px] font-black uppercase text-primary mb-1">Travel Allowance</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Standard mileage reimbursement rate is set at AED 2.50 per km for all territories.</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-[10px] border border-border">
                <p className="text-[10px] font-black uppercase text-primary mb-1">Meal Caps</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Maximum daily meal expenditure restricted to AED 150 per representative.</p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-border mt-6">
                <span className="text-[10px] font-black uppercase text-muted-foreground">Audit Frequency</span>
                <span className="text-[10px] font-black uppercase bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">Weekly</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[10px] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-8 opacity-20">
              <TrendingUp size={100} />
            </div>
            <h3 className="text-xl font-black mb-2">Automated Audit</h3>
            <p className="text-xs text-indigo-100 uppercase font-black tracking-widest mb-6 opacity-80">AI Verification Engine</p>
            <p className="text-sm font-medium mb-8 leading-relaxed opacity-90">Our backend system automatically verifies geolocation and clinic check-ins against claim dates to ensure high-fidelity audits.</p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all underline underline-offset-8">
              Review Security protocols <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* New Claim Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-xl rounded-[10px] shadow-2xl border border-border p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">File Expense Claim</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Field Operation Resource Management</p>
                </div>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/70 transition-all"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Claim Category</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      <option value="travel">Travel & Fuel</option>
                      <option value="meal">Business Meal</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="other">Operational Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Claim Amount (AED)</label>
                    <input 
                      required
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Occurrence Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Justification & Details</label>
                  <textarea 
                    required
                    placeholder="Provide specific operational reason for this claim..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-4 bg-secondary/30 border border-border rounded-[10px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 bg-secondary text-foreground rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-secondary/70 transition-all"
                  >
                    Discard Claim
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-primary-foreground rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all"
                  >
                    Submit for Approval
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
