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
  "Monthly reconciliation of samples and gifts distribution and sample inventory."
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
    orders: i % 4 === 0 ? [{ medicineId: "m1", qty: 50, total: 2250 }] : []
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

meetings.push({
  id: "today-extra-1",
  title: "Urgent Clinic Audit — Al Zahra",
  type: "audit",
  entityName: "Al Zahra Hospital",
  hospitalName: "Al Zahra Hospital",
  doctorName: "Dr. Laila Yousif",
  staffName: "Ayesha Al Suwaidi",
  contactPerson: "Dr. Laila Yousif",
  location: "Al Barsha",
  date: offset(0),
  hour: "14:00",
  duration: "1h",
  description: "Routine check of compounding medicine stocks and emergency requirements.",
  status: "scheduled"
});

meetings.push({
  id: "today-extra-2",
  title: "New Product Detailing — Mediclinic",
  type: "medical",
  entityName: "Mediclinic Dubai Mall",
  hospitalName: "Mediclinic Dubai Mall",
  doctorName: "Dr. Robert Smith",
  staffName: "Faisal Al Marzouqi",
  contactPerson: "Dr. Robert Smith",
  location: "Dubai Mall",
  date: offset(0),
  hour: "16:30",
  duration: "1h",
  description: "Presenting the new RX Compounding range for post-surgical recovery.",
  status: "upcoming"
});

meetings.push({
  id: "today-extra-3",
  title: "Emergency Sample Delivery — Bur Dubai",
  type: "medical",
  entityName: "Bur Dubai Specialized Clinic",
  hospitalName: "Bur Dubai Specialized Clinic",
  doctorName: "Dr. Ahmed Al Hammadi",
  staffName: "Abdulla bin Rashid",
  contactPerson: "Dr. Ahmed Al Hammadi",
  location: "Bur Dubai",
  date: offset(0),
  hour: "18:00",
  duration: "30m",
  description: "Handing over urgent samples for a critical patient case.",
  status: "scheduled"
});

// ── Dense May Data (Robust Density for Manager View) ─────────────────────
for (let i = 1; i <= 60; i++) {
  const hospital = hospitalNames[(i + 3) % hospitalNames.length];
  const doctor = doctorNames[(i + 5) % doctorNames.length];
  const patient = patientNames[(i + 7) % patientNames.length];
  const staff = staffNames[i % staffNames.length];
  
  // Distribute across -15 to +15 days from today
  const dayOffset = (i % 31) - 15; 
  
  meetings.push({
    id: `sm-may-dense-${i}`,
    title: meetingTitles[(i + 1) % meetingTitles.length],
    type: i % 4 === 0 ? "audit" : i % 3 === 0 ? "meeting" : "medical",
    entityName: i % 2 === 0 ? hospital : doctor,
    hospitalName: hospital,
    doctorName: doctor,
    patientName: patient,
    staffName: staff,
    location: hospital,
    date: offset(dayOffset),
    hour: `${8 + (i % 10)}:00`,
    duration: i % 2 === 0 ? "1h" : "45m",
    description: descriptions[i % descriptions.length],
    contactPerson: doctor,
    status: ["scheduled", "visited", "pending_approval", "completed", "cancelled"][i % 5] as any,
    openingComments: dayOffset < 0 ? "Routine clinical discussion started." : undefined,
    closingComments: dayOffset < 0 ? "Confirmed product availability. Logged required follow-ups." : undefined,
  });
}

// ── Concentrated Data for Faisal Al Marzouqi ─────────────────────────────
for (let i = 1; i <= 30; i++) {
  const hospital = hospitalNames[(i + 2) % hospitalNames.length];
  const doctor = doctorNames[(i + 4) % doctorNames.length];
  const patient = patientNames[(i + 6) % patientNames.length];
  
  // Concentrated within the last 10 days and next 2 days
  const dayOffset = (i % 12) - 10; 
  
  meetings.push({
    id: `sm-faisal-dense-${i}`,
    title: meetingTitles[(i + 3) % meetingTitles.length],
    type: i % 2 === 0 ? "medical" : "audit",
    entityName: i % 2 === 0 ? hospital : doctor,
    hospitalName: hospital,
    doctorName: doctor,
    patientName: patient,
    staffName: "Faisal Al Marzouqi",
    location: hospital,
    date: offset(dayOffset),
    hour: `${8 + (i % 9)}:30`,
    duration: "1h",
    description: descriptions[(i + 2) % descriptions.length],
    contactPerson: doctor,
    status: ["scheduled", "visited", "pending_approval", "completed", "cancelled"][i % 5] as any,
    openingComments: dayOffset < 0 ? "Faisal arrived on site. High engagement." : undefined,
    closingComments: dayOffset < 0 ? "Successfully pushed new inventory line. Follow-up required." : undefined,
    requirements: dayOffset < 0 && i % 3 === 0 ? "Urgent need for 500 units of custom compounded pediatric suspension." : undefined,
    customCompound: dayOffset < 0 && i % 4 === 0 ? "Omeprazole 2mg/mL Oral Suspension, 100mL bottles." : undefined,
    freeSamples: dayOffset < 0 && i % 2 === 0 ? [
      { medicineId: `m${(i % 5) + 1}`, qty: 10 + (i % 20), approved: true },
      { medicineId: `m${((i + 1) % 5) + 1}`, qty: 5 + (i % 10), approved: i % 4 !== 0 }
    ] : undefined,
    orders: dayOffset < 0 && i % 3 === 0 ? [
      { medicineId: `m${(i % 5) + 1}`, qty: 100 * (i % 5 + 1), total: 4500 * (i % 3 + 1) }
    ] : undefined,
    managerComment: dayOffset < 0 && i % 5 === 0 ? "Great job locking in this engagement. Ensure samples are replenished." : undefined
  });
}

// ── Upcoming Week Density Surge ──────────────────────────────────────────
for (let i = 1; i <= 40; i++) {
  const hospital = hospitalNames[(i + 5) % hospitalNames.length];
  const doctor = doctorNames[(i + 1) % doctorNames.length];
  const patient = patientNames[(i + 3) % patientNames.length];
  const staff = staffNames[i % staffNames.length];
  
  // Strictly target the next 1 to 10 days
  const dayOffset = (i % 10) + 1; 
  
  meetings.push({
    id: `sm-future-surge-${i}`,
    title: meetingTitles[(i + 4) % meetingTitles.length],
    type: i % 2 === 0 ? "meeting" : "medical",
    entityName: i % 2 === 0 ? hospital : doctor,
    hospitalName: hospital,
    doctorName: doctor,
    patientName: patient,
    staffName: staff,
    location: hospital,
    date: offset(dayOffset),
    hour: `${8 + (i % 10)}:00`,
    duration: "1h",
    description: descriptions[(i + 5) % descriptions.length],
    contactPerson: doctor,
    status: i % 4 === 0 ? "upcoming" : "scheduled",
  });
}

export const STAFF_MEETINGS = meetings.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const STAFF_UPCOMING = meetings
  .filter(m => m.status === "upcoming" || (m.status === "scheduled" && m.date > offset(0)))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
