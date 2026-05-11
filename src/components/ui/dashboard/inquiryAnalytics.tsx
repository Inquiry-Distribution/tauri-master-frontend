import { useGetInquiryReportByStatus } from "@/src/hooks/dashboard/useGetInquiryReportByStatus";
import { transformInquiryData } from "@/src/utils/utils";
import { useEffect, useState } from "react";
import Input from "../form/input";
import { Button } from "../button";
import ButtonLoader from "../loader/buttonLoader";
import { Recycle, RefreshCcw } from "lucide-react";
import { InquiryStatusChart } from "./inquiryChart";
import CommonLoader from "../loader/loader";
import Swal from "sweetalert2";

// helper for date formatting (yyyy-mm-dd)
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const FILTERS = [
  {
    key: "today",
    label: "Today",
    getRange: () => {
      const today = new Date();

      return {
        from: today,
        to: today,
      };
    },
  },

  {
    key: "yesterday",
    label: "Yesterday",
    getRange: () => {
      const today = new Date();
      const yesterday = new Date();

      yesterday.setDate(today.getDate() - 1);

      return {
        from: yesterday,
        to: yesterday,
      };
    },
  },

  {
    key: "7d",
    label: "Last 7 Days",
    getRange: () => {
      const today = new Date();
      const from = new Date();

      from.setDate(today.getDate() - 7);

      return {
        from,
        to: today,
      };
    },
  },

  {
    key: "30d",
    label: "Last 30 Days",
    getRange: () => {
      const today = new Date();
      const from = new Date();

      from.setDate(today.getDate() - 30);

      return {
        from,
        to: today,
      };
    },
  },

  {
    key: "thisMonth",
    label: "This Month",
    getRange: () => {
      const today = new Date();

      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      };
    },
  },

  {
    key: "lastMonth",
    label: "Last Month",
    getRange: () => {
      const today = new Date();

      return {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    },
  },
];
export default function InquiryAnalytics() {
  const { data, loading, error, getInquiryReportByStatus } =
    useGetInquiryReportByStatus();
  const [activeFilter, setActiveFilter] = useState("today");
  // ✅ default dates
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [from, setFrom] = useState(formatDate(today));
  // const [from, setFrom] = useState(formatDate(oneMonthAgo));
  const [to, setTo] = useState(formatDate(today));

  // ✅ initial API call
  useEffect(() => {
    getInquiryReportByStatus(from, to);
  }, []);

  // ✅ submit handler
  const handleSubmit = async () => {
    if (from > to) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "'From' date cannot be later than 'To' date.",
      });
      return;
    }
    await getInquiryReportByStatus(from, to);
  };
  // const applyRange = async (type: string) => {
  //   const { from, to } = getDateRange(type);

  //   const f = formatDate(from);
  //   const t = formatDate(to);

  //   setFrom(f);
  //   setTo(t);

  //   await getInquiryReportByStatus(f, t);
  // };
  const applyRange = async (filterKey: string) => {
    const filter = FILTERS.find((f) => f.key === filterKey);

    if (!filter) return;

    const { from, to } = filter.getRange();

    const f = formatDate(from);
    const t = formatDate(to);

    setFrom(f);
    setTo(t);

    setActiveFilter(filterKey);

    await getInquiryReportByStatus(f, t);
  };

  const chartData = data ? transformInquiryData(data) : [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Inquiry Status</h3>
      {/* ───── Filters ───── */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter.key}
            size="sm"
            variant={activeFilter === filter.key ? "primary" : "ghost"}
            onClick={() => applyRange(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="grid lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-2">
        <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
          <Input
            label="From"
            inputName="from"
            inputType="date"
            inputValue={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From date"
            showLabel={false}
          />
        </div>
        <div className="text-text font-semibold text-2xl w-full flex items-center justify-center col-span-1">
          →
        </div>
        <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
          <Input
            label="To"
            inputName="to"
            inputType="date"
            inputValue={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To date"
            showLabel={false}
          />
        </div>
        <div className="col-span-1 flex items-end justify-end">
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {/* {loading ? <ButtonLoader/> : <RefreshCcw/>} */}
            <RefreshCcw className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* ───── Error ───── */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* ───── Chart ───── */}
      {loading && chartData.length < 0 ? (
        <CommonLoader fullScreen={false} overlay={true} />
      ) : (
        <InquiryStatusChart data={chartData} loading={loading} />
      )}

      {/* ───── Empty State ───── */}
      {!loading && chartData.length === 0 && (
        <div className="text-sm text-gray-400">
          No data available for selected range
        </div>
      )}
    </div>
  );
}
