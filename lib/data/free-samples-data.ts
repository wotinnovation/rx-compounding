export interface FreeSample {
  id: string;
  staffName: string;
  medicineName: string;
  hospitalName: string;
  doctorName: string;
  quantity: number;
  date: string;
  status: "delivered" | "pending";
}

export const FREE_SAMPLES_DATA: FreeSample[] = [
  {
    id: "fs-1",
    staffName: "Muna Al Falasi",
    medicineName: "Amoxicillin 500mg",
    hospitalName: "Bur Dubai Hospital",
    doctorName: "Dr. Ahmed Mahmoud",
    quantity: 10,
    date: "2026-05-12",
    status: "delivered"
  },
  {
    id: "fs-2",
    staffName: "Muna Al Falasi",
    medicineName: "Lipitor 20mg",
    hospitalName: "Al Mankhool Medical Centre",
    doctorName: "Dr. Sarah Khan",
    quantity: 5,
    date: "2026-05-13",
    status: "delivered"
  },
  {
    id: "fs-3",
    staffName: "Abdulla bin Rashid",
    medicineName: "Ventolin Inhaler",
    hospitalName: "City Heart Hospital",
    doctorName: "Dr. Ravi Nair",
    quantity: 20,
    date: "2026-05-11",
    status: "delivered"
  },
  {
    id: "fs-4",
    staffName: "Faisal Al Marzouqi",
    medicineName: "Augmentin 625mg",
    hospitalName: "Jumeirah Family Clinic",
    doctorName: "Dr. John Smith",
    quantity: 15,
    date: "2026-05-12",
    status: "delivered"
  },
  {
    id: "fs-5",
    staffName: "Omar Al Mansoori",
    medicineName: "Metformin 500mg",
    hospitalName: "Dubai Hills Specialized Hospital",
    doctorName: "Dr. Fatima Menon",
    quantity: 30,
    date: "2026-05-10",
    status: "delivered"
  },
  {
    id: "fs-6",
    staffName: "Muna Al Falasi",
    medicineName: "Augmentin 625mg",
    hospitalName: "Deira Specialized Clinic",
    doctorName: "Dr. Khalid Hassan",
    quantity: 8,
    date: "2026-05-13",
    status: "delivered"
  },
  {
    id: "fs-7",
    staffName: "Abdulla bin Rashid",
    medicineName: "Lipitor 20mg",
    hospitalName: "Karama Medical Hub",
    doctorName: "Dr. Maryam Saif",
    quantity: 12,
    date: "2026-05-12",
    status: "delivered"
  }
];
