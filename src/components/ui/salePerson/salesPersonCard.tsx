import React, { useState } from "react";
import { Mail, Phone, Edit } from "lucide-react";
import { SalesPerson } from "@/src/types/users";
import { useTheme } from "@/src/contexts";
import SalesPersonAttendance from "./salesPersonAttendance";
import { Button } from "../button";
import { Modal } from "../modal";
import UpdateSalesPersonForm from "./updateSalesPersonForm";
import { useToggleActiveStatus } from "@/src/hooks/salesPerson/useToggleActive";
import { useResetDeviceBySalesPerson } from "@/src/hooks/salesPerson/useResetDeviceBySalesPerson";
import {
  statusUserBg,
  statusUserColor,
} from "../distributeInquiry/shareInquiry/helpers";
import ButtonLoader from "../loader/buttonLoader";
import SetResetPinForm from "./setResetPinForm";
import Swal from "sweetalert2";
import { Card } from "../card";
import { Link } from "react-router-dom";

interface Props {
  person: SalesPerson;
  onViewReport?: (person: SalesPerson) => void;
  onToggleStatus?: (person: SalesPerson) => void;
  onUpdated?: (updated: SalesPerson) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function AttendanceBar({
  attendance,
}: {
  attendance: SalesPerson["attendance"];
}) {
  const total = attendance?.totalDays || 1;
  const present = attendance?.present ?? 0;
  const halfDay = attendance?.halfDay ?? 0;
  const absent = attendance?.absent ?? 0;

  const pPct = Math.round((present / total) * 100);
  const hPct = Math.round((halfDay / total) * 100);
  const aPct = Math.round((absent / total) * 100);

  return (
    <div className="mt-3">
      {/* Bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden gap-1">
        <div className="bg-[#639922] rounded-full" style={{ flex: present }} />
        <div className="bg-[#BA7517] rounded-full" style={{ flex: halfDay }} />
        <div className="bg-[#E24B4A] rounded-full" style={{ flex: absent }} />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-3 mt-1.5">
        {[
          { label: "Present", pct: pPct, color: "#639922" },
          { label: "Half day", pct: hPct, color: "#BA7517" },
          { label: "Absent", pct: aPct, color: "#E24B4A" },
        ].map(({ label, pct, color }) => (
          <span key={label} className="flex items-center gap-1 text-[11px]">
            <span
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: color }}
            />
            <span className="text-textSec">
              {label} {pct}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
function InquiriesBar({ inquiries }: { inquiries: SalesPerson["inquiries"] }) {
  const total = inquiries?.total || 1;

  const inProgress = inquiries?.inProgress ?? 0;
  const followUp = inquiries?.followUp ?? 0;
  const closed = inquiries?.closed ?? 0;
  const converted = inquiries?.converted ?? 0;

  const p1 = Math.round((inProgress / total) * 100);
  const p2 = Math.round((followUp / total) * 100);
  const p3 = Math.round((closed / total) * 100);
  const p4 = Math.round((converted / total) * 100);

  return (
    <div className="mt-3">
      {/* Bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden gap-1">
        <div
          className="bg-[#185FA5] rounded-full"
          style={{ flex: inProgress }}
        />
        <div className="bg-[#BA7517] rounded-full" style={{ flex: followUp }} />
        <div className="bg-[#3B6D11] rounded-full" style={{ flex: closed }} />
        <div
          className="bg-[#993C1D] rounded-full"
          style={{ flex: converted }}
        />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-3 mt-1.5">
        {[
          { label: "In Progress", pct: p1, color: "#185FA5" },
          { label: "Follow Up", pct: p2, color: "#BA7517" },
          { label: "Closed", pct: p3, color: "#3B6D11" },
          { label: "Converted", pct: p4, color: "#993C1D" },
        ].map(({ label, pct, color }) => (
          <span key={label} className="flex items-center gap-1 text-[11px]">
            <span
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: color }}
            />
            <span className="text-textSec">
              {label} {pct}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
interface InqCellProps {
  value: number | string;
  label: string;
  valueStyle?: React.CSSProperties;
}
function InqCell({ value, label, valueStyle }: InqCellProps) {
  return (
    <div className="bg-bg rounded-lg px-2.5 pt-2.5 pb-2">
      <p
        className="text-[20px] font-semibold leading-[1.1] m-0"
        style={valueStyle}
      >
        {value}
      </p>

      <p className="text-[10px] text-textMuted uppercase tracking-[0.05em] font-semibold mt-1">
        {label}
      </p>
    </div>
  );
}
export default function SalesPersonCard({
  person,
  onToggleStatus,
  onUpdated,
}: Props) {
  const { tokens } = useTheme();
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [setResetPinModal, setSetResetPinModal] = useState(false);
  const [status, setStatus] = useState(person.isActive ? "active" : "inactive");

  const { toggleActiveStatus, loading: toggleLoading } =
    useToggleActiveStatus();
  const { resetDevice, loading: resetLoading } = useResetDeviceBySalesPerson();

  const inq = person.inquiries;
  const att = person.attendance;

  const avatar =
    person.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`;

  const handleToggleStatus = async () => {
    try {
      await toggleActiveStatus(person.id);
      setStatus((prev) => (prev === "active" ? "inactive" : "active"));
      onToggleStatus?.(person);
    } catch {
      Swal.fire({ icon: "error", title: "Failed to toggle status" });
    }
  };

  const handleResetDevice = async () => {
    const result = await Swal.fire({
      title: "Reset device?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it",
    });
    if (!result.isConfirmed) return;
    try {
      await resetDevice(person.id);
      Swal.fire({ icon: "success", title: "Device reset successfully" });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to reset device",
        text: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  return (
    <Card className="p-0!">
      {/* Header */}
      <div className="px-5 pt-4 pb-3.5 flex items-center gap-3.5">
        <img
          src={avatar}
          alt={person.name}
          className="w-13 h-13 rounded-xl object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[15px] font-bold text-text truncate">
              {person.name}
            </span>

            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                status === "active"
                  ? "bg-[#EAF3DE] text-[#3B6D11]"
                  : "bg-bg text-textMuted"
              }`}
            >
              {status === "active" ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-[11px] text-textMuted mb-1">
            {person.employeeId} &middot; {person.assignedArea ?? "No area"}
          </p>

          <div className="flex flex-wrap gap-2.5">
            <span className="flex items-center gap-1 text-[12px] text-textSec">
              <Mail size={12} />
              {person.email}
            </span>

            {person.phone && (
              <span className="flex items-center gap-1 text-[12px] text-textSec">
                <Phone size={12} />
                {person.phone}
              </span>
            )}
          </div>
        </div>
        <Link
          to={`/sales-persons/${person.id}`}
          className="text-sm text-blue-500 hover:underline"
        >
          View Details
        </Link>
      </div>
      {/* Divider */}
      <div className="h-px bg-border mx-5" />
      {/* Inquiries */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-textMuted mb-2.5">
          Inquiries
        </p>

        <div className="grid grid-cols-3 gap-2">
          <InqCell value={inq?.total ?? 0} label="Total" />
          <InqCell
            value={inq?.inProgress ?? 0}
            label="In Progress"
            valueStyle={{ color: "#185FA5" }}
          />
          <InqCell
            value={inq?.followUp ?? 0}
            label="Follow Up"
            valueStyle={{ color: "#BA7517" }}
          />
          <InqCell value={inq?.assigned ?? 0} label="Assigned" />
          <InqCell
            value={inq?.closed ?? 0}
            label="Closed"
            valueStyle={{ color: "#3B6D11" }}
          />
          <InqCell
            value={inq?.converted ?? 0}
            label="Converted"
            valueStyle={{ color: "#993C1D" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            {
              label: "Close rate",
              value: inq?.closeRate ?? "0.00%",
              color: "#3B6D11",
            },
            {
              label: "Conversion rate",
              value: inq?.conversionRate ?? "0.00%",
              color: "#854F0B",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-bg rounded-lg p-2.5 flex justify-between items-center"
            >
              <span className="text-[11px] text-textSec font-semibold">
                {label}
              </span>
              <span className="text-[14px] font-bold" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <InquiriesBar inquiries={person.inquiries} />
      </div>
      {/* Divider */}
      <div className="h-px bg-border mx-5" />
      {/* Attendance */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-textMuted mb-2.5">
          Attendance
        </p>

        <div className="grid grid-cols-4 gap-2">
          {[
            { val: att?.present ?? 0, label: "Present", color: "#3B6D11" },
            { val: att?.halfDay ?? 0, label: "Half day", color: "#854F0B" },
            { val: att?.absent ?? 0, label: "Absent", color: "#A32D2D" },
            {
              val: att?.totalDays ?? 0,
              label: "Total days",
              color: "var(--text)",
            },
          ].map(({ val, label, color }) => (
            <div
              key={label}
              className="bg-bg rounded-lg px-2 pt-2.5 pb-2 text-center"
            >
              <p className="text-[20px] font-semibold m-0" style={{ color }}>
                {val}
              </p>
              <p className="text-[10px] text-textMuted uppercase tracking-[0.05em] font-semibold mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        <AttendanceBar attendance={att} />
      </div>
      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleToggleStatus}
          style={{
            background: statusUserBg(!toggleLoading ? status : ""),
            color: statusUserColor(!toggleLoading ? status : ""),
          }}
        >
          {toggleLoading ? (
            <ButtonLoader />
          ) : status === "active" ? (
            "Active"
          ) : (
            "Inactive"
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => setSetResetPinModal(true)}
        >
          Reset PIN
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => setUpdateUserModal(true)}
        >
          <Edit size={13} /> Edit
        </Button>

        <Button variant="danger" onClick={handleResetDevice}>
          {resetLoading ? <ButtonLoader /> : "Reset Device"}
        </Button>
      </div>
      {/* Modals unchanged */}
      {updateUserModal && (
        <Modal
          title="Update Sales Person"
          onClose={() => setUpdateUserModal(false)}
          width={400}
        >
          {" "}
          <UpdateSalesPersonForm
            salesPersonId={person.id}
            person={person}
            onClose={() => setUpdateUserModal(false)}
            onUpdated={(u) => {
              onUpdated?.(u);
            }}
          />{" "}
        </Modal>
      )}{" "}
      {setResetPinModal && (
        <Modal
          title="(Re)Set PIN"
          onClose={() => setSetResetPinModal(false)}
          width={400}
        >
          {" "}
          <SetResetPinForm
            salesPersonId={person.id}
            onClose={() => setSetResetPinModal(false)}
          />{" "}
        </Modal>
      )}
    </Card>
  );
}
