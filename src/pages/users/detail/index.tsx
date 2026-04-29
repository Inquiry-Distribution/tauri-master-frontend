import React, { useEffect, useState } from "react";

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
import { Button } from "@/src/components/ui/button";
import { useTheme } from "@/src/contexts";
import { useParams } from "react-router-dom";
import { useGetSalesPersonById } from "@/src/hooks/salesPerson/useGetSalesPerson";
import SectionLoader from "@/src/components/ui/loader/sectionLoader";

export default function SalesPersonDetailPage() {
  const { id } = useParams();
  const { tokens } = useTheme();

  const { getSalesPersonById, loading, error } = useGetSalesPersonById();

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
          <Button onClick={() => {}}>
            <Download size={18} />
          </Button>
        </div>
      </div>

      {/* ❌ Error State */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* ⏳ Loading State */}
      {loading ? <SectionLoader height="80%" /> : <></>}
    </div>
  );
}
