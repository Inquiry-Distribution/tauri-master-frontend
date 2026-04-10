import { Card } from "@/src/components/ui/card";
import { useTheme } from "@/src/contexts";
import { Eye } from "lucide-react";
import React from "react";
import InquiryForm from "./_form";
import { useNavigate } from "react-router-dom";

const CreateInquiry = () => {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Inquiries Management
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            View, distribute and track all incoming inquiries.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/inquiries")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Eye size={18} />
            View Inquiry
          </button>
        </div>
      </div>

      <Card>
        <InquiryForm />
      </Card>
    </div>
  );
};

export default CreateInquiry;
