import * as XLSX from 'xlsx-js-style';

// ── Border helpers ────────────────────────────────────────────
function thin(rgb) {
  const b = { style: 'thin', color: { rgb } };
  return { top: b, bottom: b, left: b, right: b };
}
function medium(rgb) {
  const b = { style: 'medium', color: { rgb } };
  return { top: b, bottom: b, left: b, right: b };
}

// ── Shared styles ─────────────────────────────────────────────
const ST = {
  title: {
    fill: { fgColor: { rgb: '0369A1' } },
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  },
  subtitle: {
    fill: { fgColor: { rgb: '0EA5E9' } },
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  header: {
    fill: { fgColor: { rgb: '075985' } },
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thin('BFDBFE'),
  },
  cell: {
    font: { sz: 10, color: { rgb: '1E293B' } },
    alignment: { vertical: 'center', wrapText: true },
    border: thin('DBEAFE'),
  },
  cellAlt: {
    fill: { fgColor: { rgb: 'F0F9FF' } },
    font: { sz: 10, color: { rgb: '1E293B' } },
    alignment: { vertical: 'center', wrapText: true },
    border: thin('DBEAFE'),
  },
  cellCenter: {
    font: { sz: 10, color: { rgb: '1E293B' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thin('DBEAFE'),
  },
  cellCenterAlt: {
    fill: { fgColor: { rgb: 'F0F9FF' } },
    font: { sz: 10, color: { rgb: '1E293B' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thin('DBEAFE'),
  },
  total: {
    fill: { fgColor: { rgb: 'DBEAFE' } },
    font: { bold: true, sz: 10, color: { rgb: '0C1A2E' } },
    alignment: { vertical: 'center' },
    border: medium('93C5FD'),
  },
  totalMoney: {
    fill: { fgColor: { rgb: 'DBEAFE' } },
    font: { bold: true, sz: 10, color: { rgb: '0C1A2E' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: medium('93C5FD'),
    numFmt: '"$"#,##0',
  },
  moneyPos: {
    font: { sz: 10, color: { rgb: '15803D' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: thin('DBEAFE'),
    numFmt: '"$"#,##0',
  },
  moneyPosAlt: {
    fill: { fgColor: { rgb: 'F0F9FF' } },
    font: { sz: 10, color: { rgb: '15803D' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: thin('DBEAFE'),
    numFmt: '"$"#,##0',
  },
  moneyNeg: {
    font: { sz: 10, color: { rgb: 'DC2626' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: thin('DBEAFE'),
    numFmt: '"$"#,##0',
  },
  moneyNegAlt: {
    fill: { fgColor: { rgb: 'F0F9FF' } },
    font: { sz: 10, color: { rgb: 'DC2626' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: thin('DBEAFE'),
    numFmt: '"$"#,##0',
  },
};

// ── Cell / merge / range helpers ──────────────────────────────
function C(ws, row, col, value, style, type) {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });
  ws[addr] = { v: value, s: style, t: type ?? (typeof value === 'number' ? 'n' : 's') };
}

function M(ws, r1, c1, r2, c2) {
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({ s: { r: r1, c: c1 }, e: { r: r2, c: c2 } });
}

function fixRange(ws) {
  const refs = Object.keys(ws).filter(k => !k.startsWith('!'));
  if (!refs.length) return;
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  refs.forEach(k => {
    const { r, c } = XLSX.utils.decode_cell(k);
    if (r < minR) minR = r; if (c < minC) minC = c;
    if (r > maxR) maxR = r; if (c > maxC) maxC = c;
  });
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: minR, c: minC }, e: { r: maxR, c: maxC } });
}

function toNum(v) { return Number(v) || 0; }

function badgeStyle(rgb) {
  return {
    fill: { fgColor: { rgb } },
    font: { sz: 9, bold: true, color: { rgb: '1E293B' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thin('DBEAFE'),
  };
}

// ── Sheet: Resumen Ejecutivo ──────────────────────────────────
function sheetResumen({ ingresos, gastos, cotizaciones, clientes, servicios, fecha }) {
  const ws = {};
  const totalIng = ingresos.reduce((s, i) => s + toNum(i.monto), 0);
  const totalGas = gastos.reduce((s, g) => s + toNum(g.monto), 0);
  const utilidad  = totalIng - totalGas;
  const cotPend   = cotizaciones.filter(c => c.estado === 'Pendiente').length;
  const svcComp   = servicios.filter(sv => sv.completada).length;
  const NCOLS = 4;
  let r = 0;

  C(ws, r, 0, `INFORME EJECUTIVO — ${fecha}`, ST.title);
  M(ws, r, 0, r, NCOLS - 1);
  ws['!rows'] = [{ hpt: 32 }];
  r += 2;

  C(ws, r, 0, 'INDICADOR', ST.header);
  C(ws, r, 1, 'VALOR',     ST.header);
  C(ws, r, 2, 'DETALLE',   ST.header); M(ws, r, 2, r, NCOLS - 1);
  r++;

  const kpis = [
    ['Ingresos del Mes',        totalIng,        `${ingresos.length} transacciones`,       'pos'],
    ['Gastos del Mes',          totalGas,        `${gastos.length} registros`,             'neg'],
    ['Utilidad Neta',           utilidad,        utilidad >= 0 ? 'Balance positivo' : 'Balance negativo', utilidad >= 0 ? 'pos' : 'neg'],
    ['Servicios Completados',   svcComp,         `de ${servicios.length} en total`,        ''],
    ['Cotizaciones Pendientes', cotPend,         `de ${cotizaciones.length} recibidas`,    ''],
    ['Clientes Registrados',    clientes.length, 'en base de datos',                       ''],
  ];

  kpis.forEach(([label, val, det, tipo], i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, label, alt ? ST.cellAlt : ST.cell);
    if (tipo === 'pos') C(ws, r, 1, val, alt ? ST.moneyPosAlt : ST.moneyPos, 'n');
    else if (tipo === 'neg') C(ws, r, 1, val, alt ? ST.moneyNegAlt : ST.moneyNeg, 'n');
    else C(ws, r, 1, val, alt ? ST.cellAlt : ST.cell, 'n');
    C(ws, r, 2, det, alt ? ST.cellAlt : ST.cell); M(ws, r, 2, r, NCOLS - 1);
    r++;
  });

  r++;
  C(ws, r, 0, 'INGRESOS POR CATEGORÍA', ST.subtitle); M(ws, r, 0, r, 2); r++;
  C(ws, r, 0, 'Categoría', ST.header); C(ws, r, 1, 'Total ($)', ST.header); C(ws, r, 2, '# Reg.', ST.header); r++;
  const catIng = {};
  ingresos.forEach(i => { catIng[i.categoria] = (catIng[i.categoria] || 0) + toNum(i.monto); });
  Object.entries(catIng).forEach(([cat, tot], i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, cat, alt ? ST.cellAlt : ST.cell);
    C(ws, r, 1, tot, alt ? ST.moneyPosAlt : ST.moneyPos, 'n');
    C(ws, r, 2, ingresos.filter(x => x.categoria === cat).length, alt ? ST.cellAlt : ST.cell, 'n');
    r++;
  });
  C(ws, r, 0, 'TOTAL', ST.total);
  C(ws, r, 1, totalIng, ST.totalMoney, 'n');
  C(ws, r, 2, ingresos.length, ST.total, 'n');
  r += 2;

  C(ws, r, 0, 'GASTOS POR CATEGORÍA', ST.subtitle); M(ws, r, 0, r, 2); r++;
  C(ws, r, 0, 'Categoría', ST.header); C(ws, r, 1, 'Total ($)', ST.header); C(ws, r, 2, '# Reg.', ST.header); r++;
  const catGas = {};
  gastos.forEach(g => { catGas[g.categoria] = (catGas[g.categoria] || 0) + toNum(g.monto); });
  Object.entries(catGas).forEach(([cat, tot], i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, cat, alt ? ST.cellAlt : ST.cell);
    C(ws, r, 1, tot, alt ? ST.moneyNegAlt : ST.moneyNeg, 'n');
    C(ws, r, 2, gastos.filter(x => x.categoria === cat).length, alt ? ST.cellAlt : ST.cell, 'n');
    r++;
  });
  C(ws, r, 0, 'TOTAL', ST.total);
  C(ws, r, 1, totalGas, ST.totalMoney, 'n');
  C(ws, r, 2, gastos.length, ST.total, 'n');

  ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 20 }, { wch: 16 }];
  fixRange(ws);
  return ws;
}

// ── Sheet: Ingresos ───────────────────────────────────────────
function sheetIngresos(ingresos, fecha) {
  const ws = {};
  const COLS = ['CONCEPTO', 'CATEGORÍA', 'MONTO ($)', 'FECHA', 'NOTA'];
  let r = 0;

  C(ws, r, 0, `INGRESOS — ${fecha}`, ST.title); M(ws, r, 0, r, COLS.length - 1); r += 2;
  COLS.forEach((col, i) => C(ws, r, i, col, ST.header)); r++;

  ingresos.forEach((ing, i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, ing.concepto,       alt ? ST.cellAlt    : ST.cell);
    C(ws, r, 1, ing.categoria,      alt ? ST.cellAlt    : ST.cell);
    C(ws, r, 2, toNum(ing.monto),   alt ? ST.moneyPosAlt : ST.moneyPos, 'n');
    C(ws, r, 3, ing.fecha ?? '',    alt ? ST.cellCenterAlt : ST.cellCenter);
    C(ws, r, 4, ing.nota ?? '',     alt ? ST.cellAlt    : ST.cell);
    r++;
  });

  const total = ingresos.reduce((s, i) => s + toNum(i.monto), 0);
  C(ws, r, 0, 'TOTAL', ST.total); M(ws, r, 0, r, 1);
  C(ws, r, 2, total, ST.totalMoney, 'n');
  C(ws, r, 3, '', ST.total); C(ws, r, 4, '', ST.total);

  ws['!cols'] = [{ wch: 30 }, { wch: 16 }, { wch: 16 }, { wch: 13 }, { wch: 28 }];
  fixRange(ws);
  return ws;
}

// ── Sheet: Gastos ─────────────────────────────────────────────
function sheetGastos(gastos, fecha) {
  const ws = {};
  const COLS = ['CONCEPTO', 'CATEGORÍA', 'MONTO ($)', 'FECHA', 'NOTA'];
  let r = 0;

  C(ws, r, 0, `GASTOS — ${fecha}`, ST.title); M(ws, r, 0, r, COLS.length - 1); r += 2;
  COLS.forEach((col, i) => C(ws, r, i, col, ST.header)); r++;

  gastos.forEach((g, i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, g.concepto,       alt ? ST.cellAlt    : ST.cell);
    C(ws, r, 1, g.categoria,      alt ? ST.cellAlt    : ST.cell);
    C(ws, r, 2, toNum(g.monto),   alt ? ST.moneyNegAlt : ST.moneyNeg, 'n');
    C(ws, r, 3, g.fecha ?? '',    alt ? ST.cellCenterAlt : ST.cellCenter);
    C(ws, r, 4, g.nota ?? '',     alt ? ST.cellAlt    : ST.cell);
    r++;
  });

  const total = gastos.reduce((s, g) => s + toNum(g.monto), 0);
  C(ws, r, 0, 'TOTAL', ST.total); M(ws, r, 0, r, 1);
  C(ws, r, 2, total, ST.totalMoney, 'n');
  C(ws, r, 3, '', ST.total); C(ws, r, 4, '', ST.total);

  ws['!cols'] = [{ wch: 30 }, { wch: 16 }, { wch: 16 }, { wch: 13 }, { wch: 28 }];
  fixRange(ws);
  return ws;
}

// ── Sheet: Cotizaciones ───────────────────────────────────────
const BADGE_COT = { Pendiente: 'FEF9C3', Confirmada: 'DCFCE7', Atendida: 'DBEAFE' };

function sheetCotizaciones(cotizaciones, fecha) {
  const ws = {};
  const COLS = ['CLIENTE', 'TELÉFONO', 'CORREO', 'SERVICIO', 'INFO ADICIONAL', 'FECHA', 'ESTADO'];
  let r = 0;

  C(ws, r, 0, `COTIZACIONES — ${fecha}`, ST.title); M(ws, r, 0, r, COLS.length - 1); r += 2;
  COLS.forEach((col, i) => C(ws, r, i, col, ST.header)); r++;

  cotizaciones.forEach((cot, i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, cot.nombre,       alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 1, cot.telefono,     alt ? ST.cellCenterAlt : ST.cellCenter);
    C(ws, r, 2, cot.correo,       alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 3, cot.servicio,     alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 4, cot.info ?? '',   alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 5, cot.fecha ?? '',  alt ? ST.cellCenterAlt : ST.cellCenter);
    C(ws, r, 6, cot.estado,       badgeStyle(BADGE_COT[cot.estado] || 'F1F5F9'));
    r++;
  });

  r++;
  ['Pendiente', 'Confirmada', 'Atendida'].forEach((estado, i) => {
    const cnt = cotizaciones.filter(c => c.estado === estado).length;
    C(ws, r, 0, estado, badgeStyle(Object.values(BADGE_COT)[i]));
    C(ws, r, 1, `${cnt} solicitudes`, ST.cell); M(ws, r, 1, r, 3);
    r++;
  });

  ws['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 26 }, { wch: 22 }, { wch: 28 }, { wch: 13 }, { wch: 13 }];
  fixRange(ws);
  return ws;
}

// ── Sheet: Clientes ───────────────────────────────────────────
function sheetClientes(clientes, fecha) {
  const ws = {};
  const COLS = ['NOMBRE', 'TELÉFONO', 'CORREO', '# SERVICIOS', 'TOTAL PAGADO', 'ÚLTIMA VISITA'];
  let r = 0;

  C(ws, r, 0, `CLIENTES — ${fecha}`, ST.title); M(ws, r, 0, r, COLS.length - 1); r += 2;
  COLS.forEach((col, i) => C(ws, r, i, col, ST.header)); r++;

  clientes.forEach((cl, i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, cl.nombre,              alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 1, cl.telefono,            alt ? ST.cellCenterAlt : ST.cellCenter);
    C(ws, r, 2, cl.correo,              alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 3, toNum(cl.servicios),    alt ? ST.cellCenterAlt : ST.cellCenter, 'n');
    C(ws, r, 4, cl.total ?? '',         alt ? ST.cellAlt       : ST.cell);
    C(ws, r, 5, cl.ultima ?? '',        alt ? ST.cellCenterAlt : ST.cellCenter);
    r++;
  });

  C(ws, r, 0, `${clientes.length} clientes registrados`, {
    ...ST.total, alignment: { horizontal: 'left', vertical: 'center' },
  });
  M(ws, r, 0, r, COLS.length - 1);

  ws['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 26 }, { wch: 13 }, { wch: 16 }, { wch: 15 }];
  fixRange(ws);
  return ws;
}

// ── Sheet: Servicios ─────────────────────────────────────────
function sheetServicios(servicios, fecha) {
  const ws = {};
  const COLS = ['TÍTULO DEL SERVICIO', 'FECHA / DESCRIPCIÓN', 'ESTADO'];
  let r = 0;

  C(ws, r, 0, `SERVICIOS — ${fecha}`, ST.title); M(ws, r, 0, r, COLS.length - 1); r += 2;
  COLS.forEach((col, i) => C(ws, r, i, col, ST.header)); r++;

  servicios.forEach((sv, i) => {
    const alt = i % 2 === 1;
    C(ws, r, 0, sv.titulo,      alt ? ST.cellAlt : ST.cell);
    C(ws, r, 1, sv.descripcion, alt ? ST.cellAlt : ST.cell);
    C(ws, r, 2, sv.completada ? 'Completado' : 'Pendiente',
      badgeStyle(sv.completada ? 'DCFCE7' : 'FEF9C3'));
    r++;
  });

  const comp = servicios.filter(sv => sv.completada).length;
  C(ws, r, 0, `Completados: ${comp} / ${servicios.length}`, {
    ...ST.total, alignment: { horizontal: 'left', vertical: 'center' },
  });
  M(ws, r, 0, r, COLS.length - 1);

  ws['!cols'] = [{ wch: 34 }, { wch: 22 }, { wch: 14 }];
  fixRange(ws);
  return ws;
}

// ── Main export ───────────────────────────────────────────────
export function generarInformeExcel({ ingresos, gastos, cotizaciones, clientes, servicios, secciones }) {
  const wb   = XLSX.utils.book_new();
  const now  = new Date();
  const fecha = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const fname = `Informe_${now.toISOString().split('T')[0]}.xlsx`;

  if (secciones.resumen)
    XLSX.utils.book_append_sheet(wb, sheetResumen({ ingresos, gastos, cotizaciones, clientes, servicios, fecha }), 'Resumen Ejecutivo');
  if (secciones.ingresos)
    XLSX.utils.book_append_sheet(wb, sheetIngresos(ingresos, fecha), 'Ingresos');
  if (secciones.gastos)
    XLSX.utils.book_append_sheet(wb, sheetGastos(gastos, fecha), 'Gastos');
  if (secciones.cotizaciones)
    XLSX.utils.book_append_sheet(wb, sheetCotizaciones(cotizaciones, fecha), 'Cotizaciones');
  if (secciones.clientes)
    XLSX.utils.book_append_sheet(wb, sheetClientes(clientes, fecha), 'Clientes');
  if (secciones.servicios)
    XLSX.utils.book_append_sheet(wb, sheetServicios(servicios, fecha), 'Servicios');

  XLSX.writeFile(wb, fname);
}
