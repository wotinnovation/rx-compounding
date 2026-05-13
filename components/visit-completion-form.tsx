"use client";

import React, { useState } from "react";
import { 
  X,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  ClipboardList,
  Zap,
  Package,
  Plus,
  ShoppingCart,
  FileText,
  Upload,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { Appointment, useData } from "@/lib/context/data-context";
import { cn } from "@/lib/utils";

interface VisitCompletionFormProps {
  meeting: Appointment;
  onClose: () => void;
}

export function VisitCompletionForm({ meeting, onClose }: VisitCompletionFormProps) {
  const { medicines, reps, doctors, updateAppointment } = useData();
  
  const [reportData, setReportData] = useState<Partial<Appointment>>({
    openingComments: meeting.openingComments || "",
    requirements: meeting.requirements || "",
    customCompound: meeting.customCompound || "",
    freeSamples: meeting.freeSamples || [],
    order: meeting.order || { medicineId: "", qty: 0, total: 0 },
    closingComments: meeting.closingComments || "",
    status: meeting.status || "completed"
  });

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSaveReport = () => {
    updateAppointment(meeting.id, reportData);
    onClose();
  };

  const addFreeSample = () => {
    const newSamples = [...(reportData.freeSamples || []), { medicineId: medicines[0]?.id || "", qty: 1 }];
    setReportData({ ...reportData, freeSamples: newSamples });
  };

  const updateFreeSample = (index: number, field: string, value: any) => {
    const newSamples = [...(reportData.freeSamples || [])];
    newSamples[index] = { ...newSamples[index], [field]: value };
    setReportData({ ...reportData, freeSamples: newSamples });
  };

  const removeFreeSample = (index: number) => {
    const newSamples = [...(reportData.freeSamples || [])].filter((_, i) => i !== index);
    setReportData({ ...reportData, freeSamples: newSamples });
  };

  const updateOrder = (field: string, value: any) => {
    const currentOrder = reportData.order || { medicineId: "", qty: 0, total: 0 };
    const updatedOrder = { ...currentOrder, [field]: value };
    
    if (field === "medicineId" || field === "qty") {
      const med = medicines.find(m => m.id === updatedOrder.medicineId);
      if (med) {
        updatedOrder.total = med.price * updatedOrder.qty;
      }
    }
    
    setReportData({ ...reportData, order: updatedOrder });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-5xl max-h-[90vh] rounded-[10px] shadow-2xl border border-border pointer-events-auto flex flex-col overflow-hidden"
      >
        {/* Simple Header */}
        <div className="p-8 border-b border-border relative bg-secondary/10">
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-8 right-8 w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Log Visit Outcome</p>
              <h2 className="text-2xl font-black tracking-tight">{meeting.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Building2 size={12} /> {meeting.entityName}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> {meeting.hour}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[240px]">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Accompanied With</label>
              <select 
                className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-[11px] font-bold outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="">No Accompaniment</option>
                <optgroup label="Field Staff">
                  {reps.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        {/* Two-Section Grid Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
            
            {/* Left Section: Clinical Detailing & Feedback */}
            <div className="bg-card p-8 space-y-10">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Detailing & Feedback</h3>
              </div>

              <section className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Opening Remarks</label>
                <textarea 
                  placeholder="Enter visit opening notes..."
                  value={reportData.openingComments}
                  onChange={(e) => setReportData({...reportData, openingComments: e.target.value})}
                  className="w-full p-5 bg-secondary/30 border border-border rounded-[10px] focus:ring-1 focus:ring-primary outline-none text-sm min-h-[100px] resize-none font-medium"
                />
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Requirement Collection</label>
                <textarea 
                  placeholder="Document specific facility needs..."
                  value={reportData.requirements}
                  onChange={(e) => setReportData({...reportData, requirements: e.target.value})}
                  className="w-full p-5 bg-secondary/30 border border-border rounded-[10px] focus:ring-1 focus:ring-primary outline-none text-sm min-h-[100px] resize-none font-medium"
                />
              </section>

              <section className="space-y-4 p-6 bg-purple-500/5 border border-purple-500/10 rounded-[10px]">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Custom Formulation</span>
                </div>
                <textarea 
                  placeholder="Define custom compound details..."
                  value={reportData.customCompound}
                  onChange={(e) => setReportData({...reportData, customCompound: e.target.value})}
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-purple-500/20 rounded-[10px] focus:outline-none text-sm min-h-[80px] resize-none font-medium"
                />
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Closing & Follow-up</label>
                <textarea 
                  placeholder="Final feedback and follow-up timeline..."
                  value={reportData.closingComments}
                  onChange={(e) => setReportData({...reportData, closingComments: e.target.value})}
                  className="w-full p-5 bg-secondary/30 border border-border rounded-[10px] focus:ring-1 focus:ring-primary outline-none text-sm min-h-[120px] resize-none font-medium"
                />
              </section>
            </div>

            {/* Right Section: Allocation & Orders */}
            <div className="bg-card p-8 space-y-10 border-l border-border">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Package size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Allocation & Orders</h3>
              </div>

              {/* Samples Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">Free Samples</span>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        const newSamples = [...(reportData.freeSamples || []), { medicineId: e.target.value, qty: 1 }];
                        setReportData({ ...reportData, freeSamples: newSamples });
                        e.target.value = ""; 
                      }
                    }}
                    className="bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <option value="">Quick Add Sample...</option>
                    {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {reportData.freeSamples?.map((sample, idx) => {
                    const med = medicines.find(m => m.id === sample.medicineId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-secondary/20 border border-border/50 rounded-xl group/sample">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Package size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-tight">{med?.name}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">{med?.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            value={sample.qty}
                            onChange={(e) => updateFreeSample(idx, "qty", parseInt(e.target.value) || 1)}
                            className="w-10 bg-white border border-border rounded-lg text-center font-black text-[10px] py-1"
                          />
                          <button onClick={() => removeFreeSample(idx)} className="text-rose-500 hover:text-rose-600 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(!reportData.freeSamples || reportData.freeSamples.length === 0) && (
                    <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">No samples added</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Order Section */}
              <section className="space-y-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[10px]">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <ShoppingCart size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Direct Sale Order</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <select 
                    value={reportData.order?.medicineId}
                    onChange={(e) => updateOrder("medicineId", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border rounded-lg font-bold text-[11px] outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Primary Product...</option>
                    {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      value={reportData.order?.qty}
                      onChange={(e) => updateOrder("qty", parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-3 bg-white border border-border rounded-lg font-bold text-[11px] outline-none focus:ring-1 focus:ring-blue-500 text-center"
                    />
                    <div className="flex-[2] flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-lg font-black text-[11px]">
                      <span className="uppercase opacity-70">Total:</span>
                      <span>AED {(reportData.order?.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Prescription Verification</label>
                <div className="border-2 border-dashed border-border rounded-[10px] p-6 text-center hover:bg-secondary/20 cursor-pointer group transition-colors">
                  <Upload size={20} className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Upload clinical scans / Proof</p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 border-t border-border bg-secondary/10 flex items-center justify-between gap-4">
          <select 
            value={reportData.status}
            onChange={(e) => setReportData({...reportData, status: e.target.value as any})}
            className="px-4 py-2 bg-card border border-border rounded-[10px] font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 text-muted-foreground font-black text-[10px] uppercase hover:bg-secondary rounded-[10px] transition-colors">Discard</button>
            <button 
              type="button"
              onClick={handleSaveReport} 
              className="px-10 py-3 bg-primary text-primary-foreground font-black text-[10px] uppercase rounded-[10px] shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
            >
              Finalize Visit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

