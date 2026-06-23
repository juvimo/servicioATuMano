import * as XLSX from 'xlsx-js-style';

export const fmtCOP = (n) => "$" + Number(n).toLocaleString("es-CO");

function thinBorder(rgb) {
  const b = { style: 'thin', color: { rgb } };
  return { top: b, bottom: b, left: b, right: b };
}

export function exportExcel(data, nombre) {
  if (!data.length) return;
  const wb   = XLSX.utils.book_new();
  const ws   = {};
  const headers = Object.keys(data[0]).filter(k => k !== "_id");
  const fecha   = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const enc     = (r, c) => XLSX.utils.encode_cell({ r, c });

  /* ── Título ── */
  ws[enc(0, 0)] = {
    v: `${nombre.toUpperCase()} — ${fecha}`,
    s: {
      fill: { fgColor: { rgb: '0369A1' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 13 },
      alignment: { horizontal: 'center', vertical: 'center' },
    },
    t: 's',
  };
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
  ws['!rows']   = [{ hpt: 28 }];

  /* ── Encabezados ── */
  headers.forEach((h, i) => {
    ws[enc(2, i)] = {
      v: h.charAt(0).toUpperCase() + h.slice(1).replace(/_/g, ' '),
      s: {
        fill: { fgColor: { rgb: '075985' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: thinBorder('BFDBFE'),
      },
      t: 's',
    };
  });

  /* ── Datos ── */
  data.forEach((row, ri) => {
    const alt = ri % 2 === 1;
    headers.forEach((h, ci) => {
      const val   = row[h] ?? '';
      const isNum = typeof val === 'number';
      ws[enc(ri + 3, ci)] = {
        v: val,
        s: {
          fill: { fgColor: { rgb: alt ? 'F0F9FF' : 'FFFFFF' } },
          font: { sz: 10, color: { rgb: '1E293B' } },
          alignment: { vertical: 'center', wrapText: true },
          border: thinBorder('DBEAFE'),
        },
        t: isNum ? 'n' : 's',
      };
    });
  });

  /* ── Fila de total (si hay columna monto) ── */
  const colMonto = headers.findIndex(h => h.toLowerCase().includes('monto'));
  if (colMonto >= 0) {
    const tr    = data.length + 3;
    const total = data.reduce((s, r) => s + Number(r[headers[colMonto]] || 0), 0);

    ws[enc(tr, 0)] = {
      v: 'TOTAL',
      s: {
        fill: { fgColor: { rgb: 'DBEAFE' } },
        font: { bold: true, sz: 10, color: { rgb: '0C1A2E' } },
        border: thinBorder('93C5FD'),
        alignment: { vertical: 'center' },
      },
      t: 's',
    };
    ws['!merges'].push({ s: { r: tr, c: 0 }, e: { r: tr, c: Math.max(0, colMonto - 1) } });

    ws[enc(tr, colMonto)] = {
      v: total,
      s: {
        fill: { fgColor: { rgb: 'DBEAFE' } },
        font: { bold: true, sz: 10, color: { rgb: '0C1A2E' } },
        alignment: { horizontal: 'right', vertical: 'center' },
        border: thinBorder('93C5FD'),
        numFmt: '"$"#,##0',
      },
      t: 'n',
    };

    for (let ci = colMonto + 1; ci < headers.length; ci++) {
      ws[enc(tr, ci)] = {
        v: '',
        s: { fill: { fgColor: { rgb: 'DBEAFE' } }, border: thinBorder('93C5FD') },
        t: 's',
      };
    }
  }

  /* ── Anchos de columna ── */
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 6, 18) }));

  /* ── Rango ── */
  const refs = Object.keys(ws).filter(k => !k.startsWith('!'));
  if (refs.length) {
    let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
    refs.forEach(k => {
      const { r, c } = XLSX.utils.decode_cell(k);
      if (r < minR) minR = r; if (c < minC) minC = c;
      if (r > maxR) maxR = r; if (c > maxC) maxC = c;
    });
    ws['!ref'] = XLSX.utils.encode_range({ s: { r: minR, c: minC }, e: { r: maxR, c: maxC } });
  }

  XLSX.utils.book_append_sheet(wb, ws, nombre.slice(0, 31));
  XLSX.writeFile(wb, `${nombre}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
