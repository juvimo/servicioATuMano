/* ─── Helpers ─── */
export const fmtCOP = (n) => "$" + Number(n).toLocaleString("es-CO");

export function exportCSV(data, nombre) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).filter(k => k !== "_id");
  const rows = data.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href = url; a.download = nombre + ".csv"; a.click();
  URL.revokeObjectURL(url);
}
