"use client";

import React from "react";
import { AppointmentsView } from "@/components/appointments-view";
import { useData } from "@/lib/context/data-context";
import { MANAGER_APPOINTMENTS } from "@/lib/data/manager-appointments-data";
import { STAFF_MEETINGS } from "@/lib/data/staff-meetings-data";

export default function ManagerAppointmentsPage() {
  const { appointments } = useData();

  // Combine Manager-specific tasks with all Staff engagements for total oversight
  const combinedData = [
    ...MANAGER_APPOINTMENTS,
    ...STAFF_MEETINGS,
    ...appointments.filter(a => 
      !MANAGER_APPOINTMENTS.find(m => m.id === a.id) && 
      !STAFF_MEETINGS.find(s => s.id === a.id)
    )
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppointmentsView 
      title="Appointments" 
      subtitle="Total operational oversight: Strategic management and staff field engagements."
      data={combinedData}
      role="Manager"
    />
  );
}
