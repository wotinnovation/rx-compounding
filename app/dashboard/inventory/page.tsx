"use client";

import React from "react";
import { 
  BarChart3, 
  Pill, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Package,
  Activity,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";

export default function InventoryAnalysisPage() {
  const { medicines, sales, hospitals } = useData();

  // Calculate analysis data
  const medicineStats = medicines.map(med => {
    const medSales = sales.filter(s => s.medicineId === med.id);
    const unitsSold = medSales.reduce((acc, s) => acc + (s.quantity || 0), 0);
    const revenue = medSales.reduce((acc, s) => acc + (s.amount || 0), 0);
    const stockPct = Math.max(0, Math.min(100, (med.stock / 1500) * 100)); // Assuming 1500 is max capacity for demo
    
    // Find top consuming hospital
    const hospitalConsumption: Record<string, number> = {};
    medSales.forEach(s => {
      hospitalConsumption[s.hospitalId] = (hospitalConsumption[s.hospitalId] || 0) + s.quantity;
    });
    const topHospitalId = Object.entries(hospitalConsumption).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topHospital = hospitals.find(h => h.id === topHospitalId);

    return {
      ...med,
      unitsSold,
      revenue,
      stockPct,
      topHospital: topHospital?.name || "N/A"
    };
  });

  const totalStock = medicines.reduce((acc, m) => acc + m.stock, 0);
  const totalRevenue = medicineStats.reduce((acc, m) => acc + m.revenue, 0);
  const lowStockItems = medicineStats.filter(m => m.stockPct < 30);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Intelligence</h1>
          <p className="text-muted-foreground mt-2">Real-time stock health and supply chain consumption audit.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">System Secure</span>
          </div>
          <button className="p-3 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all flex items-center gap-2 font-bold">
            <Zap size={18} /> Reorder All Low Stock
          </button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Stock Units" value={totalStock.toLocaleString()} subValue="+12% vs last month" icon={Package} color="bg-blue-500" />
        <StatCard label="Inventory Value" value={`${totalRevenue.toLocaleString()} AED`} subValue="Projected Revenue" icon={BarChartIcon} color="bg-primary" />
        <StatCard label="Active Items" value={medicines.length.toString()} subValue="Pharmaceutical SKU" icon={Pill} color="bg-purple-500" />
        <StatCard label="Critical Alerts" value={lowStockItems.length.toString()} subValue="Action Required" icon={AlertTriangle} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Health Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary" size={20} /> Stock Health Monitor
            </h3>
          </div>
          <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden card-shadow">
            <table className="w-full text-left">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Medicine</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Stock Level</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Consumption</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Top Facility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {medicineStats.map((med) => (
                  <tr key={med.id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Pill size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{med.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{med.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${med.stockPct}%` }}
                            className={cn(
                              "h-full transition-all duration-1000",
                              med.stockPct < 30 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                          />
                        </div>
                        <span className="text-[10px] font-black">{med.stock} Units Left</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <TrendingUp size={14} />
                        <span className="text-sm">{med.unitsSold} sold</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="font-bold text-xs truncate max-w-[150px] inline-block">{med.topHospital}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Primary Consumer</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <PieChartIcon className="text-primary" size={20} /> Supply Chain Insights
          </h3>
          <div className="space-y-4">
            {lowStockItems.length > 0 && (
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <AlertTriangle size={80} />
                </div>
                <h4 className="text-amber-700 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} /> Critical Stock Alert
                </h4>
                <p className="text-sm text-amber-900 font-medium mb-4">The following items are below the 30% safety threshold and require immediate replenishment.</p>
                <div className="space-y-2">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-amber-200">
                      <span className="text-xs font-bold">{item.name}</span>
                      <span className="text-xs font-black text-amber-600">{item.stock} LEFT</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-card border border-border rounded-3xl card-shadow">
              <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-6">Revenue Distribution</h4>
              <div className="space-y-6">
                {medicineStats.sort((a,b) => b.revenue - a.revenue).slice(0, 3).map((med, idx) => (
                  <div key={med.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-bold">{med.name}</p>
                      <p className="text-sm font-black text-primary">{(med.revenue || 0).toLocaleString()} AED</p>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (med.revenue / totalRevenue) * 300)}%` }} // Scaled for visual
                        className={cn(
                          "h-full transition-all",
                          idx === 0 ? "bg-primary" : idx === 1 ? "bg-blue-500" : "bg-purple-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary text-white rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <TrendingUp size={60} className="absolute bottom-[-10px] right-[-10px] opacity-20 group-hover:scale-110 transition-transform" />
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Demand Forecast</h4>
              <p className="text-lg font-bold leading-tight mb-4">Predicted 25% increase in respiratory demand next week.</p>
              <button className="px-4 py-2 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all">
                Adjust Supply Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, icon: Icon, color }: any) {
  return (
    <div className="bg-card border border-border p-6 rounded-[2.5rem] card-shadow group relative overflow-hidden">
      <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full -mr-12 -mt-12 transition-all group-hover:opacity-20", color)} />
      <div className="relative z-10 flex flex-col gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-black">{value}</p>
          <div className="flex items-center gap-1 mt-1 text-emerald-600 font-bold text-[10px]">
            <ArrowUpRight size={12} />
            {subValue}
          </div>
        </div>
      </div>
    </div>
  );
}
