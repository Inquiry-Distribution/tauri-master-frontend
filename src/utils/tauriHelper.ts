import { save } from "@tauri-apps/plugin-dialog";
import { UploadedFile } from "../components/ui/form/fileUpload";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";

export const downloadFile = async (file: UploadedFile) => {
  const name = file.file.name;

  // =========================
  // 🟣 TAURI VERSION
  // =========================
  if ("__TAURI_INTERNALS__" in window) {
    const path = await save({
      defaultPath: name,
      filters: [
        {
          name: "All Files",
          extensions: ["*"],
        },
      ],
    });

    if (!path) return;

    // If we have real disk path (drag-drop case)
    if (file.path) {
      const bytes = await readFile(file.path);
      await writeFile(path, bytes);
      return;
    }

    // fallback: browser-created file
    const buffer = await file.file.arrayBuffer();
    await writeFile(path, new Uint8Array(buffer));
    return;
  }

  // =========================
  // 🌐 BROWSER VERSION
  // =========================
  const url = URL.createObjectURL(file.file);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
