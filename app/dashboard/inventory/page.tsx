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
  Zap,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";

export default function InventoryAnalysisPage() {
  const { medicines: medicinesData, sales, hospitals } = useData();
  const [activeTab, setActiveTab] = React.useState<"analysis" | "selection">("analysis");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [cart, setCart] = React.useState<{ id: string; quantity: number }[]>([]);
  const [isOrdered, setIsOrdered] = React.useState(false);

  // Calculate analysis data
  const medicineStats = medicinesData.map(med => {
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

  const totalStock = medicinesData.reduce((acc, m) => acc + m.stock, 0);
  const totalRevenue = medicineStats.reduce((acc, m) => acc + m.revenue, 0);
  const lowStockItems = medicineStats.filter(m => m.stockPct < 30);

  // Selection Logic
  const filteredMedicines = medicinesData.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const med = medicinesData.find(m => m.id === item.id);
    return acc + (med ? med.price * item.quantity : 0);
  }, 0);

  const handleOrder = () => {
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      setCart([]);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
            <button 
              onClick={() => setActiveTab("analysis")}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                activeTab === "analysis" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Intelligence
            </button>
            <button 
              onClick={() => setActiveTab("selection")}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                activeTab === "selection" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Medicine Selection
            </button>
          </div>
          <button className="p-3 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
            <Zap size={18} /> Reorder Low Stock
          </button>
        </div>

      <AnimatePresence mode="wait">
        {activeTab === "analysis" ? (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Stock Units" value={totalStock.toLocaleString()} subValue="+12% vs last month" icon={Package} color="bg-blue-500" />
              <StatCard label="Inventory Value" value={`${totalRevenue.toLocaleString()} AED`} subValue="Projected Revenue" icon={BarChartIcon} color="bg-primary" />
              <StatCard label="Active Items" value={medicinesData.length.toString()} subValue="Pharmaceutical SKU" icon={Pill} color="bg-purple-500" />
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
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Medicine List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 bg-card border border-border rounded-[2rem] focus:ring-4 focus:ring-primary/10 outline-none transition-all card-shadow font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMedicines.map((med) => (
                  <motion.div
                    layout
                    key={med.id}
                    className="p-6 bg-card border border-border rounded-[2rem] hover:border-primary/40 transition-all card-shadow flex justify-between items-start group"
                  >
                    <div>
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <Pill size={24} />
                      </div>
                      <h4 className="font-bold text-lg">{med.name}</h4>
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1">{med.category}</p>
                      <p className="mt-4 font-black text-primary text-xl">{med.price.toFixed(2)} AED</p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Available: {med.stock} Units</p>
                    </div>
                    <button
                      onClick={() => addToCart(med.id)}
                      className="p-4 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                      <Plus size={24} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selection Cart */}
            <div className="space-y-6">
              <div className="p-8 bg-card border border-border rounded-[2.5rem] card-shadow sticky top-8">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <ShoppingCart size={28} className="text-primary" /> Selection Cart
                </h3>
                
                <div className="space-y-6 max-h-[500px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-3xl border border-dashed border-border">
                      <Pill size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest">No Selection Active</p>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const med = medicinesData.find(m => m.id === item.id);
                      if (!med) return null;
                      return (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          key={item.id}
                          className="flex items-center justify-between group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate text-sm">{med.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{med.price.toFixed(2)} AED / unit</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-secondary rounded-xl px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary"><Minus size={14} /></button>
                              <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="space-y-6 pt-8 border-t border-border">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selection Value</span>
                      <span className="text-3xl font-black text-primary">{cartTotal.toFixed(2)} AED</span>
                    </div>
                    <button
                      onClick={handleOrder}
                      disabled={isOrdered}
                      className={cn(
                        "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl",
                        isOrdered ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-98"
                      )}
                    >
                      {isOrdered ? (
                        <><Check size={20} /> Order Authorized</>
                      ) : (
                        <><ShoppingCart size={20} /> Submit Selection</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
