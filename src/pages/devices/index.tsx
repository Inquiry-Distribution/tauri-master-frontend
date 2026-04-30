import { useEffect, useState } from "react";
import { useTheme } from "../../contexts";
import {
  Smartphone,
  MapPin,
  Shield,
  ShieldOff,
  User,
  Clock,
  Download,
} from "lucide-react";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import DynamicTable from "@/src/components/ui/table/dynamicTable";
import { TableColumn } from "@/src/components/ui/table/types";
import { cn } from "../../utils/utils";
import { buildColumns, DUMMY_API_DEVICES } from "./data";
import { LiveLocationsCard } from "./deviceComponents";
import { mapApiToUIDevice, UIDevice } from "@/src/mappers/device.mapper";
import { useGetAllDevices } from "@/src/hooks/device/useGetAllDevices";
import { Device } from "@/src/types/devices";
import { exportDeviceExcel } from "@/src/xls-convert/device.export";

// ── Mock data ───────────────────────────────────────────────────────────────

// ── Page ────────────────────────────────────────────────────────────────────

export default function DevicesPage() {
  const { tokens } = useTheme();

  // Devices state
  const [devices, setDevices] = useState<Device[]>([]);

  const { data, loading, error, getDevices } = useGetAllDevices();

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setDevices(data);
    } else {
      setDevices([]); // no fallback
    }
  }, [data]);

  //dummyData
  // useEffect(() => {
  //   setDevices(DUMMY_API_DEVICES);
  // }, []);

  // Table state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Device | undefined>();
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

  // Toggle block/unblock
  const handleToggle = (id: string) =>
    setDevices((prev) =>
      prev?.map((d) => (d.id === id ? { ...d, isBlocked: !d.isBlocked } : d)),
    );

  // Filter + sort
  const filtered = devices
    .filter((d) =>
      [d.platform, d.appVersion, d.id, d.salespersonId, d.isBlocked]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = String(a[sortKey as keyof Device] ?? "");
      const bv = String(b[sortKey as keyof Device] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const columns = buildColumns(handleToggle);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isSuperUser = userData?.role === "superuser";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: tokens.text }}
        >
          Device Monitoring
        </h1>
        <p className="text-sm" style={{ color: tokens.textSec }}>
          Track all active devices and manage access permissions.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices table */}
        <div className={`${!isSuperUser ? "lg:col-span-3" : "lg:col-span-2"}`}>
          <Card className="!p-0 overflow-hidden">
            <div className=" flex justify-between items-center px-6 py-4 border-b border-(--border)">
              <h3 className="font-bold text-(--text)">Active Devices</h3>
              <Button onClick={() => exportDeviceExcel(devices)}>
                <Download size={18} />
              </Button>
            </div>
            <div className="p-4">
              <DynamicTable<Device>
                columns={columns}
                data={paginated}
                loading={loading}
                currentPage={page}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onPageChange={setPage}
                onRowsPerPageChange={(n) => {
                  setRowsPerPage(n);
                  setPage(1);
                }}
                searchable={false}
                searchTerm={search}
                onSearchChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                searchPlaceholder="Search devices…"
                rowKey={(d) => d.id}
                sortKey={sortKey}
                sortDirection={sortDir}
                onSortChange={(k, dir) => {
                  setSortKey(k as keyof Device);
                  setSortDir(dir);
                }}
                showSerialNumber={false}
                emptyMessage="No devices found."
                striped
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        {isSuperUser && <LiveLocationsCard />}
      </div>
    </div>
  );
}
