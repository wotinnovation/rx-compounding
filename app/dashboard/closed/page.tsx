"use client";

import React from "react";
import { CheckCircle2, Search, Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const closedItems = [
  { id: 1, task: "Annual Contract Renewal", client: "City General Hospital", date: "2024-05-10", type: "Contract" },
  { id: 2, task: "Sample Delivery", client: "Dr. Aris Clinic", date: "2024-05-09", type: "Sample" },
  { id: 3, task: "Q1 Performance Review", client: "Sales HQ", date: "2024-05-08", type: "Review" },
  { id: 4, task: "Product Launch Seminar", client: "Medical Association", date: "2024-05-05", type: "Event" },
];

export default function ClosedItemsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Closed Items</h1>
        <p className="text-muted-foreground mt-2">Archive of completed tasks and successful engagements.</p>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search archives..."
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {closedItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card border border-border rounded-3xl card-shadow hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-1 bg-secondary rounded-lg tracking-widest">
                {item.type}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{item.task}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mb-6">
              <User size={14} /> {item.client}
            </p>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar size={14} /> Completed on {item.date}
              </div>
              <button className="p-2 hover:bg-secondary rounded-full transition-all group-hover:translate-x-1">
                <ArrowRight size={18} className="text-primary" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
