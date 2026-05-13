"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { motion } from "framer-motion";
import { Stethoscope, Lock, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [name, setName] = useState("Faisal Al Marzouqi");
  const [role, setRole] = useState("Sales Person");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 glass rounded-3xl card-shadow relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-4">
            <Stethoscope size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Access Portal</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage RxSales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-secondary/50 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => { setRole("Sales Person"); setName("Faisal Al Marzouqi"); }}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                role === "Sales Person" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sales Person
            </button>
            <button
              type="button"
              onClick={() => { setRole("Manager"); setName("John Manager"); }}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                role === "Manager" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Manager
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Enter name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
          >
            Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex justify-between text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Forgot Access Key?</a>
          <a href="#" className="hover:text-primary transition-colors">System Status: Online</a>
        </div>
      </motion.div>
    </div>
  );
}
