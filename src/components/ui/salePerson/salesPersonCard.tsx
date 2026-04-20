import React, { useState } from "react";
import { Mail, Phone, MoreVertical, Edit } from "lucide-react";
import { SalesPerson } from "@/src/types/users";
import { cn } from "@/src/utils/utils";
import { useTheme } from "@/src/contexts";
import SalesPersonAttendance from "./salesPersonAttendance";
import { Button } from "../button";
import { useUpdateUser } from "@/src/hooks/salesPerson/useUpdateUser";
import { Modal } from "../modal";
import UpdateSalesPersonForm from "./updateSalesPersonForm";
import { useToggleActiveStatus } from "@/src/hooks/salesPerson/useToggleActive";
import {
  statusUserBg,
  statusUserColor,
} from "../distributeInquiry/shareInquiry/helpers";
import ButtonLoader from "../loader/buttonLoader";
import Swal from "sweetalert2";

interface Props {
  person: SalesPerson;
  onViewReport?: (person: SalesPerson) => void;
  onToggleStatus?: (person: SalesPerson) => void;
}

const defaultStats = {
  status: "active",
  performance: 75,
  totalInquiries: 0,
  closedInquiries: 0,
  avatar: "https://ui-avatars.com/api/?name=User",
};

export default function SalesPersonCard({
  person,
  onViewReport,
  onToggleStatus,
}: Props) {
  const { tokens } = useTheme();
  const [updateUserModal, setUpdateUserModal] = useState<boolean>(false);
  const {
    toggleActiveStatus,
    loading: toggleLoading,
    error: toggleError,
  } = useToggleActiveStatus();
  const handleToggleStatus = async () => {
    try {
      await toggleActiveStatus(person.id);
      onToggleStatus?.(person);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to toggle status",
      });
      console.error(error);
    }
  };

  // ✅ Merge API data with defaults
  // const data = {
  //   ...defaultStats,
  //   ...person,
  //   avatar:
  //     (person as any)?.avatar ||
  //     `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`,
  // };
  const inquiries = person.inquiries;

  const totalInquiries = inquiries?.total ?? 0;
  const closedInquiries = inquiries?.closed ?? 0;

  const performance = inquiries?.total
    ? Math.round((inquiries.converted / inquiries.total) * 100)
    : 0;

  const data = {
    ...person,

    status: person.isActive ? "active" : "inactive",

    totalInquiries,
    closedInquiries,
    performance,

    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`,
  };

  const performanceColor =
    data.performance >= 70
      ? tokens.success
      : data.performance >= 40
        ? tokens.warning
        : tokens.danger;
  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-xl"
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        {/* <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <img
              src={data.avatar}
              alt={data.name}
              className="w-16 h-16 rounded-2xl object-cover border-2"
              style={{ borderColor: tokens.border }}
            />

            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2",
                data.status === "active" ? "bg-green-500" : "bg-red-500",
              )}
              style={{ borderColor: tokens.surface }}
            />
          </div>

          <button
            title="More"
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{
              color: tokens.textMuted,
              backgroundColor: tokens.borderLight,
            }}
          >
            <MoreVertical size={18} />
          </button>
        </div> */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <img
              alt={data.name}
              src={data.avatar}
              className="w-14 h-14 rounded-xl"
            />

            <div className="space-y-1">
              {/* <h3 className="font-bold text-sm">{data.name}</h3> */}

              <p className="text-[11px] opacity-70">ID: {data.employeeId}</p>
              {/* <p className="text-[11px] opacity-70">{data.email}</p> */}
              <div className="flex  gap-2 mt-2">
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: tokens.textSec }}
                >
                  <Mail size={14} />
                  {data.email || "No email"}
                </div>

                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: tokens.textSec }}
                >
                  <Phone size={14} />
                  {data.phone || "No phone"}
                </div>
              </div>
              <p className="text-xs" style={{ color: tokens.textMuted }}>
                Area: {data.assignedArea || "Not Assigned"}
              </p>
            </div>
          </div>

          <button className="opacity-60">⋮</button>
        </div>

        {/* Info */}
        <div className="mb-3">
          <h3 className="text-lg font-bold" style={{ color: tokens.text }}>
            {data.name}
          </h3>

          {/* <p className="text-xs mt-1" style={{ color: tokens.textMuted }}>
            ID: {data.employeeId || "N/A"}
          </p> */}

          {/* <p className="text-xs" style={{ color: tokens.textMuted }}>
            Area: {data.assignedArea || "Not Assigned"}
          </p> */}

          {/* <div className="flex flex-col gap-1 mt-2">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: tokens.textSec }}
            >
              <Mail size={14} />
              {data.email || "No email"}
            </div>

            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: tokens.textSec }}
            >
              <Phone size={14} />
              {data.phone || "No phone"}
            </div>
          </div> */}
        </div>
        <div className="space-y-2">
          <span className="font-bold text-xs uppercase tracking-wider text-textMuted">
            Attendance
          </span>
          <div className="flex gap-2  text-xs w-full mb-3">
            <SalesPersonAttendance attendance={data?.attendance} />
          </div>
        </div>

        {/* Performance */}
        {/* <div className="space-y-4">
          <div>
            <div
              className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider"
              style={{ color: tokens.textMuted }}
            >
              <span>Performance</span>
              <span
                style={{
                  color: data.performance > 80 ? tokens.success : tokens.danger,
                }}
              >
                {data.performance}%
              </span>
            </div>

            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ backgroundColor: tokens.bg }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${data.performance}%`,
                  backgroundColor: performanceColor,
                  // data.performance > 80 ? tokens.success : tokens.danger,
                }}
              />
            </div>
          </div> */}

        {/* Stats */}
        {/* <div className="grid grid-cols-2 gap-4 pt-2">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: tokens.bg }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: tokens.textMuted }}
              >
                Total
              </p>
              <p className="text-lg font-bold" style={{ color: tokens.text }}>
                {data.totalInquiries}
              </p>
            </div>

            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: tokens.bg }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: tokens.textMuted }}
              >
                Closed
              </p>
              <p className="text-lg font-bold" style={{ color: tokens.text }}>
                {data.closedInquiries}
              </p>
            </div>
          </div> */}
        {/* </div> */}

        <div className="space-y-4">
          {/* Performance */}
          <div>
            <div
              className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: tokens.textMuted }}
            >
              <span>Performance</span>
              <span style={{ color: performanceColor }}>
                {data.performance}%
              </span>
            </div>

            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ backgroundColor: tokens.bg }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${data.performance}%`,
                  backgroundColor: performanceColor,
                }}
              />
            </div>
          </div>

          {/* Stats Row (tight layout) */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3 rounded-xl flex flex-col justify-center"
              style={{ backgroundColor: tokens.bg }}
            >
              <p
                className="text-[10px] uppercase font-bold"
                style={{ color: tokens.textMuted }}
              >
                Total
              </p>
              <p className="text-lg font-bold">{data.totalInquiries}</p>
            </div>

            <div
              className="p-3 rounded-xl flex flex-col justify-center"
              style={{ backgroundColor: tokens.bg }}
            >
              <p
                className="text-[10px] uppercase font-bold"
                style={{ color: tokens.textMuted }}
              >
                Closed
              </p>
              <p className="text-lg font-bold">{data.closedInquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{
          borderColor: tokens.border,
          backgroundColor: tokens.bg + "30",
        }}
      >
        <button
          onClick={() => onViewReport?.(data)}
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          View Full Report
        </button>
        <Button
          onClick={() => handleToggleStatus()}
          type="button"
          variant="ghost"
          style={{
            background: statusUserBg(!toggleLoading ? data.status : ""),
            color: statusUserColor(!toggleLoading ? data.status : ""),
          }}
        >
          {toggleLoading ? (
            <ButtonLoader />
          ) : data.status === "active" ? (
            "Active"
          ) : (
            "Inactive"
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => setUpdateUserModal(true)}
        >
          <Edit size={15} />
        </Button>

        <button
          onClick={() => onToggleStatus?.(data)}
          className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
            data.status === "active"
              ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
              : "text-green-500 bg-green-500/10 hover:bg-green-500/20",
          )}
        >
          {data.status === "active" ? "Block Agent" : "Unblock Agent"}
        </button>
      </div>
      {updateUserModal && (
        <Modal
          title="Update Sales Person"
          onClose={() => setUpdateUserModal(false)}
          width={400}
        >
          <UpdateSalesPersonForm
            salesPersonId={data.id}
            person={data}
            onClose={() => setUpdateUserModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
