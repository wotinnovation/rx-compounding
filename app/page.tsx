"use client";
import { useState } from "react";

const REPS = [
  { id: 1, name: "Priya Nair", initials: "PN", color: "#185FA5", bg: "#E6F1FB", zone: "Deira · Al Nahda", clinics: 22, visits: 5, planned: 7, doctors: 14, totalDocs: 18, status: "on route", pct: 71 },
  { id: 2, name: "Ahmed Mahmoud", initials: "AM", color: "#3B6D11", bg: "#EAF3DE", zone: "Bur Dubai · Karama", clinics: 24, visits: 6, planned: 8, doctors: 14, totalDocs: 22, status: "on route", pct: 75 },
  { id: 3, name: "Sara Khan", initials: "SK", color: "#0F6E56", bg: "#E1F5EE", zone: "Deira", clinics: 20, visits: 7, planned: 7, doctors: 16, totalDocs: 16, status: "complete", pct: 100 },
  { id: 4, name: "Rajesh Verma", initials: "RV", color: "#993C1D", bg: "#FAECE7", zone: "JLT · Marina", clinics: 19, visits: 3, planned: 9, doctors: 7, totalDocs: 18, status: "behind", pct: 33 },
  { id: 5, name: "Fatima Al Zahra", initials: "FZ", color: "#534AB7", bg: "#EEEDFE", zone: "Sharjah", clinics: 19, visits: 5, planned: 6, doctors: 12, totalDocs: 14, status: "on route", pct: 83 },
  { id: 6, name: "Joseph Pereira", initials: "JP", color: "#A32D2D", bg: "#FCEBEB", zone: "Al Quoz", clinics: 16, visits: 1, planned: 5, doctors: 3, totalDocs: 12, status: "no check-in", pct: 20 },
];

const HOSPITALS = [
  { name: "Mediclinic City Hospital", area: "Bur Dubai", type: "new account", doctors: 12, assigned: null, priority: "high" },
  { name: "Al Zahra Medical", area: "Sharjah", type: "existing", doctors: 8, assigned: null, priority: "medium" },
  { name: "NMC Royal Hospital DIP", area: "Al Quoz", type: "existing", doctors: 18, assigned: null, priority: "high" },
  { name: "Aster Clinic Al Quoz", area: "Al Quoz", type: "existing", doctors: 9, assigned: "Joseph Pereira", priority: "medium" },
  { name: "Saudi German Hospital", area: "Al Barsha", type: "new account", doctors: 14, assigned: null, priority: "high" },
];

const ACTIVITY = [
  { rep: "Priya Nair", color: "#185FA5", bg: "#E6F1FB", initials: "PN", action: "completed visit at", place: "Al Noor Polyclinic", detail: "order 8,400 AED", time: "Just now", tag: "Deira", tagType: "success", sub: "3 doctors detailed · 1 follow-up scheduled" },
  { rep: "Ahmed Mahmoud", color: "#3B6D11", bg: "#EAF3DE", initials: "AM", action: "logged remark:", place: "Karama Medical Centre", detail: "Dr. Yusuf will trial new antibiotic line with 5 patients", time: "4 min ago", tag: "positive", tagType: "success", sub: "" },
  { rep: "Rajesh Verma", color: "#993C1D", bg: "#FAECE7", initials: "RV", action: "checked in at", place: "Marina Family Clinic", detail: "2nd visit of 4 planned today", time: "12 min ago", tag: "JLT", tagType: "info", sub: "" },
  { rep: "Priya Nair", color: "#185FA5", bg: "#E6F1FB", initials: "PN", action: "flagged concern:", place: "Karama Medical Centre", detail: "Dr. Fatima needs chain pricing for 3 branches", time: "22 min ago", tag: "needs manager approval", tagType: "warning", sub: "" },
  { rep: "Fatima Al Zahra", color: "#534AB7", bg: "#EEEDFE", initials: "FZ", action: "rescheduled visit at", place: "Carrefour Sharjah", detail: "customer unavailable — moved to 06 May 10:00", time: "35 min ago", tag: "Sharjah", tagType: "neutral", sub: "" },
  { rep: "Sara Khan", color: "#0F6E56", bg: "#E1F5EE", initials: "SK", action: "completed all 7 planned visits", place: "", detail: "day done", time: "48 min ago", tag: "Deira", tagType: "success", sub: "16 doctors detailed · 100% plan achievement" },
  { rep: "Joseph Pereira", color: "#A32D2D", bg: "#FCEBEB", initials: "JP", action: "checked in at", place: "Aster Pharmacy Al Quoz", detail: "30 min late vs plan", time: "1h 15min ago", tag: "Al Quoz", tagType: "danger", sub: "" },
];

const HEATMAP_DAYS = ["Mon 04", "Tue 05", "Wed 06", "Thu 07", "Fri 08", "Sat 09"];
const HEATMAP_DATA = {
  "Priya Nair":       [{ a: 5, p: 7 }, { a: 0, p: 6 }, { a: 0, p: 5 }, { a: 0, p: 8 }, { a: 0, p: 3 }, null],
  "Ahmed Mahmoud":    [{ a: 6, p: 8 }, { a: 0, p: 6 }, { a: 0, p: 5 }, { a: 0, p: 7 }, { a: 0, p: 3 }, null],
  "Sara Khan":        [{ a: 7, p: 7 }, { a: 0, p: 8 }, { a: 0, p: 5 }, { a: 0, p: 5 }, { a: 0, p: 6 }, null],
  "Rajesh Verma":     [{ a: 3, p: 9 }, { a: 0, p: 7 }, { a: 0, p: 8 }, { a: 0, p: 5 }, { a: 0, p: 4 }, null],
  "Fatima Al Zahra":  [{ a: 5, p: 6 }, { a: 0, p: 5 }, { a: 0, p: 7 }, { a: 0, p: 6 }, { a: 0, p: 5 }, null],
  "Joseph Pereira":   [{ a: 1, p: 5 }, { a: 0, p: 5 }, { a: 0, p: 4 }, { a: 0, p: 3 }, { a: 0, p: 3 }, null],
};

const statusStyle = (s) => {
  if (s === "complete") return { color: "#0F6E56", bg: "#E1F5EE", label: "complete" };
  if (s === "behind") return { color: "#993C1D", bg: "#FAECE7", label: "behind" };
  if (s === "no check-in") return { color: "#A32D2D", bg: "#FCEBEB", label: "no check-in" };
  return { color: "#185FA5", bg: "#E6F1FB", label: "on route" };
};

const tagStyle = (t) => {
  if (t === "success") return { color: "#0F6E56", bg: "#E1F5EE" };
  if (t === "warning") return { color: "#854F0B", bg: "#FAEEDA" };
  if (t === "danger") return { color: "#A32D2D", bg: "#FCEBEB" };
  if (t === "info") return { color: "#185FA5", bg: "#E6F1FB" };
  return { color: "#5F5E5A", bg: "#F1EFE8" };
};

const heatColor = (a, p) => {
  if (!p) return "#F1EFE8";
  const r = a / p;
  if (r >= 1) return "#1D9E75";
  if (r >= 0.7) return "#5DCAA5";
  if (r >= 0.4) return "#EF9F27";
  if (a > 0) return "#E24B4A";
  return "#D3D1C7";
};

export default function Dashboard() {
  const [selectedRep, setSelectedRep] = useState(REPS[5]);
  const [view, setView] = useState("manager");
  const [sortBy, setSortBy] = useState("performance");

  const sortedReps = [...REPS].sort((a, b) => {
    if (sortBy === "performance") return b.pct - a.pct;
    if (sortBy === "visits") return b.visits - a.visits;
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", color: "#2C2C2A" }}>
      {/* Top Nav */}
      <header style={{ background: "#fff", borderBottom: "0.5px solid #E0DDD5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "#185FA5", borderRadius: 8 }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "-0.5px" }}>Rx</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2A", lineHeight: 1.2 }}>RxCompounding Pharmacy</div>
            <div style={{ fontSize: 11, color: "#888780" }}>CRM · Field Sales</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["manager", "sales"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", borderRadius: 20, border: "0.5px solid", borderColor: view === v ? "#185FA5" : "#D3D1C7", background: view === v ? "#E6F1FB" : "transparent", color: view === v ? "#185FA5" : "#888780", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
              {v === "manager" ? "⚙ Sales Manager" : "👤 Sales Executive"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#888780" }}>🔔</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>RM</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Riyad M R</div>
              <div style={{ fontSize: 10, color: "#888780" }}>Sales Manager</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ padding: "24px 24px 40px", maxWidth: 1340, margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Team Dashboard</h1>
            <p style={{ fontSize: 12, color: "#888780", margin: "3px 0 0" }}>Monday, 04 May 2026 · 8 active reps · UAE field operations</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[["All sales executives (6)", "👥"], ["All territories", "📍"], ["Today", "📅"]].map(([label, icon]) => (
              <button key={label} style={{ padding: "7px 12px", background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 8, fontSize: 12, color: "#5F5E5A", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <span>{icon}</span>{label} ▾
              </button>
            ))}
            <button style={{ padding: "7px 14px", background: "#185FA5", border: "none", borderRadius: 8, fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 600 }}>+ Assign clinics</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Active reps", value: "8 / 10", sub: "2 on leave", icon: "👥", accent: "#185FA5", accentBg: "#E6F1FB" },
            { label: "Visits today", value: "42 / 56", sub: "↑ 75% plan achievement", icon: "📍", accent: "#0F6E56", accentBg: "#E1F5EE" },
            { label: "Doctors detailed", value: "94", sub: "+12 vs yesterday", icon: "🏥", accent: "#534AB7", accentBg: "#EEEDFE" },
            { label: "Follow-ups due", value: "14", sub: "5 overdue", icon: "⏰", accent: "#854F0B", accentBg: "#FAEEDA", warn: true },
            { label: "Unassigned clinics", value: "6", sub: "Needs assignment", icon: "⚠", accent: "#A32D2D", accentBg: "#FCEBEB", danger: true },
          ].map(k => (
            <div key={k.label} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "0.5px solid #E0DDD5" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#888780", fontWeight: 500 }}>{k.label}</span>
                <span style={{ fontSize: 16 }}>{k.icon}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: k.danger ? "#A32D2D" : k.warn ? "#854F0B" : "#2C2C2A", lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 11, marginTop: 4, color: k.danger ? "#A32D2D" : k.warn ? "#854F0B" : "#0F6E56", fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
          {/* Sales Team Table */}
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #E0DDD5", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid #E0DDD5" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Sales team — today's progress</div>
                <div style={{ fontSize: 11, color: "#888780" }}>Click any rep to see their visits and remarks</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["performance", "visits", "name"].map(s => (
                  <button key={s} onClick={() => setSortBy(s)} style={{ padding: "4px 10px", borderRadius: 6, border: "0.5px solid", borderColor: sortBy === s ? "#185FA5" : "#D3D1C7", background: sortBy === s ? "#E6F1FB" : "transparent", color: sortBy === s ? "#185FA5" : "#888780", fontSize: 11, cursor: "pointer", textTransform: "capitalize" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              {sortedReps.map((rep, i) => {
                const st = statusStyle(rep.status);
                const isSelected = selectedRep?.id === rep.id;
                return (
                  <div key={rep.id} onClick={() => setSelectedRep(rep)} style={{ padding: "12px 18px", display: "grid", gridTemplateColumns: "200px 1fr 80px 100px 90px", alignItems: "center", gap: 12, cursor: "pointer", background: isSelected ? "#F0F6FF" : i % 2 === 0 ? "#fff" : "#FAFAF8", borderBottom: "0.5px solid #E0DDD5", transition: "background 0.1s", borderLeft: isSelected ? "3px solid #185FA5" : "3px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: rep.bg, display: "flex", alignItems: "center", justifyContent: "center", color: rep.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{rep.initials}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{rep.name}</div>
                        <div style={{ fontSize: 11, color: "#888780" }}>{rep.zone} · {rep.clinics} clinics</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: "#888780" }}>Plan achievement</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: rep.pct >= 80 ? "#0F6E56" : rep.pct >= 50 ? "#854F0B" : "#A32D2D" }}>{rep.pct}%</span>
                      </div>
                      <div style={{ height: 5, background: "#E0DDD5", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${rep.pct}%`, height: "100%", background: rep.pct >= 80 ? "#1D9E75" : rep.pct >= 50 ? "#EF9F27" : "#E24B4A", borderRadius: 3, transition: "width 0.4s" }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{rep.visits}/{rep.planned}</div>
                      <div style={{ fontSize: 10, color: "#888780" }}>visits</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{rep.doctors}/{rep.totalDocs}</div>
                      <div style={{ fontSize: 10, color: "#888780" }}>doctors</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rep Detail Panel */}
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #E0DDD5", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedRep.name}</div>
                <div style={{ fontSize: 11, color: "#888780" }}>Al Quoz · {selectedRep.clinics} clinics assigned</div>
              </div>
              <button style={{ fontSize: 11, color: "#185FA5", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View as field rep ↗</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#F7F6F2", borderRadius: 8, padding: "12px" }}>
                <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>Visits planned</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{selectedRep.planned}</div>
              </div>
              <div style={{ background: "#F7F6F2", borderRadius: 8, padding: "12px" }}>
                <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>Visits completed</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{selectedRep.visits}</div>
                <div style={{ fontSize: 11, color: "#A32D2D", fontWeight: 500 }}>{selectedRep.pct}% achieved</div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#888780" }}>Doctor coverage</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{selectedRep.doctors} / {selectedRep.totalDocs}</span>
              </div>
              <div style={{ height: 6, background: "#E0DDD5", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(selectedRep.doctors / selectedRep.totalDocs) * 100}%`, height: "100%", background: "#185FA5", borderRadius: 3 }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: "0.02em", color: "#888780", textTransform: "uppercase", fontSize: 10 }}>Recent doctor remarks</div>
              <div style={{ background: "#F7F6F2", borderRadius: 8, padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Dr. Ravi Menon</div>
                    <div style={{ fontSize: 11, color: "#888780" }}>GP · Aster Al Quoz</div>
                  </div>
                  <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, background: "#F1EFE8", color: "#5F5E5A" }}>neutral</span>
                </div>
                <p style={{ fontSize: 12, color: "#5F5E5A", margin: "6px 0 8px", lineHeight: 1.5 }}>Brief encounter only. Will discuss in detail next visit.</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#185FA5", background: "#E6F1FB", padding: "2px 8px", borderRadius: 4 }}>🔁 Re-visit 06 May</span>
                </div>
              </div>
            </div>
            <button style={{ width: "100%", padding: "8px", background: "none", border: "0.5px solid #D3D1C7", borderRadius: 8, fontSize: 12, color: "#5F5E5A", cursor: "pointer" }}>View full activity log →</button>
          </div>
        </div>

        {/* Bottom Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
          {/* Live Activity Feed */}
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #E0DDD5", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #E0DDD5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Live activity feed</div>
                <div style={{ fontSize: 11, color: "#888780" }}>Real-time updates from the field · all reps</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, color: "#0F6E56", fontWeight: 600 }}>Live</span>
              </div>
            </div>
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {ACTIVITY.map((a, i) => {
                const ts = tagStyle(a.tagType);
                return (
                  <div key={i} style={{ padding: "12px 18px", borderBottom: "0.5px solid #E0DDD5", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", color: a.color, fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{a.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600 }}>{a.rep}</span>
                        {" "}<span style={{ color: "#5F5E5A" }}>{a.action}</span>
                        {a.place && <span style={{ fontWeight: 500 }}> {a.place}</span>}
                        {a.detail && <span style={{ color: "#5F5E5A" }}> · {a.detail}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: "#888780" }}>{a.time}</span>
                        <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 500, background: ts.bg, color: ts.color }}>{a.tag}</span>
                      </div>
                      {a.sub && <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>{a.sub}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Assignment */}
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #E0DDD5", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #E0DDD5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Customer assignment</div>
                <div style={{ fontSize: 11, color: "#888780" }}>6 unassigned clinics</div>
              </div>
              <button style={{ padding: "5px 12px", background: "#F7F6F2", border: "0.5px solid #D3D1C7", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Bulk assign</button>
            </div>
            <div style={{ padding: "10px" }}>
              {HOSPITALS.map((h, i) => (
                <div key={i} style={{ background: "#F7F6F2", borderRadius: 8, padding: "12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: "#888780" }}>{h.area} · {h.doctors} doctors · {h.type}</div>
                    </div>
                    {!h.assigned && (
                      <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "#FCEBEB", color: "#A32D2D" }}>unassigned</span>
                    )}
                  </div>
                  <select style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "0.5px solid #D3D1C7", background: "#fff", fontSize: 11, color: h.assigned ? "#2C2C2A" : "#888780", cursor: "pointer" }}>
                    <option>{h.assigned || "Assign to rep..."}</option>
                    {REPS.map(r => <option key={r.id}>{r.name}</option>)}
                  </select>
                </div>
              ))}
              <button style={{ width: "100%", padding: "8px", background: "none", border: "0.5px solid #D3D1C7", borderRadius: 8, fontSize: 12, color: "#185FA5", cursor: "pointer" }}>View all 6 unassigned →</button>
            </div>
          </div>
        </div>

        {/* Visit Heatmap */}
        <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #E0DDD5", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #E0DDD5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Visit heatmap — this week</div>
              <div style={{ fontSize: 11, color: "#888780" }}>Planned vs actual visits per rep, per day · click cell for detail</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[["0–4", "#D3D1C7"], ["5–6", "#5DCAA5"], ["7–8", "#1D9E75"], ["9+", "#0F6E56"]].map(([label, c]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: 10, color: "#888780" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 18px", textAlign: "left", fontSize: 11, color: "#888780", fontWeight: 500, width: 130 }}></th>
                  {HEATMAP_DAYS.map(d => (
                    <th key={d} style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, color: "#888780", fontWeight: 500 }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REPS.map((rep) => (
                  <tr key={rep.id}>
                    <td style={{ padding: "8px 18px", fontSize: 12, fontWeight: 500 }}>{rep.name}</td>
                    {HEATMAP_DATA[rep.name].map((cell, j) => (
                      <td key={j} style={{ padding: "4px 6px", textAlign: "center" }}>
                        {cell ? (
                          <div title={`${cell.a}/${cell.p} visits`} style={{ background: heatColor(cell.a, cell.p), borderRadius: 6, padding: "7px 4px", fontSize: 11, fontWeight: 700, color: "#2C2C2A", cursor: "pointer" }}>
                            {cell.a > 0 ? `${cell.a}/${cell.p}` : `—/${cell.p}`}
                          </div>
                        ) : (
                          <div style={{ background: "#F1EFE8", borderRadius: 6, padding: "7px 4px", fontSize: 11, color: "#B4B2A9" }}>—</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 18px", borderTop: "0.5px solid #E0DDD5" }}>
            <span style={{ fontSize: 11, color: "#888780" }}>Format: <strong>actual</strong>/planned visits</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        button:hover { opacity: 0.85; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #F7F6F2; }
        ::-webkit-scrollbar-thumb { background: #D3D1C7; border-radius: 2px; }
      `}</style>
    </div>
  );
}