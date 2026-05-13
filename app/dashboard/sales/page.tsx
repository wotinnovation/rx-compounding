"use client";

import React from "react";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Download,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const salesHistory = [
  { id: "ORD-7281", client: "Central Pharmacy", date: "2024-05-12", amount: 1250.00, status: "Completed", growth: "+12%" },
  { id: "ORD-7282", client: "St. Jude Medical", date: "2024-05-11", amount: 840.50, status: "Processing", growth: "+5%" },
  { id: "ORD-7283", client: "Wellness Hub", date: "2024-05-10", amount: 2100.00, status: "Completed", growth: "+18%" },
  { id: "ORD-7284", client: "Metro Drugs", date: "2024-05-09", amount: 450.00, status: "Cancelled", growth: "-2%" },
  { id: "ORD-7285", client: "City Health", date: "2024-05-08", amount: 1670.25, status: "Completed", growth: "+8%" },
];

export default function SalesViewPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your performance and order history.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border border-border rounded-xl font-medium flex items-center gap-2 hover:bg-secondary transition-all">
            <Filter size={18} /> Filter
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: "45,280.50 AED", change: "+12.5%", positive: true },
          { label: "Orders Closed", value: "128", change: "+8.2%", positive: true },
          { label: "Avg. Deal Size", value: "353.75 AED", change: "-2.1%", positive: false },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card border border-border rounded-3xl card-shadow"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <div className={cn(
                "flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Table */}
      <div className="bg-card border border-border rounded-3xl card-shadow overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold">Recent Closed Items</h3>
          <BarChart3 className="text-muted-foreground" size={20} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {salesHistory.map((sale) => (
                <tr key={sale.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-primary">{sale.id}</td>
                  <td className="px-6 py-4 font-bold">{sale.client}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{sale.date}</td>
                  <td className="px-6 py-4 font-bold">{sale.amount.toFixed(2)} AED</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit",
                      sale.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" :
                      sale.status === "Processing" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {sale.status === "Completed" && <CheckCircle2 size={12} />}
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground group-hover:text-foreground">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-center">
          <button className="text-sm font-bold text-primary hover:underline">View All Sales History</button>
        </div>
      </div>
    </div>
  );
}
