export function renderMeta(meta: Record<string, any>) {
  return Object.entries(meta).map(([key, value]) => {
    return (
      <div key={key} className="flex flex-wrap gap-1">
        <span className="font-medium capitalize">{formatKey(key)}:</span>
        <span>{formatValue(value)}</span>
      </div>
    );
  });
}

export function formatKey(key: string) {
  return key.replace(/([A-Z])/g, " $1");
}

export function formatValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

// ── Helpers ─────────────────────────────

export function formatAction(action: string) {
  return action
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getActionBg(action: string) {
  switch (action) {
    case "USER_LOGIN":
      return "#DCFCE7"; // green
    case "DEVICE_RESET":
      return "#FEE2E2"; // red
    case "INQUIRY_DISTRIBUTED":
      return "#DBEAFE"; // blue
    case "INQUIRY_UNASSIGNED":
      return "#FEF3C7"; // yellow
    default:
      return "#F3F4F6"; // gray
  }
}

export function hasMeta(meta: Record<string, any> | null | undefined) {
  return meta && Object.keys(meta).length > 0;
}
