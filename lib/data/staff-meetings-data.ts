import type { Appointment } from "@/lib/context/data-context";

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const offset = (n: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + n);
  return fmt(d);
};

// Realistic Medical Sales Activities
const hospitalNames = [
  "City Heart Hospital", "Green Valley Clinic", "Central Medical Hub", 
  "Eastside Medical", "Marina Specialised Clinic", "Sharjah Medical Center", 
  "Al Mankhool Medical Centre", "Dubai Hills Specialized", "Silicon Oasis Polyclinic"
];

const doctorNames = [
  "Dr. Ahmed Al Hammadi", "Dr. Sarah Al Hashmi", "Dr. Sultan Al Qasimi", 
  "Dr. Fatima Al Mazrouei", "Dr. Khalifa Al Suwaidi", "Dr. Mariam Al Falasi",
  "Dr. Zayed Al Mansoori", "Dr. Reem Al Hashmi", "Dr. Humaid Al Qutami"
];

const patientNames = [
  "Zaid bin Ahmed", "Fatima bint Ali", "Yousuf Al Sayed", "Amna Al Maktoum", 
  "Omar Al Jaber", "Noora Al Suwaidi", "Ali Al Marzouqi", "Maryam Al Falasi"
];

const staffNames = [
  "Faisal Al Marzouqi", "Abdulla bin Rashid", "Muna Al Falasi", "Saeed Al Tayer", "Ayesha Al Suwaidi", "Omar Al Mansoori"
];

const meetingTitles = [
  "Post-Op Inventory Audit",
  "Compound Formula Review",
  "Antibiotic Efficacy Briefing",
  "New Patient Onboarding Sync",
  "Quarterly Performance Review",
  "Clinical Detailing Session",
  "Emergency Sample Drop-off",
  "Requirement Gathering – Zone A",
  "Territory Strategy Workshop",
  "Compliance & Ethics Sync"
];

const descriptions = [
  "Verify stock levels for Amoxicillin and Lipitor following the surge in outpatient visits.",
  "Review custom compound requirements for geriatric patients with persistent hypertension.",
  "Briefing the clinical team on the new delivery protocols for temperature-sensitive biologics.",
  "Comprehensive audit of the patient management system for Zone B hospitals.",
  "Strategic alignment meeting with the regional manager regarding Q3 sales targets.",
  "Detailed product briefing for the dermatology department regarding new topical agents.",
  "Emergency delivery of free samples and verification of prescription workflows.",
  "Onboarding review for high-priority chronic condition patients in the Bur Dubai area.",
  "Analyzing competitor market share in the Jumeirah medical corridor.",
  "Monthly reconciliation of free medicine distribution and sample inventory."
];

const meetings: Appointment[] = [];

// ── Today's Scheduled Activities ───────────────────────────────────────────
for (let i = 1; i <= 6; i++) {
  const hospital = hospitalNames[i % hospitalNames.length];
  const doctor = doctorNames[i % doctorNames.length];
  const patient = patientNames[i % patientNames.length];
  const staff = staffNames[i % staffNames.length];
  
  meetings.push({
    id: `sm-today-${i}`,
    title: meetingTitles[i % meetingTitles.length],
    type: i % 3 === 0 ? "audit" : i % 2 === 0 ? "meeting" : "medical",
    entityName: i % 2 === 0 ? hospital : doctor,
    hospitalName: hospital,
    doctorName: doctor,
    patientName: patient,
    staffName: staff,
    location: hospital,
    date: offset(0),
    hour: `${9 + i}:00`,
    duration: "1h",
    description: descriptions[i % descriptions.length],
    contactPerson: doctor,
    status: "scheduled",
  });
}

// ── Historical Data (Last 20 records) ─────────────────────────────────────────
const pastStatuses: Appointment["status"][] = ["visited", "completed", "closed", "cancelled"];
for (let i = 1; i <= 20; i++) {
  const hospital = hospitalNames[(i + 2) % hospitalNames.length];
  const doctor = doctorNames[(i + 4) % doctorNames.length];
  const patient = patientNames[(i + 6) % patientNames.length];
  const staff = staffNames[(i + 1) % staffNames.length];
  
  meetings.push({
    id: `sm-past-${i}`,
    title: meetingTitles[(i + 5) % meetingTitles.length],
    type: i % 3 === 0 ? "audit" : i % 2 === 0 ? "meeting" : "medical",
    entityName: i % 2 === 0 ? hospital : doctor,
    hospitalName: hospital,
    doctorName: doctor,
    patientName: patient,
    staffName: staff,
    location: hospital,
    date: offset(-Math.ceil(i/2)),
    hour: `${8 + (i % 9)}:30`,
    duration: "1.5h",
    description: descriptions[(i + 3) % descriptions.length],
    contactPerson: doctor,
    status: pastStatuses[i % 4],
    // Mock Outcome Data for Manager Detail View
    openingComments: "Representative arrived on site. Clinical team prepared.",
    closingComments: "Audit completed successfully. Minor stock discrepancies noted.",
    requirements: "Need 200 units of Amoxicillin by next Tuesday.",
    order: i % 4 === 0 ? { medicineId: "m1", qty: 50, total: 2250 } : undefined
  });
}

// ── Future Itinerary (Next 15 records) ────────────────────────────────────────
const futureStatuses: Appointment["status"][] = ["scheduled", "upcoming"];
for (let i = 1; i <= 15; i++) {
  const hospital = hospitalNames[(i + 1) % hospitalNames.length];
  const doctor = doctorNames[(i + 3) % doctorNames.length];
  const patient = patientNames[(i + 5) % patientNames.length];
  const staff = staffNames[(i + 2) % staffNames.length];

  meetings.push({
    id: `sm-future-${i}`,
    title: meetingTitles[(i + 2) % meetingTitles.length],
    type: i % 3 === 0 ? "audit" : i % 2 === 0 ? "meeting" : "medical",
    entityName: i % 2 === 0 ? hospital : doctor,
    hospitalName: hospital,
    doctorName: doctor,
    patientName: patient,
    staffName: staff,
    location: hospital,
    date: offset(Math.ceil(i/2)),
    hour: `${9 + (i % 8)}:00`,
    duration: "1h",
    description: descriptions[(i + 1) % descriptions.length],
    contactPerson: doctor,
    status: futureStatuses[i % 2],
  });
}

export const STAFF_MEETINGS = meetings.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const STAFF_UPCOMING = meetings
  .filter(m => m.status === "upcoming" || (m.status === "scheduled" && m.date > offset(0)))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
