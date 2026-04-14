import { useTheme } from "@/src/contexts";
import { useState, useMemo } from "react";

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

interface SalesPerson {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  avatarColor: string;
  isDefault?: boolean;
}

interface DistributeInquiryProps {
  t: ThemeTokens;
  defaultPersons?: SalesPerson[];
  onShare?: (selected: SalesPerson[]) => void;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const DUMMY_SALESPEOPLE: SalesPerson[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    email: "arjun@acme.in",
    mobile: "9876543210",
    role: "Senior Sales",
    initials: "AM",
    avatarColor: "#4F7DF3",
    isDefault: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@acme.in",
    mobile: "9765432109",
    role: "Sales Lead",
    initials: "PS",
    avatarColor: "#34D399",
    isDefault: true,
  },
  {
    id: "3",
    name: "Rohan Das",
    email: "rohan@acme.in",
    mobile: "9654321098",
    role: "Sales Exec",
    initials: "RD",
    avatarColor: "#FB923C",
    isDefault: true,
  },
  {
    id: "4",
    name: "Sneha Kapoor",
    email: "sneha@acme.in",
    mobile: "9543210987",
    role: "Sales Exec",
    initials: "SK",
    avatarColor: "#F87171",
    isDefault: true,
  },
  {
    id: "5",
    name: "Vikram Nair",
    email: "vikram@acme.in",
    mobile: "9432109876",
    role: "Sales Lead",
    initials: "VN",
    avatarColor: "#A78BFA",
    isDefault: true,
  },
  {
    id: "6",
    name: "Nisha Tiwari",
    email: "nisha@acme.in",
    mobile: "9321098765",
    role: "Senior Sales",
    initials: "NT",
    avatarColor: "#F472B6",
    isDefault: true,
  },
  {
    id: "7",
    name: "Karan Joshi",
    email: "karan@acme.in",
    mobile: "9210987654",
    role: "Sales Exec",
    initials: "KJ",
    avatarColor: "#38BDF8",
    isDefault: true,
  },
  {
    id: "8",
    name: "Meera Pillai",
    email: "meera@acme.in",
    mobile: "9109876543",
    role: "Sales Lead",
    initials: "MP",
    avatarColor: "#FBBF24",
    isDefault: true,
  },
  {
    id: "9",
    name: "Amit Verma",
    email: "amit@acme.in",
    mobile: "9876501234",
    role: "Sales Exec",
    initials: "AV",
    avatarColor: "#6EE7B7",
    isDefault: true,
  },
  {
    id: "10",
    name: "Deepa Rao",
    email: "deepa@acme.in",
    mobile: "9765012345",
    role: "Senior Sales",
    initials: "DR",
    avatarColor: "#C084FC",
    isDefault: true,
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
const Avatar = ({
  person,
  selected,
  onClick,
}: {
  person: SalesPerson;
  selected: boolean;
  onClick: () => void;
}) => {
  const { tokens } = useTheme();
  return (
    <button
      onClick={onClick}
      title={`${person.name}\n${person.role}\n${person.email}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 4px",
        borderRadius: 12,
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: selected
            ? `linear-gradient(135deg, ${person.avatarColor}cc, ${person.avatarColor})`
            : `${person.avatarColor}22`,
          border: selected
            ? `2.5px solid ${person.avatarColor}`
            : `2px solid ${tokens.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: selected ? "#fff" : person.avatarColor,
          boxShadow: selected ? `0 0 0 3px ${person.avatarColor}33` : "none",
          transition: "all 0.2s ease",
          position: "relative",
        }}
      >
        {person.initials}
        {/* checkmark badge */}
        {selected && (
          <span
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: person.avatarColor,
              border: `2px solid ${tokens.surface}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: "#fff",
            }}
          >
            ✓
          </span>
        )}
      </div>
      {/* Name label */}
      <span
        style={{
          fontSize: 10,
          fontWeight: selected ? 600 : 400,
          color: selected ? tokens.text : tokens.textMuted,
          maxWidth: 60,
          textAlign: "center",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {person.name.split(" ")[0]}
      </span>
    </button>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export function DistributeInquiry({
  t,
  defaultPersons = DUMMY_SALESPEOPLE,
  onShare,
}: DistributeInquiryProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<SalesPerson[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allPersons, setAllPersons] = useState<SalesPerson[]>(defaultPersons);

  // Search filter
  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setShowDropdown(false);
      return;
    }
    const q = val.toLowerCase();
    const results = DUMMY_SALESPEOPLE.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.mobile.includes(q),
    );
    setSearchResults(results);
    setShowDropdown(true);
  };

  const addPerson = (person: SalesPerson) => {
    if (!allPersons.find((p) => p.id === person.id)) {
      setAllPersons((prev) => [person, ...prev]);
    }
    setSelected((prev) => new Set([...prev, person.id]));
    setQuery("");
    setShowDropdown(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleShare = () => {
    const selectedPersons = allPersons.filter((p) => selected.has(p.id));
    onShare?.(selectedPersons);
  };

  const defaultCount = allPersons.filter((p) => p.isDefault).length;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Search row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <label
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: t.text,
            whiteSpace: "nowrap",
          }}
        >
          Distribute Inquiry
        </label>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search sales person by name, email or mobile number..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.surface,
              color: t.text,
              fontSize: 12.5,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = t.accent)}
            onBlur={(e) => {
              e.target.style.borderColor = t.border;
              setTimeout(() => setShowDropdown(false), 150);
            }}
          />
          {/* search icon */}
          <svg
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.4,
            }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={t.text}
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          {/* Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                zIndex: 100,
                background: t.surfaceElevated,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}
            >
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onMouseDown={() => addPerson(p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = t.accentLight)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: `${p.avatarColor}22`,
                      border: `1.5px solid ${p.avatarColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: p.avatarColor,
                      flexShrink: 0,
                    }}
                  >
                    {p.initials}
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: t.text }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>
                      {p.email} · {p.mobile}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card container */}
      <div
        style={{
          border: `1.5px solid ${t.border}`,
          borderRadius: 14,
          padding: "16px 18px 14px",
          background: t.surface,
          position: "relative",
        }}
      >
        {/* Avatar scroll row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            minHeight: 80,
          }}
        >
          {allPersons.slice(0, 20).map((person) => (
            <Avatar
              key={person.id}
              person={person}
              selected={selected.has(person.id)}
              onClick={() => toggleSelect(person.id)}
            />
          ))}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <span
            style={{ fontSize: 11.5, color: t.textMuted, fontStyle: "italic" }}
          >
            ……{defaultCount} Default person list
          </span>
          {selected.size > 0 && (
            <span
              style={{
                fontSize: 11,
                color: t.accentText,
                fontWeight: 600,
                background: t.accentLight,
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              {selected.size} selected
            </span>
          )}
        </div>
      </div>

      {/* Share button */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
      >
        <button
          onClick={handleShare}
          disabled={selected.size === 0}
          style={{
            padding: "9px 22px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            background:
              selected.size > 0
                ? `linear-gradient(135deg, ${t.accent}, ${t.accentText})`
                : t.border,
            color: selected.size > 0 ? "#fff" : t.textMuted,
            border: "none",
            cursor: selected.size > 0 ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            boxShadow: selected.size > 0 ? `0 4px 12px ${t.accent}44` : "none",
          }}
          onMouseEnter={(e) => {
            if (selected.size > 0) e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Share Inquiry
        </button>
      </div>
    </div>
  );
}

export default DistributeInquiry;
