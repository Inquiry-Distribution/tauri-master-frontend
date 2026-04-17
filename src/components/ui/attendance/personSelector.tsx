import { useEffect, useState } from "react";
import { useSalesPerson1 } from "@/src/hooks/salesPerson/useSalesPerson";
import { SalesPerson } from "@/src/types/users";
import { useTheme } from "@/src/contexts";

export const PersonSelector = ({
  setPersonId,
  setSelectedPerson,
}: {
  setPersonId: (id: string | null) => void;
  setSelectedPerson: (person: SalesPerson | null) => void;
}) => {
  const { getAllSalesPerson, loading } = useSalesPerson1();
  const { tokens } = useTheme();

  const [persons, setPersons] = useState<SalesPerson[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getAllSalesPerson();
      setPersons(res?.data || []);
    })();
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full max-w-sm">
      {/* Label */}
      {/* <label
        className="text-xs font-medium"
        style={{ color: tokens.textMuted }}
      >
        Select Person
      </label> */}

      {/* Select */}
      <div className="relative">
        <select
          title="Select Person"
          aria-label="Select Person"
          id="person-selector"
          name="person-selector"
          disabled={loading}
          onChange={(e) => {
            const id = e.target.value || null;

            setPersonId(id);
            const person = persons.find((p) => p.id === id) || null;

            setSelectedPerson(person);
          }}
          className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
          style={{
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.border}`,
            color: tokens.text,
          }}
        >
          <option value="">Select Person...</option>

          {persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: tokens.textMuted }}
        >
          ▼
        </div>
      </div>

      {/* Loading hint */}
      {loading && (
        <span className="text-xs" style={{ color: tokens.textMuted }}>
          Loading persons...
        </span>
      )}
    </div>
  );
};
