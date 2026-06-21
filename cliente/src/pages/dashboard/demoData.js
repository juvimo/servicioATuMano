/* ─── Datos demo ─── */
export const DEMO_SERVICIOS = [
  { _id:"d1",  completada:true,  titulo:"Vapor de Muebles y Sofás — María García",        descripcion:"📞 321-219-6255 · ✉ maria@email.com · Notas: Sala con 3 sillones grandes, tela beige con manchas de café" },
  { _id:"d2",  completada:true,  titulo:"Limpieza de Colchones — Juan Pérez",              descripcion:"📞 320-555-0202 · ✉ juan@email.com · Notas: 2 colchones dobles + 1 sencillo, 2° piso" },
  { _id:"d3",  completada:true,  titulo:"Desinfección Comercial — Restaurante El Patio",   descripcion:"📞 314-555-0606 · ✉ patio@email.com · Notas: Cocina industrial + 40 sillas tapizadas, servicio nocturno" },
  { _id:"d4",  completada:true,  titulo:"Limpieza de Tapetes — Carlos López",              descripcion:"📞 315-555-0404 · ✉ carlos@email.com · Notas: Tapete persa 3×4 m, manchas de mascota" },
  { _id:"d5",  completada:true,  titulo:"Tapicería de Automóvil — Sandra Ruiz",            descripcion:"📞 318-555-0707 · ✉ sandra@email.com · Notas: Toyota Corolla 2021, olores de cigarrillo y manchas en moqueta" },
  { _id:"d6",  completada:true,  titulo:"Vapor de Muebles y Sofás — Pedro Ramírez",        descripcion:"📞 312-444-0201 · ✉ pedro@email.com · Notas: 2 sofás de 3 puestos, tela gris manchada por uso diario" },
  { _id:"d7",  completada:true,  titulo:"Limpieza de Colchones — Ana Moreno",              descripcion:"📞 317-333-0102 · ✉ ana.moreno@email.com · Notas: Colchón doble + 2 almohadas, cuarto principal" },
  { _id:"d8",  completada:true,  titulo:"Alfombras y Tapetes a Vapor — Diana Castillo",    descripcion:"📞 311-222-0503 · ✉ diana@email.com · Notas: Tapete persa 4×3 m + 2 alfombras pequeñas de habitación" },
  { _id:"d9",  completada:true,  titulo:"Tapicería de Automóvil — Luis Hernández",         descripcion:"📞 316-111-0804 · ✉ luis@email.com · Notas: Mazda CX-5 2020, manchas en asientos delanteros y moqueta" },
  { _id:"d10", completada:true,  titulo:"Desinfección Comercial — Café Central",           descripcion:"📞 304-777-0305 · ✉ admin@cafecentral.com · Notas: Cocina 30 m² + barra y 12 sillas tapizadas, servicio lunes 7AM" },
  { _id:"d11", completada:false, titulo:"Vapor Residencial Integral — Familia Torres",     descripcion:"📞 318-555-0505 · ✉ torres@email.com · Notas: Apartamento 60 m², 2 habitaciones y sala, visita programada" },
  { _id:"d12", completada:false, titulo:"Limpieza Post-Obra — Constructora HG",            descripcion:"📞 301-555-0808 · ✉ hg@constructora.com · Notas: Apartamento 90 m², polvo de cemento y restos de pintura" },
  { _id:"d13", completada:false, titulo:"Limpieza de Baños a Vapor — Hotel Camino Real",   descripcion:"📞 305-888-0607 · ✉ mant@caminoreal.com · Notas: 8 baños de huéspedes, juntas de azulejo con hongos" },
  { _id:"d14", completada:false, titulo:"Desinfección de Baños — Ana Martínez",            descripcion:"📞 300-555-0303 · ✉ ana@email.com · Notas: 3 baños con hongos en juntas, azulejos blancos" },
  { _id:"d15", completada:false, titulo:"Vapor Residencial — Laura Gómez",                 descripcion:"📞 318-555-0504 · ✉ laura@email.com · Notas: Casa 3 habitaciones + jardín, cliente nueva" },
];

export const DEMO_COTIZACIONES = [
  { _id: "c1", nombre: "María García",    telefono: "310-555-0101", correo: "maria@email.com",  servicio: "Vapor de Muebles y Sofás",     info: "Sala con 2 sofás de 3 puestos",       fecha: "2026-06-10", estado: "Pendiente" },
  { _id: "c2", nombre: "Juan Pérez",      telefono: "320-555-0202", correo: "juan@email.com",   servicio: "Limpieza de Colchones",         info: "2 colchones dobles + 1 sencillo",     fecha: "2026-06-11", estado: "Confirmada" },
  { _id: "c3", nombre: "Ana Martínez",    telefono: "300-555-0303", correo: "ana@email.com",    servicio: "Desinfección Comercial",        info: "Restaurante, cocina + 20 sillas",     fecha: "2026-06-12", estado: "Pendiente" },
  { _id: "c4", nombre: "Carlos López",    telefono: "315-555-0404", correo: "carlos@email.com", servicio: "Alfombras y Tapetes a Vapor",   info: "Tapete persa 3×4 m + sala",           fecha: "2026-06-13", estado: "Atendida"  },
  { _id: "c5", nombre: "Laura Gómez",     telefono: "318-555-0505", correo: "laura@email.com",  servicio: "Vapor Residencial Integral",    info: "Casa 3 hab + sala + comedor",         fecha: "2026-06-14", estado: "Pendiente" },
];

export const DEMO_CLIENTES = [
  { _id: "cl1", nombre: "María García",    telefono: "310-555-0101", correo: "maria@email.com",  servicios: 4, total: "$480.000",  ultima: "2026-05-10" },
  { _id: "cl2", nombre: "Juan Pérez",      telefono: "320-555-0202", correo: "juan@email.com",   servicios: 2, total: "$240.000",  ultima: "2026-05-11" },
  { _id: "cl3", nombre: "Ana Martínez",    telefono: "300-555-0303", correo: "ana@email.com",    servicios: 7, total: "$1.050.000",ultima: "2026-05-12" },
  { _id: "cl4", nombre: "Carlos López",    telefono: "315-555-0404", correo: "carlos@email.com", servicios: 1, total: "$120.000",  ultima: "2026-05-13" },
  { _id: "cl5", nombre: "Laura Gómez",     telefono: "318-555-0505", correo: "laura@email.com",  servicios: 3, total: "$360.000",  ultima: "2026-05-14" },
  { _id: "cl6", nombre: "Pedro Sánchez",   telefono: "312-555-0606", correo: "pedro@email.com",  servicios: 5, total: "$600.000",  ultima: "2026-05-15" },
];

export const DEMO_GASTOS = [
  { _id: "g1", concepto: "Detergente y productos vapor",  categoria: "Insumos/Productos Vapor",  monto: 85000,  fecha: "2026-06-01", nota: "Desengrasante, antihongos, aromatizante" },
  { _id: "g2", concepto: "Transporte al domicilio",       categoria: "Transporte",               monto: 45000,  fecha: "2026-06-03", nota: "Varios servicios en Cundinamarca" },
  { _id: "g3", concepto: "Uniformes y EPP",               categoria: "Equipamiento/Máquinas",    monto: 120000, fecha: "2026-06-05", nota: "4 uniformes + guantes + tapabocas" },
  { _id: "g4", concepto: "Publicidad redes sociales",     categoria: "Marketing",                monto: 60000,  fecha: "2026-06-08", nota: "Pauta Instagram — antes/después vapor" },
  { _id: "g5", concepto: "Mantenimiento máquina vapor",   categoria: "Equipamiento/Máquinas",    monto: 95000,  fecha: "2026-06-10", nota: "Revisión caldera + filtros" },
];

export const DEMO_INGRESOS = [
  { _id: "i1", concepto: "Sofás a Vapor — García",          categoria: "Tapicería/Sofás",   monto: 150000, fecha: "2026-06-02", nota: "Pago efectivo" },
  { _id: "i2", concepto: "Desinfección Comercial — TechCo", categoria: "Comercial",          monto: 320000, fecha: "2026-06-04", nota: "Transferencia" },
  { _id: "i3", concepto: "Tapetes a Vapor — López",         categoria: "Tapicería/Tapetes",  monto: 80000,  fecha: "2026-06-06", nota: "" },
  { _id: "i4", concepto: "Vapor Residencial — Apt Ruiz",    categoria: "Residencial",        monto: 200000, fecha: "2026-06-09", nota: "Pago app" },
  { _id: "i5", concepto: "Colchones a Vapor — Gómez",       categoria: "Tapicería/Sofás",    monto: 130000, fecha: "2026-06-11", nota: "Efectivo" },
  { _id: "i6", concepto: "Vapor Mensual — Familia Pérez",   categoria: "Residencial",        monto: 240000, fecha: "2026-06-13", nota: "Contrato mensual" },
];

export const CATEGORIAS_GASTO   = ["Insumos/Productos Vapor", "Transporte", "Equipamiento/Máquinas", "Marketing", "Nómina", "Otro"];
export const CATEGORIAS_INGRESO = ["Residencial", "Comercial", "Tapicería/Sofás", "Tapicería/Tapetes", "Automóviles", "Post-Obra", "Baños", "Otro"];
export const CATEGORIAS_CLIENTE_SERVICIO = ["Vapor de Muebles y Sofás","Limpieza de Colchones","Alfombras y Tapetes a Vapor","Tapicería de Automóviles","Limpieza Residencial a Vapor","Limpieza Comercial a Vapor","Limpieza Post-Obra","Desinfección de Baños a Vapor","Vapor Residencial Integral","Desinfección Comercial"];
