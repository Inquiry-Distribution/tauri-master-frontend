import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts";
import {
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Download,
  RefreshCcw,
  Check,
} from "lucide-react";
import { SalesPerson } from "@/src/types/users";
import { cn } from "../../utils/utils";
import SalesPersonCard from "@/src/components/ui/salePerson/salesPersonCard";
import { useSalesPerson } from "@/src/hooks/salesPerson/useSalesPerson";
import SectionLoader from "@/src/components/ui/loader/sectionLoader";
import { Button } from "@/src/components/ui/button";
import { exportSalesPersonExcel } from "@/src/xls-convert/salesPerson.export";
import { Modal } from "@/src/components/ui/modal";
import CreateUserForm from "./create/_form";
import { useSyncUsers } from "@/src/hooks/salesPerson/useSyncUsers";
import Swal from "sweetalert2";

// const mockSalesPersons: SalesPerson[] = [
//   {
//     id: '1',
//     name: 'Sarah Miller',
//     email: 'sarah.m@company.com',
//     phone: '+1 234 567 001',
//     status: 'active',
//     performance: 92,
//     totalInquiries: 145,
//     closedInquiries: 120,
//     avatar: 'https://picsum.photos/seed/sarah/100/100',
//   },
//   {
//     id: '2',
//     name: 'Michael Chen',
//     email: 'm.chen@company.com',
//     phone: '+1 234 567 002',
//     status: 'active',
//     performance: 85,
//     totalInquiries: 132,
//     closedInquiries: 105,
//     avatar: 'https://picsum.photos/seed/michael/100/100',
//   },
//   {
//     id: '3',
//     name: 'Emma Wilson',
//     email: 'emma.w@company.com',
//     phone: '+1 234 567 003',
//     status: 'blocked',
//     performance: 45,
//     totalInquiries: 88,
//     closedInquiries: 32,
//     avatar: 'https://picsum.photos/seed/emma/100/100',
//   },
// ];

export const mapSalesPerson = (sp: any): SalesPerson => {
  return {
    id: sp.id,
    name: sp.name,
    email: sp.email,

    phone: sp.phone || "",
    employeeId: sp.employeeId || "",
    assignedArea: sp.assignedArea || "Unassigned",

    isActive: sp.isActive ?? true,

    profileImage: sp.profileImage || "",

    // ✅ fallback defaults for new users
    inquiries: sp.inquiries || {
      total: 0,
      assigned: 0,
      inProgress: 0,
      followUp: 0,
      closed: 0,
      converted: 0,
      conversionRate: "0%",
      closeRate: "0%",
    },

    attendance: sp.attendance || {
      present: 0,
      halfDay: 0,
      absent: 0,
      totalDays: 0,
    },
  };
};
export default function SalesPersonsPage() {
  const { tokens } = useTheme();
  const { getAllSalesPerson, loading, error } = useSalesPerson();
  const {
    syncUsers,
    loading: syncUsersLoading,
    error: syncUsersError,
  } = useSyncUsers();

  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
  const [createSalesPersonOpen, setCreateSalesPersonOpen] = useState(false);

  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSync = async () => {
    try {
      await syncUsers(); // call your API

      // show success icon
      setSyncSuccess(true);

      // revert back after 2 seconds
      setTimeout(() => {
        setSyncSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Sync Failed",
        text: syncUsersError || "An error occurred while syncing.",
      });
    }
  };

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSalesPerson();

        const mapped = data?.data?.salespersons?.map(mapSalesPerson) || [];
        // const mapped = [
        //   {
        //     id: "6372da3d-bac127-43fc-999b-0338ba05cec8",
        //     name: "Ravi Verma",
        //     email: "ravi@inquiry.com",
        //     phone: "9000000003",
        //     employeeId: "EMP003",
        //     assignedArea: "East Zone",
        //     profileImage: null,
        //     role: "sales",
        //     isActive: true,
        //     createdAt: "2026-04-28T12:30:37.346Z",
        //     inquiries: {
        //       total: 7,
        //       assigned: 1,
        //       inProgress: 2,
        //       followUp: 1,
        //       closed: 2,
        //       converted: 1,
        //       conversionRate: "14.29%",
        //       closeRate: "28.57%",
        //     },
        //     attendance: {
        //       present: 3,
        //       halfDay: 1,
        //       absent: 2,
        //       totalDays: 6,
        //     },
        //   },
        // ].map(mapSalesPerson);

        setSalesPersons(mapped);

        // ⚠️ adjust based on your API response structure
        // setSalesPersons(data?.data || data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleUpdated = (updatedPerson: SalesPerson) => {
    setSalesPersons((prev) =>
      prev.map((p) =>
        p.id === updatedPerson.id ? { ...p, ...updatedPerson } : p,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Sales Team
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            Manage your sales persons and monitor their performance.
          </p>
        </div>
        <div className="flex gap-3">
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
        </div>
      </div>

      {/* ❌ Error State */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* ⏳ Loading State */}
      {loading ? (
        <SectionLoader height="80%" />
      ) : (
        <>
          {/* ✅ Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && salesPersons.length > 0
              ? salesPersons.map((person) => (
                  <SalesPersonCard
                    key={person.id}
                    person={person}
                    onViewReport={(p) => {}}
                    onToggleStatus={(p) => {}}
                    onUpdated={handleUpdated}
                  />
                ))
              : !loading && (
                  <div className="text-sm" style={{ color: tokens.textSec }}>
                    No sales persons found.
                  </div>
                )}
          </div>
        </>
      )}

      {/* ✅ Create Sales Person Modal */}
      {createSalesPersonOpen && (
        <Modal
          title="Create Sales Person"
          onClose={() => setCreateSalesPersonOpen(false)}
        >
          <CreateUserForm
            onSuccess={(user: any) => {
              const mappedUser = mapSalesPerson(user);

              setSalesPersons((prev) => {
                const exists = prev.some((p) => p.id === mappedUser.id);
                if (exists) return prev;
                return [mappedUser, ...prev];
              });
              setCreateSalesPersonOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
