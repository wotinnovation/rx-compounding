"use client";

import React from "react";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Download,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Hospital
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const salesHistory = [
  { id: "ORD-7281", client: "Central Pharmacy", date: "2024-05-12", amount: 1250.00, status: "Completed", growth: "+12%" },
  { id: "ORD-7282", client: "St. Jude Medical", date: "2024-05-11", amount: 840.50, status: "Processing", growth: "+5%" },
  { id: "ORD-7283", client: "Wellness Hub", date: "2024-05-10", amount: 2100.00, status: "Completed", growth: "+18%" },
  { id: "ORD-7284", client: "Metro Drugs", date: "2024-05-09", amount: 450.00, status: "Cancelled", growth: "-2%" },
  { id: "ORD-7285", client: "City Health", date: "2024-05-08", amount: 1670.25, status: "Completed", growth: "+8%" },
];

const closedItems = [
  { id: 1, task: "Annual Contract Renewal", client: "City General Hospital", date: "2024-05-10", type: "Contract" },
  { id: 2, task: "Sample Delivery", client: "Dr. Aris Clinic", date: "2024-05-09", type: "Sample" },
  { id: 3, task: "Q1 Performance Review", client: "Sales HQ", date: "2024-05-08", type: "Review" },
  { id: 4, task: "Product Launch Seminar", client: "Medical Association", date: "2024-05-05", type: "Event" },
];

export default function SalesViewPage() {
  const [activeTab, setActiveTab] = React.useState<"sales" | "activities">("sales");

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Performance Hub</h1>
          <p className="text-muted-foreground mt-1 font-medium">Track your commercial sales and operational activity archives.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
            <button 
              onClick={() => setActiveTab("sales")}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                activeTab === "sales" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sales Analytics
            </button>
            <button 
              onClick={() => setActiveTab("activities")}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                activeTab === "activities" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Closed Activities
            </button>
          </div>
          <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "sales" ? (
          <motion.div 
            key="sales"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Revenue", value: "45,280.50 AED", change: "+12.5%", positive: true },
                { label: "Orders Closed", value: "128", change: "+8.2%", positive: true },
                { label: "Avg. Deal Size", value: "353.75 AED", change: "-2.1%", positive: false },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="p-8 bg-card border border-border rounded-[2.5rem] card-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{stat.label}</p>
                  <div className="flex items-end justify-between relative z-10">
                    <h3 className="text-3xl font-black">{stat.value}</h3>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter",
                      stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sales Table */}
            <div className="bg-card border border-border rounded-[2.5rem] card-shadow overflow-hidden">
              <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/10">
                <h3 className="text-xl font-black uppercase tracking-tight">Recent Order History</h3>
                <div className="flex items-center gap-4">
                  <div className="flex bg-white/50 p-1 rounded-lg border border-border">
                    <button className="p-1.5 hover:bg-secondary rounded-md transition-colors text-muted-foreground"><Filter size={16} /></button>
                  </div>
                  <BarChart3 className="text-primary" size={24} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-secondary/30 text-muted-foreground uppercase text-[10px] font-black tracking-[0.2em]">
                      <th className="px-8 py-5">Order ID</th>
                      <th className="px-8 py-5">Client</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5 text-right">Amount</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {salesHistory.map((sale) => (
                      <tr key={sale.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-8 py-6 font-mono text-xs font-black text-primary">{sale.id}</td>
                        <td className="px-8 py-6 font-black text-sm">{sale.client}</td>
                        <td className="px-8 py-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">{sale.date}</td>
                        <td className="px-8 py-6 font-black text-right">{sale.amount.toFixed(2)} <span className="text-[8px] opacity-50">AED</span></td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            <span className={cn(
                              "px-3 py-1.5 rounded-[8px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border",
                              sale.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                              sale.status === "Processing" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                              "bg-red-500/10 text-red-600 border-red-500/20"
                            )}>
                              {sale.status === "Completed" && <CheckCircle2 size={12} />}
                              {sale.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button className="p-2.5 hover:bg-secondary rounded-xl transition-all text-muted-foreground group-hover:text-primary active:scale-90">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-border flex justify-center bg-secondary/5">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all">View All Sales History</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="activities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {closedItems.map((item, i) => (
                <div
                  key={item.id}
                  className="p-8 bg-card border border-border rounded-[2.5rem] card-shadow hover:border-emerald-500/50 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={32} />
                    </div>
                    <span className="text-[10px] uppercase font-black px-3 py-1.5 bg-secondary border border-border rounded-xl tracking-widest shadow-sm">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">{item.task}</h3>
                  <p className="text-muted-foreground text-sm font-bold flex items-center gap-2 mb-8">
                    <Hospital size={16} className="text-primary" /> {item.client}
                  </p>
                  <div className="pt-6 border-t border-border flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Calendar size={14} className="text-emerald-500" /> Completed on {item.date}
                    </div>
                    <button className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-[-20px] right-[-20px] opacity-5 group-hover:opacity-10 transition-opacity">
                    <CheckCircle2 size={120} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
