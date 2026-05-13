"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return <>{children}</>;
}
