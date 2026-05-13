import type { Appointment } from "@/lib/context/data-context";

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const offset = (n: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + n);
  return fmt(d);
};

// Strategic Manager Activities
const managerMeetings: Appointment[] = [
  {
    id: "mg-1",
    title: "Regional Sales Strategy Q3",
    type: "meeting",
    entityName: "Board Room HQ",
    location: "Main Headquarters",
    date: offset(0),
    hour: "09:00",
    duration: "2h",
    description: "Quarterly alignment on territory expansion and medicine select growth targets.",
    contactPerson: "Executive Director",
    status: "scheduled",
    staffName: "Management Team"
  },
  {
    id: "mg-2",
    title: "Staff Performance Audit — Priya Nair",
    type: "audit",
    entityName: "Marina Zone",
    location: "Marina Specialized Clinic",
    date: offset(0),
    hour: "11:30",
    duration: "1h",
    description: "On-site verification of Priya's field engagements and doctor detailing quality.",
    contactPerson: "Dr. Joseph Pereira",
    status: "upcoming",
    staffName: "Priya Nair",
    hospitalName: "Marina Specialized Clinic"
  },
  {
    id: "mg-3",
    title: "Territory Review: Bur Dubai",
    type: "meeting",
    entityName: "Field Force Hub",
    location: "City Heart Hospital",
    date: offset(1),
    hour: "10:00",
    duration: "1.5h",
    description: "Meeting with Ahmed Mahmoud to discuss territory gaps and hospital mapping.",
    contactPerson: "Ahmed Mahmoud",
    status: "scheduled",
    staffName: "Ahmed Mahmoud",
    hospitalName: "City Heart Hospital"
  },
  {
    id: "mg-4",
    title: "Compliance & Ethics Workshop",
    type: "meeting",
    entityName: "Training Center",
    location: "HQ Wing B",
    date: offset(-1),
    hour: "14:00",
    duration: "3h",
    description: "Mandatory session for all staff on new pharmaceutical distribution guidelines.",
    contactPerson: "Compliance Officer",
    status: "completed",
    staffName: "Full Team",
    openingComments: "All representatives attended. Workshop materials distributed.",
    closingComments: "Certification completed for 100% of the field force."
  },
  {
    id: "mg-5",
    title: "Hospital Network Expansion Sync",
    type: "audit",
    entityName: "Aster Network",
    location: "Al Noor Polyclinic",
    date: offset(2),
    hour: "09:00",
    duration: "2h",
    description: "Evaluating the integration of 5 new Aster branches into the sales rep routes.",
    contactPerson: "Dr. Sarah Khan",
    status: "scheduled",
    staffName: "Faisal Al Marzouqi",
    hospitalName: "Al Noor Polyclinic"
  },
  {
    id: "mg-6",
    title: "Inventory Reconciliation Audit",
    type: "audit",
    entityName: "Central Pharmacy",
    location: "Main Distribution Hub",
    date: offset(-2),
    hour: "15:00",
    duration: "2h",
    description: "Weekly audit of free samples issued vs logged doctor detailings.",
    contactPerson: "Warehouse Manager",
    status: "closed",
    staffName: "Logistics Team",
    openingComments: "Audit initiated. Stock levels verified against system logs.",
    closingComments: "Zero discrepancies found. Inventory integrity maintained.",
    requirements: "Increase buffer stock for Amoxicillin 500mg."
  }
];

export const MANAGER_APPOINTMENTS = managerMeetings.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
