"use client";

import React from "react";
import { AppointmentsView } from "@/components/appointments-view";
import { useData } from "@/lib/context/data-context";
import { STAFF_MEETINGS } from "@/lib/data/staff-meetings-data";

export default function StaffAppointmentsPage() {
  const { appointments } = useData();

  // Specifically merge staff meetings data
  const staffData = [
    ...appointments,
    ...STAFF_MEETINGS.filter(sm => !appointments.find(a => a.id === sm.id))
  ];

  return (
    <AppointmentsView 
      title="Staff Itinerary" 
      subtitle="Complete your field audits and manage healthcare engagements."
      data={staffData}
      role="Staff"
    />
  );
}
