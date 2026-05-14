"use client";

import React from "react";
import { AppointmentsView } from "@/components/appointments-view";
import { useData } from "@/lib/context/data-context";
import { STAFF_MEETINGS } from "@/lib/data/staff-meetings-data";
import { MANAGER_APPOINTMENTS } from "@/lib/data/manager-appointments-data";

export default function StaffAppointmentsPage() {
  const { appointments } = useData();

  // Specifically merge staff meetings data and manager data
  const staffData = [
    ...appointments,
    ...STAFF_MEETINGS.filter(sm => !appointments.find(a => a.id === sm.id)),
    ...MANAGER_APPOINTMENTS.filter(ma => !appointments.find(a => a.id === ma.id))
  ];

  return (
    <AppointmentsView 
      title="Team Operations Hub" 
      subtitle="Complete field audits, sync with management, and track healthcare engagements."
      data={staffData}
      role="Staff"
    />
  );
}
