import { useTheme } from "../../contexts";

import { SalesPerson } from "@/src/types/users";

import LoginLimitForm from "./_form";
import AttendanceHoursForm from "./_formAttendanceHours";

export default function SettingsPage() {
  const { tokens } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Settings
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            Manage your system settings.
          </p>
        </div>
        {/* <div className="flex gap-3">
          <Button
            onClick={() => handleSync()}
            variant="ghost"
            title="Sync Data"
          >
            {syncUsersLoading ? (
              <RefreshCcw size={18} className="animate-spin" />
            ) : syncSuccess ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <RefreshCcw size={18} />
            )}
          </Button>
          <Button onClick={() => exportSalesPersonExcel(salesPersons)}>
            <Download size={18} />
          </Button>

          <button
            onClick={() => setCreateSalesPersonOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Add Sales Person
          </button>
        </div> */}
      </div>

      <LoginLimitForm />
      <AttendanceHoursForm />
    </div>
  );
}
