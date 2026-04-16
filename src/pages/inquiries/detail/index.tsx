import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Icon } from "@/src/components/ui/inquiryDetail/icons";
import {
  Divider,
  ImageThumb,
  MetaRow,
  PriorityBadge,
  SectionHeading,
  StatusBadge,
  TimelineItem,
} from "@/src/components/ui/inquiryDetail/inquiryDetailComp";
import { useTheme } from "@/src/contexts";
import { useGetInquiryById } from "@/src/hooks/inquiry/useGetInquiryById";
import { Inquiry } from "@/src/types/inquiry";
import { formatDateTime } from "@/src/utils/utils";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// const MOCK_INQUIRY: Inquiry = {
//   id: "602a1d67-5545-4ef4-8d02-72e379b9bb37",
//   title: null,
//   description: "abalsdjlk",
//   type: "text_image",
//   source: null,
//   status: "assigned",
//   priority: "medium",
//   mobile: "1231231231",
//   inquiryTime: "12:34",
//   assignedToId: "a826acc6-8742-481a-b145-b6a25fd07aa4",
//   assignedById: "1adeea63-7be7-413f-a35a-06c201610529",
//   assignedAt: "2026-04-14T10:48:07.024Z",
//   uploadedById: "1adeea63-7be7-413f-a35a-06c201610529",
//   visibleUntil: "2026-04-15T10:48:07.024Z",
//   isConverted: false,
//   convertedAt: null,
//   createdAt: "2026-04-14T10:48:07.029Z",
//   updatedAt: "2026-04-14T10:48:07.029Z",
//   assignedTo: {
//     id: "a826acc6-8742-481a-b145-b6a25fd07aa4",
//     name: "Sneha Joshi",
//     email: "sneha@inquiry.com",
//   },
//   assignedBy: {
//     id: "1adeea63-7be7-413f-a35a-06c201610529",
//     name: "Rajesh Kumar",
//   },
//   uploadedBy: {
//     id: "1adeea63-7be7-413f-a35a-06c201610529",
//     name: "Rajesh Kumar",
//   },
//   images: [
//     {
//       id: "d20a92bb-567e-4d81-aca5-6af7ba01d350",
//       inquiryId: "602a1d67-5545-4ef4-8d02-72e379b9bb37",
//       url: "uploads\\inquiries\\5d56462f-276e-473c-92ae-7dfefdd46019.png",
//       filename: "uploads\\inquiries\\5d56462f-276e-473c-92ae-7dfefdd46019.png",
//       size: null,
//       createdAt: "2026-04-14T10:48:07.029Z",
//     },
//   ],
//   notes: [],
//   statusHistory: [
//     {
//       id: "903869ad-e590-4ccd-858a-74656ab781f0",
//       inquiryId: "602a1d67-5545-4ef4-8d02-72e379b9bb37",
//       status: "assigned",
//       changedById: "1adeea63-7be7-413f-a35a-06c201610529",
//       changedAt: "2026-04-14T10:48:07.055Z",
//       changedBy: {
//         id: "1adeea63-7be7-413f-a35a-06c201610529",
//         name: "Rajesh Kumar",
//       },
//     },
//   ],
// };

export default function InquiryDetailPage() {
  const { id } = useParams();

  const { isDark } = useTheme();
  //   const inquiry = MOCK_INQUIRY; // swap with useQuery / useFetch hook
  const { data: inquiry, loading, error, getInquiryById } = useGetInquiryById();
  const shortId = inquiry?.id.slice(0, 8).toUpperCase() ?? "";

  useEffect(() => {
    if (id) {
      getInquiryById(id);
    }
  }, [id, getInquiryById]);

  return (
    <div
      className="min-h-screen px-4 py-6 md:px-8 md:py-8"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Breadcrumb / back bar ─────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center gap-2 text-sm text-(--textMuted) hover:text-(--text) transition-colors"
          onClick={() => history.back()}
        >
          {Icon.back}
          <span>Back to Inquiries</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <span className="flex items-center gap-1.5">
              {Icon.refresh}
              Reassign
            </span>
          </Button>
          <Button variant="primary">Mark as Closed</Button>
        </div>
      </div>

      {/* ── Page header ──────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold text-(--accent) tracking-wider">
            #{shortId}
          </span>
          <StatusBadge status={inquiry?.status} isDark={isDark} />
          <PriorityBadge priority={inquiry?.priority} isDark={isDark} />
          {!inquiry?.isConverted && (
            <span className="text-[11px] px-2 py-0.5 rounded text-(--textMuted) border border-(--border)">
              Not Converted
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-(--text) mt-1 ">
          {inquiry?.title ? (
            inquiry.title
          ) : inquiry?.description ? (
            <div className="line-clamp-1">{inquiry.description}</div>
          ) : (
            "Untitled Inquiry"
          )}
        </h1>
        <p className="text-sm text-(--textMuted) mt-0.5">
          Created {formatDateTime(inquiry?.createdAt)} · Last updated{" "}
          {formatDateTime(inquiry?.updatedAt)}
        </p>
      </div>

      {/* ── Two-column layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT – main content (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Description */}
          <Card>
            <SectionHeading>Description</SectionHeading>
            <p className="text-sm text-(--text) leading-relaxed whitespace-pre-wrap">
              {inquiry?.description || (
                <span className="text-(--textMuted) italic">
                  No description provided.
                </span>
              )}
            </p>
          </Card>

          {/* Attached images */}
          {inquiry?.images?.length > 0 && (
            <Card>
              <SectionHeading>
                Attachments ({inquiry?.images?.length ?? 0})
              </SectionHeading>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {inquiry?.images?.map((img: Inquiry["images"][number]) => (
                  <>
                    {/* <pre>{JSON.stringify(img)}</pre> */}
                    <ImageThumb key={img.id} img={img} />
                  </>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionHeading>Notes</SectionHeading>
              <button className="text-xs text-(--accent) hover:underline font-medium">
                + Add note
              </button>
            </div>
            {inquiry?.notes.length === 0 ? (
              <div
                className="rounded-lg p-4 text-center"
                style={{ background: "var(--surfaceElevated)" }}
              >
                <p className="text-sm text-(--textMuted)">No notes yet.</p>
              </div>
            ) : (
              <div className="space-y-2">{/* map notes here */}</div>
            )}
          </Card>

          {/* Status history */}
          <Card>
            <SectionHeading>Status History</SectionHeading>
            {inquiry?.statusHistory?.length === 0 ? (
              <p className="text-sm text-(--textMuted)">
                No history available.
              </p>
            ) : (
              <div className="mt-1">
                {inquiry?.statusHistory.map(
                  (entry: Inquiry["statusHistory"][number], i: number) => (
                    <TimelineItem
                      key={entry.id}
                      entry={entry}
                      isLast={i === inquiry?.statusHistory.length - 1}
                    />
                  ),
                )}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT – sidebar (1/3 width) */}
        <div className="flex flex-col gap-5">
          {/* Assignee */}
          <Card>
            <SectionHeading>Assignment</SectionHeading>

            {/* Assigned to */}
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-widest font-medium text-(--textMuted) mb-2">
                Assigned to
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  name={inquiry?.assignedTo?.name || "—"}
                  size="md"
                  variant="solid"
                  showName={false}
                />
                <div>
                  <p className="text-sm font-semibold text-(--text)">
                    {inquiry?.assignedTo?.name || "—"}
                  </p>
                  <p className="text-xs text-(--textMuted)">
                    {inquiry?.assignedTo?.email || "—"}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Assigned by */}
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-widest font-medium text-(--textMuted) mb-2">
                Assigned by
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  name={inquiry?.assignedBy?.name || "—"}
                  size="sm"
                  variant="solid"
                  showName={false}
                />
                <p className="text-sm text-(--text) font-medium">
                  {inquiry?.assignedBy?.name || "—"}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <MetaRow
                icon={Icon.calendar}
                label="Assigned at"
                value={formatDateTime(inquiry?.assignedAt || "—")}
              />
            </div>
          </Card>

          {/* Inquiry details */}
          <Card>
            <SectionHeading>Details</SectionHeading>

            <MetaRow
              icon={Icon.phone}
              label="Mobile"
              value={inquiry?.mobile || "—"}
            />
            <Divider />
            <MetaRow
              icon={Icon.clock}
              label="Inquiry time"
              value={inquiry?.inquiryTime || "—"}
            />
            <Divider />
            <MetaRow
              icon={Icon.tag}
              label="Type"
              value={
                <span className="capitalize">
                  {inquiry?.type?.replace("_", " ")}
                </span>
              }
            />
            <Divider />
            <MetaRow
              icon={Icon.tag}
              label="Source"
              value={
                inquiry?.source ?? (
                  <span className="text-(--textMuted) italic text-xs">
                    None
                  </span>
                )
              }
            />
          </Card>

          {/* Visibility & lifecycle */}
          <Card>
            <SectionHeading>Lifecycle</SectionHeading>

            <MetaRow
              icon={Icon.calendar}
              label="Created at"
              value={formatDateTime(inquiry?.createdAt)}
            />
            <Divider />
            <MetaRow
              icon={Icon.eye}
              label="Visible until"
              value={formatDateTime(inquiry?.visibleUntil || "—")}
            />
            <Divider />
            <MetaRow
              icon={Icon.user}
              label="Uploaded by"
              value={inquiry?.uploadedBy.name}
            />
            <Divider />
            <MetaRow
              icon={Icon.refresh}
              label="Converted"
              value={
                inquiry?.isConverted ? (
                  <span className="text-green-500 font-semibold">Yes</span>
                ) : (
                  <span className="text-(--textMuted)">No</span>
                )
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
