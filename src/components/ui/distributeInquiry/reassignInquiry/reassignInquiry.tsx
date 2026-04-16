import { Modal } from "@/src/components/ui/modal";
import { InquiryDistributor } from "@/src/components/ui/distributeInquiry/inquiryDistribution";

import { useReassignInquiry } from "@/src/hooks/inquiry/useReassignInquiry";
import Swal from "sweetalert2";
import CommonLoader from "../../loader/loader";

interface Props {
  inquiryId: string;
  assignedTo?: { id: string } | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReassignInquiryModal({
  inquiryId,
  assignedTo,
  onClose,
  onSuccess,
}: Props) {
  const { reassignInquiry, loading } = useReassignInquiry();

  const handleConfirm = async (salesPersonId: string) => {
    try {
      await reassignInquiry(inquiryId, { salesPersonId });

      Swal.fire({
        icon: "success",
        title: assignedTo
          ? "Inquiry reassigned successfully"
          : "Inquiry assigned successfully",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update inquiry",
      });
    }
  };

  return (
    <Modal title="Assign Inquiry" onClose={onClose} width={900}>
      <InquiryDistributor
        defaultSelectedId={assignedTo?.id || null}
        onConfirmShare={handleConfirm}
        loading={loading}
      />
    </Modal>
  );
}
