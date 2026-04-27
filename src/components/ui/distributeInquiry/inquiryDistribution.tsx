import { ThemeContext } from "@/src/contexts";
import { useSalesPerson } from "@/src/hooks/salesPerson/useSalesPerson";
import { useState, useMemo, useContext, useEffect } from "react";
import { Modal } from "../modal";
import ShareInquiry from "./shareInquiry/shareInquiry";
import Swal from "sweetalert2";
import { SalesPerson } from "@/src/types/users";
import { ShareInquiryPerson, UISalesPerson } from "./shareInquiry/types";
import SectionLoader from "../loader/sectionLoader";
import CommonLoader from "../loader/loader";
import { mapToShareInquiryPerson } from "./shareInquiry/helpers";
import { Button } from "../button";

// keep your types + dummy data + helpers SAME
// ── Types ──────────────────────────────────────────────────────────────────────
interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  text: string;
  textSec: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentText: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarActive: string;
  sidebarActiveBg: string;
  chartGrid: string;
  tooltipBg: string;
  sidebarBorder: string;
  sidebarHeading: string;
  sidebarHover: string;
}

interface SalesSummaryRow {
  id: string;
  label: string;
  thisMonth: number;
  lastMonth: number;
  delta: number;
  format: "currency" | "number" | "percent";
}
interface InquiryDistributorProps {
  t: ThemeTokens;
  defaultPersons?: SalesPerson[];
  onShare?: (person: SalesPerson) => void;
  month?: string;
}

const COLORS = [
  "#4F7DF3",
  "#34D399",
  "#FB923C",
  "#F87171",
  "#A78BFA",
  "#F472B6",
  "#38BDF8",
  "#FBBF24",
];

export const getAvatarColor = (index: number) => COLORS[index % COLORS.length];
// ── Dummy Data ─────────────────────────────────────────────────────────────────
// const DUMMY_PERSONS: SalesPerson[] = [
//   {
//     id: "1",
//     name: "Arjun Mehta",
//     email: "arjun@acme.in",
//     mobile: "9876543210",
//     role: "Senior Sales",
//     initials: "AM",
//     avatarColor: "#4F7DF3",
//   },
//   {
//     id: "2",
//     name: "Priya Sharma",
//     email: "priya@acme.in",
//     mobile: "9765432109",
//     role: "Sales Lead",
//     initials: "PS",
//     avatarColor: "#34D399",
//   },
//   {
//     id: "3",
//     name: "Rohan Das",
//     email: "rohan@acme.in",
//     mobile: "9654321098",
//     role: "Sales Exec",
//     initials: "RD",
//     avatarColor: "#FB923C",
//   },
//   {
//     id: "4",
//     name: "Sneha Kapoor",
//     email: "sneha@acme.in",
//     mobile: "9543210987",
//     role: "Sales Exec",
//     initials: "SK",
//     avatarColor: "#F87171",
//   },
//   {
//     id: "5",
//     name: "Vikram Nair",
//     email: "vikram@acme.in",
//     mobile: "9432109876",
//     role: "Sales Lead",
//     initials: "VN",
//     avatarColor: "#A78BFA",
//   },
//   {
//     id: "6",
//     name: "Nisha Tiwari",
//     email: "nisha@acme.in",
//     mobile: "9321098765",
//     role: "Sr. Sales",
//     initials: "NT",
//     avatarColor: "#F472B6",
//   },
//   {
//     id: "7",
//     name: "Karan Joshi",
//     email: "karan@acme.in",
//     mobile: "9210987654",
//     role: "Sales Exec",
//     initials: "KJ",
//     avatarColor: "#38BDF8",
//   },
//   {
//     id: "8",
//     name: "Meera Pillai",
//     email: "meera@acme.in",
//     mobile: "9109876543",
//     role: "Sales Lead",
//     initials: "MP",
//     avatarColor: "#FBBF24",
//   },
// ];
// Seeded per-person summary rows so each person shows different numbers
function generateRows(personId: string): SalesSummaryRow[] {
  const seed = parseInt(personId, 10);
  const rand = (base: number, variance: number) =>
    Math.round(base + ((seed * 7) % variance) - variance / 2);
  return [
    {
      id: "1",
      label: "Total Inquiries Assigned",
      thisMonth: rand(48, 20),
      lastMonth: rand(41, 18),
      delta: rand(15, 20),
      format: "number",
    },
    {
      id: "2",
      label: "Inquiries Closed (Won)",
      thisMonth: rand(18, 10),
      lastMonth: rand(14, 8),
      delta: rand(22, 30),
      format: "number",
    },
    {
      id: "3",
      label: "Inquiries Lost",
      thisMonth: rand(5, 6),
      lastMonth: rand(8, 6),
      delta: rand(-20, 30),
      format: "number",
    },
    {
      id: "4",
      label: "Revenue Generated",
      thisMonth: rand(1420000, 400000),
      lastMonth: rand(1180000, 300000),
      delta: rand(18, 15),
      format: "currency",
    },
    {
      id: "5",
      label: "Avg. Deal Size",
      thisMonth: rand(78000, 20000),
      lastMonth: rand(84000, 15000),
      delta: rand(-5, 12),
      format: "currency",
    },
    {
      id: "6",
      label: "Conversion Rate",
      thisMonth: rand(37, 12),
      lastMonth: rand(34, 10),
      delta: rand(3, 8),
      format: "percent",
    },
    {
      id: "7",
      label: "Follow-up Calls Made",
      thisMonth: rand(134, 40),
      lastMonth: rand(119, 35),
      delta: rand(12, 15),
      format: "number",
    },
    {
      id: "8",
      label: "Pending Inquiries",
      thisMonth: rand(25, 10),
      lastMonth: rand(19, 8),
      delta: rand(25, 20),
      format: "number",
    },
  ];
} // ── Helpers ────────────────────────────────────────────────────────────────────
function formatVal(val: number, format: string): string {
  switch (format) {
    case "currency":
      return `₹${val.toLocaleString("en-IN")}`;
    case "percent":
      return `${val}%`;
    default:
      return val.toLocaleString("en-IN");
  }
}

function Avatar({ person, selected, onClick, t }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-transform hover:-translate-y-[2px]"
      title={`${person.name} · ${person.role}\n${person.email}`}
    >
      <div
        className="relative w-18 h-18 rounded-full flex items-center justify-center font-bold text-[20px] transition-all"
        style={{
          background: selected
            ? `linear-gradient(135deg, ${person.avatarColor}cc, ${person.avatarColor})`
            : `${person.avatarColor}20`,
          border: selected
            ? `2.5px solid ${person.avatarColor}`
            : `2px solid ${t.border}`,
          color: selected ? "#fff" : person.avatarColor,
          boxShadow: selected ? `0 0 0 3px ${person.avatarColor}33` : "none",
        }}
      >
        {person.initials}

        {selected && (
          <span
            className="absolute -bottom-[2px] -right-[2px] w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white"
            style={{
              background: person.avatarColor,
              border: `2px solid ${t.surface}`,
            }}
          >
            ✓
          </span>
        )}
      </div>

      <span
        className={`text-[10px] max-w-[62px] truncate text-center ${
          selected ? "font-semibold" : "font-normal"
        }`}
        style={{ color: selected ? t.text : t.textMuted }}
      >
        {person.name.split(" ")[0]}
      </span>
    </button>
  );
}

function DeltaBadge({ delta, t }: any) {
  const up = delta >= 0;

  return (
    <span
      className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-[2px] rounded-full"
      style={{
        background: up ? t.successLight : t.dangerLight,
        color: up ? t.success : t.danger,
      }}
    >
      {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

// function SummaryPanel({ person, t, month }: any) {
//   const rows = useMemo(() => generateRows(person.id), [person.id]);

//   return (
//     <div className="border-t border-border animate-[slideDown_0.2s_ease]">
//       {/* header */}
//       <div
//         className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border"
//         style={{ background: t.surfaceElevated }}
//       >
//         <div
//           className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
//           style={{
//             background: `${person.avatarColor}20`,
//             border: `1.5px solid ${person.avatarColor}`,
//             color: person.avatarColor,
//           }}
//         >
//           {person.initials}
//         </div>

//         <span className="text-[13px] font-semibold" style={{ color: t.text }}>
//           {person.name}
//         </span>

//         <span className="text-xs" style={{ color: t.textMuted }}>
//           · {person.role}
//         </span>

//         <span
//           className="ml-auto text-[11px] font-semibold px-2.5 py-[2px] rounded-full"
//           style={{
//             background: t.accentLight,
//             color: t.accentText,
//           }}
//         >
//           {month}
//         </span>
//       </div>

//       {/* table header */}
//       <div className="grid grid-cols-[1fr_130px_130px_90px] px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wide">
//         {["Metric", "This Month", "Last Month", "Change"].map((col, i) => (
//           <span
//             key={col}
//             className={i === 0 ? "text-left" : "text-right"}
//             style={{ color: t.textMuted }}
//           >
//             {col}
//           </span>
//         ))}
//       </div>

//       {/* rows */}
//       {rows.map((row: any, idx: number) => (
//         <div
//           key={row.id}
//           className="grid grid-cols-[1fr_130px_130px_90px] px-4 py-2 items-center transition-colors"
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.background = t.accentLight)
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.background = "transparent")
//           }
//         >
//           <span className="text-sm font-medium">{row.label}</span>

//           <span className="text-sm font-semibold text-right">
//             {formatVal(row.thisMonth, row.format)}
//           </span>

//           <span className="text-sm text-right" style={{ color: t.textSec }}>
//             {formatVal(row.lastMonth, row.format)}
//           </span>

//           <div className="flex justify-end">
//             <DeltaBadge delta={row.delta} t={t} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

function SummaryPanel({ person, t, month }: any) {
  const inq = person.inquiries ?? {};
  const att = person.attendance ?? {};

  const convRate = parseFloat(inq.conversionRate ?? "0");
  const closeRate = parseFloat(inq.closeRate ?? "0");

  const barColor = (pct: number) =>
    pct >= 50 ? t.success : pct >= 20 ? t.warning : t.accent;

  return (
    <div style={{ borderTop: `0.5px solid ${t.border}` }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: `0.5px solid ${t.border}`,
          background: t.surfaceElevated,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
            flexShrink: 0,
            background: `${person.avatarColor}20`,
            border: `1.5px solid ${person.avatarColor}`,
            color: person.avatarColor,
          }}
        >
          {person.initials}
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>
            {person.name}
          </div>
          <div style={{ fontSize: 12, color: t.textMuted }}>
            {person.role ?? "Sales"}
          </div>
        </div>

        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 10px",
            borderRadius: 6,
            background: t.accentLight,
            color: t.accentText,
          }}
        >
          {month}
        </span>
      </div>

      {/* ── Inquiries grid ── */}
      <SectionLabel label="Inquiries" t={t} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          padding: "0 16px 12px",
        }}
      >
        {[
          { label: "Total", value: inq.total ?? 0, color: t.text },
          { label: "Assigned", value: inq.assigned ?? 0, color: t.accent },
          {
            label: "In Progress",
            value: inq.inProgress ?? 0,
            color: t.warning,
          },
          { label: "Follow Up", value: inq.followUp ?? 0, color: t.text },
          { label: "Closed", value: inq.closed ?? 0, color: t.textSec },
          { label: "Converted", value: inq.converted ?? 0, color: t.success },
        ].map(({ label, value, color }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            color={color}
            t={t}
          />
        ))}
      </div>

      {/* ── Performance bars ── */}
      <Divider t={t} />
      <SectionLabel label="Performance" t={t} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
          padding: "0 16px 12px",
        }}
      >
        <RateBar
          label="Conversion rate"
          pct={convRate}
          color={barColor(convRate)}
          t={t}
        />
        <RateBar
          label="Close rate"
          pct={closeRate}
          color={barColor(closeRate)}
          t={t}
        />
      </div>

      {/* ── Attendance ── */}
      <Divider t={t} />
      <SectionLabel label="Attendance" t={t} />
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 16px 14px",
        }}
      >
        {[
          { key: "Present", value: att.present ?? 0, dot: t.success },
          { key: "Half day", value: att.halfDay ?? 0, dot: t.warning },
          { key: "Absent", value: att.absent ?? 0, dot: t.danger },
          { key: "Total", value: att.totalDays ?? 0, dot: t.border },
        ].map(({ key, value, dot }) => (
          <AttChip key={key} label={key} value={value} dot={dot} t={t} />
        ))}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({ label, t }: { label: string; t: any }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: t.textMuted,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        padding: "10px 16px 6px",
      }}
    >
      {label}
    </div>
  );
}

function Divider({ t }: { t: any }) {
  return (
    <div style={{ height: 1, background: t.borderLight, margin: "0 16px" }} />
  );
}

function StatCard({
  label,
  value,
  color,
  t,
}: {
  label: string;
  value: number;
  color: string;
  t: any;
}) {
  return (
    <div
      style={{
        background: t.surfaceElevated,
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, color, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

function RateBar({
  label,
  pct,
  color,
  t,
}: {
  label: string;
  pct: number;
  color: string;
  t: any;
}) {
  return (
    <div
      style={{
        background: t.surfaceElevated,
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 99,
          background: t.borderLight,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            borderRadius: 99,
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color, marginTop: 4 }}>
        {pct.toFixed(2)}%
      </div>
    </div>
  );
}

function AttChip({
  label,
  value,
  dot,
  t,
}: {
  label: string;
  value: number;
  dot: string;
  t: any;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        background: t.surfaceElevated,
        borderRadius: 8,
        padding: "8px 4px",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dot,
        }}
      />
      <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: t.textMuted }}>{label}</div>
    </div>
  );
}

export function InquiryDistributor({
  defaultPersons = [],
  onShare,
  month = "April 2026",
  form,
  defaultSelectedId = null,
  onConfirmShare,
  createInquiry,
  loading,
}: any) {
  const { getAllSalesPerson, loading: salesLoading, error } = useSalesPerson();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [persons, setPersons] = useState<ShareInquiryPerson[]>([]);
  // const [persons, setPersons] = useState<UISalesPerson[]>(defaultPersons);
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultSelectedId || null,
  );
  // const [modalPerson, setModalPerson] = useState<UISalesPerson | null>(null);
  const [modalPerson, setModalPerson] = useState<ShareInquiryPerson | null>(
    null,
  );
  // on the Share Inquiry button:

  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const { tokens } = ctx;

  const selectedPerson =
    persons.find((p: ShareInquiryPerson) => p.id === selectedId) ?? null;

  useEffect(() => {
    const fetchSalesPersons = async () => {
      try {
        const res = await getAllSalesPerson();

        // const mapped = res.data.data.map((p: any, index: number) => ({
        //   id: p.id,
        //   name: p.name,
        //   email: p.email,
        //   mobile: p.phone || "",
        //   role: p.assignedArea || "Sales",
        //   initials: p.name
        //     ?.split(" ")
        //     .map((n: string) => n[0])
        //     .join("")
        //     .toUpperCase()
        //     .slice(0, 2),
        //   avatarColor: getAvatarColor(index),
        // }));

        const mapToUI = (data: SalesPerson[]): UISalesPerson[] => {
          return data.map((p, index) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            mobile: p.phone || "",
            role: p.assignedArea || "Sales",
            initials: p.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
            avatarColor: getAvatarColor(index),
          }));
        };
        const salespersons: SalesPerson[] = res.data?.salespersons ?? [];
        const mapped = salespersons.map((p, index) =>
          mapToShareInquiryPerson(p, index),
        );
        setPersons(mapped);
        // setPersons(mapToUI(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    setTimeout(() => {
      fetchSalesPersons();
    }, 400);
  }, []);
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return persons.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.mobile ?? "").includes(q),
    );
  }, [query, persons]);

  // const onConfirm = async () => {
  //   if (!selectedPerson) return;

  //   try {
  //     await createInquiry(selectedPerson.id);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Inquiry distributed successfully",
  //     });

  //     setModalPerson(null);
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed to submit inquiry",
  //     });
  //   }
  // };

  const onConfirm = async () => {
    if (!selectedPerson) return;

    try {
      await onConfirmShare?.(selectedPerson.id);
      setModalPerson(null);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="font-sans">
      {/* Search */}
      <div className="flex items-center gap-3 mb-3.5">
        <label className="text-sm font-semibold whitespace-nowrap">
          Distribute Inquiry
        </label>

        <div className="relative flex-1 max-w-[380px]">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border outline-none"
            placeholder="Search sales person..."
          />

          {/* dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border rounded-xl shadow-lg z-50">
              {searchResults.map((p: any) => (
                <div
                  key={p.id}
                  onMouseDown={() => {
                    setSelectedId(p.id);
                    setQuery("");
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `${p.avatarColor}20`,
                      border: `1.5px solid ${p.avatarColor}`,
                      color: p.avatarColor,
                    }}
                  >
                    {p.initials}
                  </div>

                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {salesLoading ? (
        // <CommonLoader size={48} overlay={true} fullScreen={false} />
        <SectionLoader />
      ) : (
        <>
          {/* Card */}
          <div className="border border-border rounded-xl bg-surface overflow-hidden">
            <div className="p-4 flex flex-wrap gap-1">
              {persons.map((person: any) => (
                <Avatar
                  key={person.id}
                  person={person}
                  selected={selectedId === person.id}
                  onClick={() =>
                    setSelectedId((prev) =>
                      prev === person.id ? null : person.id,
                    )
                  }
                  t={tokens}
                />
              ))}
            </div>

            {selectedPerson && (
              <SummaryPanel person={selectedPerson} t={tokens} month={month} />
            )}
          </div>
        </>
      )}

      {/* Button */}
      <div className="flex justify-end mt-3">
        <Button
          type="button"
          size="xl"
          onClick={() => setModalPerson(selectedPerson)}
          disabled={!selectedPerson || defaultSelectedId === selectedPerson.id}
          // className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
          //   selectedPerson
          //     ? "bg-blue-600 text-white hover:opacity-90"
          //     : "bg-gray-200 text-gray-400 cursor-not-allowed"
          // }`}
        >
          Share Inquiry
        </Button>
      </div>

      {modalPerson && (
        <Modal
          title="Share Inquiry"
          onClose={() => setModalPerson(null)}
          width={400}
        >
          <ShareInquiry
            onClose={() => setModalPerson(null)}
            onConfirm={() => {
              onConfirm();
            }}
            loading={loading}
            person={modalPerson}
          />
        </Modal>
      )}
    </div>
  );
}
