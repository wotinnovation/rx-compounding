"use client";

import React, { useState } from "react";
import { Pill, Search, Plus, Minus, Trash2, ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const medicines = [
  { id: 1, name: "Amoxicillin 500mg", type: "Antibiotic", price: 12.50, stock: 150 },
  { id: 2, name: "Lisinopril 10mg", type: "Blood Pressure", price: 8.20, stock: 200 },
  { id: 3, name: "Atorvastatin 20mg", type: "Cholesterol", price: 15.75, stock: 85 },
  { id: 4, name: "Metformin 850mg", type: "Diabetes", price: 5.40, stock: 300 },
  { id: 5, name: "Amlodipine 5mg", type: "Blood Pressure", price: 7.90, stock: 120 },
  { id: 6, name: "Omeprazole 20mg", type: "Acid Reflux", price: 9.30, stock: 180 },
];

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => {
    const med = medicines.find(m => m.id === item.id);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medicine Selection</h1>
        <p className="text-muted-foreground mt-2">Browse and select medicines for your clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Medicine List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all card-shadow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMedicines.map((med) => (
              <motion.div
                layout
                key={med.id}
                className="p-5 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all card-shadow flex justify-between items-start"
              >
                <div>
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                    <Pill size={20} />
                  </div>
                  <h4 className="font-bold text-lg">{med.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{med.type}</p>
                  <p className="mt-2 font-bold text-primary">{med.price.toFixed(2)} AED</p>
                </div>
                <button
                  onClick={() => addToCart(med.id)}
                  className="p-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all"
                  title="Add to selection"
                >
                  <Plus size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selection Cart */}
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-3xl card-shadow sticky top-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingCart size={22} className="text-primary" /> Selection Cart
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Pill size={40} className="mx-auto mb-3 opacity-20" />
                  <p>No medicines selected yet.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const med = medicines.find(m => m.id === item.id);
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
                        <p className="font-bold truncate">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.price.toFixed(2)} AED / unit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-secondary rounded-lg px-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="text-2xl font-black text-primary">{total.toFixed(2)} AED</span>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={isOrdered}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    isOrdered ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02]"
                  )}
                >
                  {isOrdered ? (
                    <><Check size={20} /> Order Submitted</>
                  ) : (
                    "Submit Selection"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
