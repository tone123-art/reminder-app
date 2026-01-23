 export function formatDateOnly(isoOrYmd: string | null) {
        if (!isoOrYmd) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrYmd)) {
    const [y, m, d] = isoOrYmd.split("-").map(Number);
    const dt = new Date(y, m - 1, d); // local midnight
    return dt.toLocaleDateString("de-DE").split(" ")[0];
  }

  const dt = new Date(isoOrYmd);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("de-DE").split(" ")[0].slice(0,-1);
}




