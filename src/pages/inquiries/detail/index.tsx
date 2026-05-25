import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import ReassignInquiryModal from "@/src/components/ui/distributeInquiry/reassignInquiry/reassignInquiry";
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
import Lightbox from "@/src/components/ui/lightbox";
import { Modal } from "@/src/components/ui/modal";
import { useTheme } from "@/src/contexts";
import { useGetInquiryById } from "@/src/hooks/inquiry/useGetInquiryById";
import { Inquiry, InquiryNote } from "@/src/types/inquiry";
import { formatDateTime } from "@/src/utils/utils";
import { Download, Edit, Eye, Trash, UserRoundX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditInquiryForm from "../edit/_form";
import { useUnassignInquiry } from "@/src/hooks/inquiry/useUnassignInquiry";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import { writeFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import { tempDir } from "@tauri-apps/api/path";
import { m } from "motion/react";
import { useImageDeleteInquiry } from "@/src/hooks/inquiry/useImageDeleteInquiry";

const toUrl = (path: string) =>
  `${import.meta.env.VITE_PUBLIC_ASSET_URL}` + path;

export default function InquiryDetailPage() {
  const { id } = useParams();

  const { isDark } = useTheme();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    file: Inquiry["images"][number] | null;
  } | null>(null);

  // const openAttachment = async (img: any) => {
  //   const url = toUrl(img.url);
  //   await open(url);
  //   // window.open(url, "_blank"); // or use Tauri open if needed
  // };
  const openAttachment = async (img: any) => {
    try {
      const url = toUrl(img.url);

      // fetch remote file
      const response = await fetch(url, {
        credentials: "include",
      });

      const blob = await response.blob();
      const buffer = new Uint8Array(await blob.arrayBuffer());

      // create temp file path
      const tempPath = `${await tempDir()}${img.filename}`;

      // save locally
      await writeFile(tempPath, buffer);

      // open with native app
      await open(tempPath);
    } catch (err) {
      console.error("Open attachment failed:", err);
    }
  };
  const downloadAttachment = async (img: any) => {
    try {
      const url = toUrl(img.url);

      // Open native save dialog
      const filePath = await save({
        defaultPath: img.filename || "file",
      });

      if (!filePath) return; // user cancelled

      // Fetch file
      const response = await fetch(url);
      const blob = await response.blob();

      // Convert blob to Uint8Array
      const buffer = new Uint8Array(await blob.arrayBuffer());

      // Save file natively
      await writeFile(filePath, buffer);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  const {
    unassignInquiry,
    loading: unassignLoading,
    error: unassignError,
  } = useUnassignInquiry();
  const {
    deleteImageInquiry,
    loading: deleteLoading,
    error: deleteError,
  } = useImageDeleteInquiry();

  //   const inquiry = MOCK_INQUIRY; // swap with useQuery / useFetch hook
  const {
    data: inquiry,
    setData: setInquiry,
    loading,
    error,
    getInquiryById,
  } = useGetInquiryById();
  const shortId = inquiry?.id.slice(0, 8).toUpperCase() ?? "";

  useEffect(() => {
    if (id) {
      getInquiryById(id);
    }
  }, [id, getInquiryById]);

  const isPreviewableMedia = (file: any) => {
    const name = file?.filename?.toLowerCase() || "";

    return (
      name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|mp4|webm|ogg|mov)$/i) !==
      null
    );
  };

  const mediaFiles =
    inquiry?.images?.filter((file: any) => isPreviewableMedia(file)) || [];

  const otherFiles =
    inquiry?.images?.filter((file: any) => !isPreviewableMedia(file)) || [];

  // const lightboxItems =
  //   inquiry?.images?.map((img: any) => ({
  //     url: toUrl(img.url), // adjust if backend needs full URL
  //     name: img.filename,
  //   })) || [];
  const lightboxItems = mediaFiles.map((img: any) => ({
    url: toUrl(img.url),
    name: img.filename,
  }));
  const handleUnassign = async () => {
    if (!id) {
      return;
    }
    Swal.fire({
      title: "Are you sure you want to unassign this inquiry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await unassignInquiry(id!);
          setInquiry({ ...inquiry, status: "unassigned", assignedTo: null });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Failed to unassign inquiry",
            text: unassignError || "Please try again later",
          });
          console.error(err);
        }
        setInquiry({ ...inquiry, status: "unassigned", assignedTo: null });
      }
    });
  };
  const handleDeleteFile = async (imageId: string) => {
    if (!id || !inquiry) return;

    const previousImages = inquiry.images || [];

    const result = await Swal.fire({
      title: "Are you sure you want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteImageInquiry(id, imageId);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "File deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      // ✅ Optimistically remove from UI immediately
      setInquiry((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          images: prev.images?.filter((img: any) => img.id !== imageId) || [],
        };
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete file",
        text: deleteError || "Please try again later",
      });
      console.error(err);

      // // ❌ Rollback if API fails
      // setInquiry((prev: any) => {
      //   if (!prev) return prev;

      //   return {
      //     ...prev,
      //     images: previousImages,
      //   };
      // });

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Could not delete the file.",
      });
    }
  };
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
          {inquiry?.status === "assigned" && (
            <Button variant="secondary" onClick={handleUnassign}>
              <span className="flex items-center gap-1.5">
                {/* {Icon.refresh} */}
                <UserRoundX size={20} />
                Unassign
              </span>
            </Button>
          )}
          <Button variant="secondary" onClick={() => setIsReassignOpen(true)}>
            <span className="flex items-center gap-1.5">
              {Icon.refresh}
              {inquiry?.status === "assigned" ? "Reassign" : "Assign"}
            </span>
          </Button>
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <span className="flex items-center gap-1.5">
              <Edit size={20} /> Edit
            </span>
          </Button>
          {/* <Button variant="primary">Mark as Closed</Button> */}
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
            <div
              className="line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(inquiry.description),
              }}
            ></div>
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
            <p
              className="text-sm text-(--text) leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  inquiry?.description || (
                    <span className="text-(--textMuted) italic">
                      No description provided.
                    </span>
                  ),
                ),
              }}
            ></p>
          </Card>

          {/* Attached images */}
          {inquiry?.images?.length > 0 && (
            <Card>
              <SectionHeading>
                Attachments ({inquiry?.images?.length ?? 0})
              </SectionHeading>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaFiles.map((img: Inquiry["images"][number], i: number) => (
                  <div
                    key={img.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({
                        x: e.clientX,
                        y: e.clientY,
                        file: img,
                      });
                    }}
                  >
                    <ImageThumb img={img} />
                  </div>
                ))}
                {otherFiles.map((img: Inquiry["images"][number], i: number) => (
                  <div
                    key={img.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({
                        x: e.clientX,
                        y: e.clientY,
                        file: img,
                      });
                    }}
                  >
                    <ImageThumb img={img} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionHeading>Notes</SectionHeading>
              {/* <button className="text-xs text-(--accent) hover:underline font-medium">
                + Add note
              </button> */}
            </div>
            {inquiry?.notes?.length === 0 ? (
              <div
                className="rounded-lg p-4 text-center"
                style={{ background: "var(--surfaceElevated)" }}
              >
                <p className="text-sm text-(--textMuted)">No notes yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {inquiry?.notes?.map((note: InquiryNote) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg border border-(--border) bg-(--surface)"
                  >
                    <p className="text-sm text-(--text)">{note.text}</p>

                    <div className="mt-1 text-xs text-(--textMuted)">
                      {note.addedBy?.name} · {formatDateTime(note.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
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
      {isReassignOpen && inquiry?.id && (
        <ReassignInquiryModal
          inquiryId={inquiry.id}
          assignedTo={inquiry.assignedTo}
          onClose={() => setIsReassignOpen(false)}
          onSuccess={() => {
            // optional: refetch inquiry after reassignment
            getInquiryById(inquiry.id);
          }}
        />
      )}
      {isEditOpen && inquiry && (
        <Modal
          title="Edit Inquiry"
          onClose={() => setIsEditOpen(false)}
          width={600}
        >
          <EditInquiryForm
            initialData={inquiry}
            onClose={() => setIsEditOpen(false)}
            onSuccess={(updated) => {
              setIsEditOpen(false);

              // 👇 optimistic UI update
              if (updated) {
                // depends on your hook implementation
                // assuming `setData` exists
                setInquiry(updated);
              }
            }}
          />
        </Modal>
      )}

      <Lightbox
        items={lightboxItems}
        open={lightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        // onDelete={(i) => {

        //   // optional: call API + refetch
        //   // deleteInquiryImage(inquiry.id, lightboxItems[i].id)

        //   setLightboxOpen(false);
        // }}
      />

      {menu?.file && (
        <div
          className="rounded-xl"
          style={{
            position: "fixed",
            top: menu.y,
            left: menu.x,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 9999,
            minWidth: 160,
            overflow: "hidden",
          }}
          onMouseLeave={() => setMenu(null)}
        >
          {/* <button
            className="w-full text-left px-3 py-2 text-sm"
            onClick={() => {
              openAttachment(inquiry.images[menu.index!]);
              setMenu(null);
            }}
          >
            <Eye className="inline-block" size={14} /> Open
          </button> */}

          <button
            className="w-full text-left px-3 py-2 text-sm"
            onClick={() => {
              downloadAttachment(menu.file);
              setMenu(null);
            }}
          >
            <Download className="inline-block" size={14} /> Download
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm text-danger"
            onClick={() => {
              // downloadAttachment(menu.file);
              if (menu?.file?.id) {
                handleDeleteFile(menu.file.id);
              }
              setMenu(null);
            }}
          >
            <Trash className="inline-block text-danger" size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
