// "use client"

// import React, { useMemo, useState } from "react"
// import XLSX from "xlsx-js-style"
// const { utils, writeFile } = XLSX

// /** ---------- Types ---------- */
// type ExportArgs = {
//   start: string
//   end: string
//   diffs: Record<number, number> // tagId -> diff
//   gasCostPerM3: number | string
//   gasCostPerMMBtu: number | string
//   coalCostPerTon: number | string
//   dieselCostPerLiter: number | string
// }
// type TagRecord = { tagId: number; timestamp: string; value: number }
// type QueryBody = {
//   valueIds: number[]
//   timeBegin: string
//   timeEnd: string
//   timeStep: string
// }
// type CostInput = number | ""

// /** ---------- Config ---------- */
// const API_URL = "/api/v1/proxy-query";
// // const API_URL = "/query"

// /** ---------- Constants / Conversions ---------- */
// const MMBTU_PER_M3 = 0.035315
// /** HRSG duct conversion (m³ → ton steam) */
// const HRSG_DUCT_DIVISOR = 76

// /** ---------- Power House 1 ---------- */
// const FREE_STEAM_1 = [133, 138, 141, 147] as const
// const GAS_ID_1 = 171

// /** ---------- Power House 2 ---------- */
// const FREE_STEAM_2_ORDERED = [170, 153, 158, 163] as const // 1..4

// /** ---------- Power House 3 ---------- */
// const FREE_STEAM_3_ORDERED = [4666, 4673, 4680] as const // 1..3

// /** ---------- Power House 4 ---------- */
// const FREE_STEAM_4_ORDERED = [4687, 4694] as const // 4..5

// /** GAS meters */
// const GAS_TOTALIZER_ID = 278 // Gas boiler totalizer (m³)
// const HRSG_GAS_TOTALIZER_ID = 4658 // HRSG duct gas (m³)

// /** ---------- OUTSOURCE BOILER (Coal Boiler) ---------- */
// const COAL_CONSUMED_ID = 4649
// const COAL_STEAM_ID = 177

// /** ---------- EXTRA FREE STEAM TAGS ---------- */
// const HRSG_STEAM_TOTALIZER_ID = 4657 // included in FREE

// const TAG_NAMES: Record<number, string> = {
//   // PH1
//   133: "WHRB 1",
//   138: "WHRB 2",
//   141: "WHRB 3",
//   147: "WHRB 4",
//   171: "Gas fired",
//   278: "GAS BOILER GAS TOTALIZER",
//   // PH2
//   166: "WHRB 1",
//   153: "WHRB 2",
//   158: "WHRB 3",
//   163: "WHRB 4",
//   4657: "HRSG STEAM TOTALIZER",
//   4658: "HRSG GAS TOTALIZER",
//   // PH3
//   4666: "WHRB 1",
//   4673: "WHRB 2",
//   4680: "WHRB 3",
//   // PH4
//   4687: "WHRB 4",
//   4694: "WHRB 5",
//   // COAL BOILER
//   4649: "COAL CONSUMED",
//   177: "COAL BOILER STEAM",
// }

// /* ───────────────── Fuel price persistence helpers ──────────────── */
// type FuelPrices = { gasMMBtu: CostInput; gasM3: CostInput; coalTon: CostInput; dieselL: CostInput }
// const FUEL_PRICES_KEY = "steamReport.fuelPrices"

// function loadFuelPrices(): FuelPrices | null {
//   try {
//     const raw = localStorage.getItem(FUEL_PRICES_KEY)
//     if (!raw) return null
//     const p = JSON.parse(raw)
//     const coerce = (v: any): CostInput => (v === "" || v == null ? "" : Number.isFinite(Number(v)) ? Number(v) : "")
//     return {
//       gasMMBtu: coerce(p.gasMMBtu),
//       gasM3: coerce(p.gasM3),
//       coalTon: coerce(p.coalTon),
//       dieselL: coerce(p.dieselL),
//     }
//   } catch {
//     return null
//   }
// }

// function saveFuelPrices(p: FuelPrices) {
//   localStorage.setItem(FUEL_PRICES_KEY, JSON.stringify(p))
// }

// /* ───────────────── Utilities ──────────────── */
// function toApiTime(local: string) {
//   if (!local) return ""
//   return local.replace("T", " ") + ":00.000"
// }

// /** Freeze number formatting to avoid SSR/CSR locale mismatch */
// const NUMBER_FMT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 })
// function fmt(n: number | null | undefined) {
//   if (n == null || Number.isNaN(n) || !Number.isFinite(n)) return "—"
//   return NUMBER_FMT.format(Number(n))
// }

// function asNumberOrEmpty(v: string): CostInput {
//   if (v.trim() === "") return ""
//   const n = Number(v)
//   return Number.isFinite(n) ? n : ""
// }

// /** Small spinner for the Fetch button */
// function Spinner({ className = "" }) {
//   return (
//     <svg viewBox="0 0 24 24" className={`h-4 w-4 animate-spin ${className}`} aria-hidden="true">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//     </svg>
//   )
// }

// /** Small-screen card row */
// function Row({
//   label,
//   value,
//   emphasize = false,
// }: {
//   label: string
//   value: number | null | undefined
//   emphasize?: boolean
// }) {
//   return (
//     <div
//       className={`flex items-center justify-between gap-3 py-2.5 px-1 ${emphasize ? "border-t-2 border-gray-300 pt-3 mt-1" : ""}`}
//     >
//       <span className={`text-sm ${emphasize ? "font-semibold text-gray-900" : "text-gray-600"}`}>{label}</span>
//       <span
//         className={`font-mono text-sm tabular-nums ${emphasize ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
//       >
//         {fmt(value)}
//       </span>
//     </div>
//   )
// }

// /** New SectionCard component for better organization */
// function SectionCard({
//   title,
//   children,
//   className = "",
// }: {
//   title: string
//   children: React.ReactNode
//   className?: string
// }) {
//   return (
//     <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
//       <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200">
//         <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
//       </div>
//       <div className="p-4">{children}</div>
//     </div>
//   )
// }

// /** New responsive table wrapper */
// function ResponsiveTable({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="overflow-x-auto -mx-4 sm:mx-0">
//       <div className="inline-block min-w-full align-middle">
//         <div className="overflow-hidden border border-gray-200 sm:rounded-lg">{children}</div>
//       </div>
//     </div>
//   )
// }

// /** ---------- Build diffs (tagId → diff) from fetched data ---------- */
// function buildDiffMap(recs: TagRecord[]) {
//   const byId = new Map<number, TagRecord[]>()
//   for (const r of recs) {
//     if (!byId.has(r.tagId)) byId.set(r.tagId, [])
//     byId.get(r.tagId)!.push(r)
//   }
//   const diffs: Record<number, number> = {}
//   for (const [id, arr] of byId) {
//     arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
//     diffs[id] = (arr[arr.length - 1].value ?? 0) - (arr[0].value ?? 0)
//   }
//   return diffs
// }

// export default function SteamGenerationReport() {
//   const [start, setStart] = useState("2025-12-09T08:00")
//   const [end, setEnd] = useState("2025-12-10T08:01")
//   const [data, setData] = useState<TagRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [err, setErr] = useState<string>("")

//   // --- Fuel price inputs (stored & persisted) ---
//   const [gasCostPerMMBtu, setGasCostPerMMBtu] = useState<CostInput>("")
//   const [gasCostPerM3, setGasCostPerM3] = useState<CostInput>("")
//   const [coalCostPerTon, setCoalCostPerTon] = useState<CostInput>("")
//   const [dieselCostPerLiter, setDieselCostPerLiter] = useState<CostInput>("")

//   // Load saved prices on mount
//   React.useEffect(() => {
//     const saved = loadFuelPrices()
//     if (saved) {
//       setGasCostPerMMBtu(saved.gasMMBtu)
//       setGasCostPerM3(saved.gasM3)
//       setCoalCostPerTon(saved.coalTon)
//       setDieselCostPerLiter(saved.dieselL)
//     }
//   }, [])

//   // Modal control
//   const [showPricesModal, setShowPricesModal] = useState(false)

//   React.useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && showPricesModal) {
//         setShowPricesModal(false)
//       }
//     }

//     if (showPricesModal) {
//       document.addEventListener("keydown", handleEscape)
//       document.body.style.overflow = "hidden"
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape)
//       document.body.style.overflow = "unset"
//     }
//   }, [showPricesModal])

//   // Group records by tag, timestamps sorted
//   const grouped = useMemo(() => {
//     const m = new Map<number, TagRecord[]>()
//     for (const r of data) {
//       if (!m.has(r.tagId)) m.set(r.tagId, [])
//       m.get(r.tagId)!.push(r)
//     }
//     for (const arr of m.values()) arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
//     return m
//   }, [data])

//   // Compute (final - initial) per tag
//   function diffFor(tagId: number): number | null {
//     const arr = grouped.get(tagId)
//     if (!arr || arr.length === 0) return null
//     const first = arr[0].value
//     const last = arr[arr.length - 1].value
//     return last - first
//   }

//   /** ---------- Power House 1 totals ---------- */
//   const whrbDiffs1 = FREE_STEAM_1.map((id) => diffFor(id))
//   const freeSteamTotal1 = whrbDiffs1.reduce<number>((sum, v) => sum + (v ?? 0), 0)
//   const gasDiff1 = diffFor(GAS_ID_1)
//   const grandTotal1 = freeSteamTotal1 + (gasDiff1 ?? 0)

//   /** ---------- Power House 2 totals ---------- */
//   const whrbDiffs2 = FREE_STEAM_2_ORDERED.map((id) => diffFor(id))
//   const freeSteamTotal2 = whrbDiffs2.reduce<number>((sum, v) => sum + (v ?? 0), 0)
//   const grandTotal2 = freeSteamTotal2

//   /** ---------- Power House 3 totals ---------- */
//   const whrbDiffs3 = FREE_STEAM_3_ORDERED.map((id) => diffFor(id))
//   const freeSteamTotal3 = whrbDiffs3.reduce<number>((sum, v) => sum + (v ?? 0), 0)
//   const grandTotal3 = freeSteamTotal3

//   /** ---------- Power House 4 totals ---------- */
//   const whrbDiffs4 = FREE_STEAM_4_ORDERED.map((id) => diffFor(id))
//   const freeSteamTotal4 = whrbDiffs4.reduce<number>((sum, v) => sum + (v ?? 0), 0)
//   const grandTotal4 = freeSteamTotal4

//   /** ---------- GAS & HRSG meters ---------- */
//   // Gas boiler (m³)
//   const gasUsedM3 = diffFor(GAS_TOTALIZER_ID)
//   const gasUsedMMBtu = gasUsedM3 != null ? gasUsedM3 * MMBTU_PER_M3 : null
//   const gasAmountRsM3 =
//     gasUsedM3 != null && gasCostPerM3 !== "" && Number.isFinite(gasCostPerM3 as number)
//       ? gasUsedM3 * (gasCostPerM3 as number)
//       : null

//   // HRSG duct (m³ → ton via /76, and MMBtu)
//   const hrsgGasUsedM3 = diffFor(HRSG_GAS_TOTALIZER_ID)
//   const hrsgDuctTons = hrsgGasUsedM3 != null ? hrsgGasUsedM3 / HRSG_DUCT_DIVISOR : 0
//   const hrsgGasUsedMMBtu = hrsgGasUsedM3 != null ? hrsgGasUsedM3 * MMBTU_PER_M3 : null
//   const hrsgGasAmountRs =
//     hrsgGasUsedM3 != null && gasCostPerM3 !== "" && Number.isFinite(gasCostPerM3 as number)
//       ? hrsgGasUsedM3 * (gasCostPerM3 as number)
//       : null

//   /** ---------- Outsource Boiler (Coal Boiler) ---------- */
//   const coalConsumedDiff = diffFor(COAL_CONSUMED_ID)
//   const coalSteamDiff = diffFor(COAL_STEAM_ID)
//   const coalConsumedDisplay = coalConsumedDiff == null ? null : coalConsumedDiff / 1000 // kg -> ton
//   const coalAmount =
//     coalConsumedDisplay != null && coalCostPerTon !== "" && Number.isFinite(coalCostPerTon as number)
//       ? coalConsumedDisplay * (coalCostPerTon as number)
//       : null
//   const costPerTonSteam =
//     coalAmount != null && coalSteamDiff != null && coalSteamDiff > 0 ? coalAmount / coalSteamDiff : null

//   /** ---------- HRSG STEAM TAG (counted inside FREE) ---------- */
//   const hrsgtotalizerDiff = diffFor(HRSG_STEAM_TOTALIZER_ID) ?? 0
//   const freeTurbineTons = hrsgtotalizerDiff - hrsgDuctTons

//   /** ---------- Fuel Mix (FREE / GAS / COAL) ---------- */
//   const freeSteamCombined = freeSteamTotal1 + freeSteamTotal2 // WHRBs + Turbine
//   const gasGen = gasDiff1 ?? 0 // GAS = boiler-only steam (171)
//   const coalGen = coalSteamDiff ?? 0
//   const totalGen = freeSteamCombined + gasGen + coalGen

//   function fmtPct(part: number | null | undefined, total: number) {
//     if (part == null || Number.isNaN(part) || total <= 0) return "—"
//     return ((part / total) * 100).toLocaleString("en-US", { maximumFractionDigits: 1 }) + " %"
//   }

//   async function fetchReport(e: React.FormEvent) {
//     e.preventDefault()
//     setErr("")
//     setLoading(true)
//     setData([])

//     const valueIds = [
//       ...FREE_STEAM_1,
//       GAS_ID_1,
//       ...FREE_STEAM_2_ORDERED,
//       ...FREE_STEAM_3_ORDERED,
//       ...FREE_STEAM_4_ORDERED,
//       COAL_CONSUMED_ID,
//       COAL_STEAM_ID,
//       HRSG_STEAM_TOTALIZER_ID,
//       GAS_TOTALIZER_ID,
//       HRSG_GAS_TOTALIZER_ID,
//     ]

//     const body: QueryBody = {
//       valueIds,
//       timeBegin: toApiTime(start),
//       timeEnd: toApiTime(end),
//       timeStep: "3600,1",
//     }

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const json: TagRecord[] = await res.json()
//       setData(json)
//     } catch (e: any) {
//       setErr(e?.message || "Failed to fetch")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const rangeInvalid = !start || !end || start >= end

//   /** ---------- XLSX Export (keep HRSG DUCT inside GAS FUEL) ---------- */
//   function exportToXlsx({ start, end, diffs, gasCostPerM3, gasCostPerMMBtu, coalCostPerTon }: ExportArgs) {
//     const d = (id: number) => Number(diffs[id] ?? 0)

//     // ===== FREE block
//     const FREE_TURBINE = freeTurbineTons
//     const WHRB1 = d(133) + d(138) + d(141) + d(147)
//     const WHRB2 = d(170) + d(153) + d(158) + d(163)
//     const WHRB3 = d(4666) + d(4673) + d(4680)
//     const WHRB4 = d(4687) + d(4694)
//     const FREE_TOTAL = FREE_TURBINE + WHRB1 + WHRB2 + WHRB3 + WHRB4

//     // ===== GAS (boiler) & HRSG duct
//     const GAS_TON = d(171)
//     const GAS_M3 = d(278)
//     const GAS_MMBTU = GAS_M3 * MMBTU_PER_M3
//     const GAS_AMOUNT_RS = GAS_M3 * (Number(gasCostPerM3) || 0)
//     const GAS_COST_RS_PER_TON = GAS_TON > 0 ? GAS_AMOUNT_RS / GAS_TON : 0

//     const HRSG_GAS_M3 = d(4658)
//     const HRSG_DUCT_TON = HRSG_GAS_M3 / HRSG_DUCT_DIVISOR
//     const HRSG_GAS_MMBTU = HRSG_GAS_M3 * MMBTU_PER_M3
//     const HRSG_GAS_AMOUNT_RS = HRSG_GAS_M3 * (Number((gasCostPerM3 || 0)))
//     const HRSG_COST_RS_PER_TON = HRSG_DUCT_TON > 0 ? HRSG_GAS_AMOUNT_RS / HRSG_DUCT_TON : 0

//     // Totals for GAS FUEL block
//     const GAS_TON_TOTAL = HRSG_DUCT_TON + GAS_TON
//     const GAS_M3_TOTAL = HRSG_GAS_M3 + GAS_M3
//     const GAS_MMBTU_TOTAL = HRSG_GAS_MMBTU + GAS_MMBTU
//     const GAS_AMOUNT_RS_TOTAL = HRSG_GAS_AMOUNT_RS + GAS_AMOUNT_RS
//     const GAS_COST_RS_PER_TON_TOTAL = GAS_TON_TOTAL > 0 ? GAS_AMOUNT_RS_TOTAL / GAS_TON_TOTAL : 0

//     // ===== COAL (outsourced boiler)
//     const COAL_TON_STEAM = d(177)
//     const COAL_CONS_TON = d(4649) / 1000 // kg → ton
//     const COAL_AMOUNT_RS = COAL_CONS_TON * (Number(coalCostPerTon || 0))
//     const COAL_COST_RS_PER_TON = COAL_TON_STEAM > 0 ? COAL_AMOUNT_RS / COAL_TON_STEAM : 0

//     // ===== Mix + fuel-cost summary (HRSG not counted in GAS generation)
//     const FREE_GEN = FREE_TOTAL
//     const GAS_GEN = GAS_TON
//     const COAL_GEN = COAL_TON_STEAM
//     const TOTAL_GEN = FREE_GEN + GAS_GEN + COAL_GEN

//     const COST_FREE = 0
//     const COST_GAS = GAS_AMOUNT_RS
//     const COST_HRSG = HRSG_GAS_AMOUNT_RS // shown in cost table as its own line
//     const COST_COAL = COAL_AMOUNT_RS
//     const COST_TOTAL = COST_FREE + COST_GAS + COST_HRSG + COST_COAL

//     const COST_PER_TON_WITH_FREE = TOTAL_GEN > 0 ? COST_TOTAL / TOTAL_GEN : 0
//     const nonFreeGen = GAS_GEN + COAL_GEN
//     const COST_PER_TON_WO_FREE = nonFreeGen > 0 ? COST_TOTAL / nonFreeGen : 0

//     // ===== time/header =====
//     const startDt = new Date(start)
//     const endDt = new Date(end)
//     const days = Math.max(0, Math.round((+endDt - +startDt) / 86_400_000))
//     const monthHdr = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(startDt).toUpperCase()

//     // ===== styles & helpers =====
//     const BORDER = {
//       top: { style: "thin", color: { rgb: "000000" } },
//       right: { style: "thin", color: { rgb: "000000" } },
//       bottom: { style: "thin", color: { rgb: "000000" } },
//       left: { style: "thin", color: { rgb: "000000" } },
//     }
//     const sTitle = {
//       font: { bold: true, sz: 14 },
//       alignment: { horizontal: "center", vertical: "center" },
//       border: BORDER,
//     }
//     const sBand = {
//       font: { bold: true },
//       alignment: { horizontal: "center", vertical: "center" },
//       fill: { fgColor: { rgb: "EDEDED" } },
//       border: BORDER,
//     }
//     const sHdr = { font: { bold: true }, alignment: { horizontal: "center", vertical: "center" }, border: BORDER }
//     const sR = { alignment: { horizontal: "right", vertical: "center" }, border: BORDER }
//     const sL = { alignment: { horizontal: "left", vertical: "center" }, border: BORDER }
//     const sGreen = { fill: { fgColor: { rgb: "D8EAD8" } }, border: BORDER }
//     const sNote = {
//       fill: { fgColor: { rgb: "FBE6D5" } },
//       font: { bold: true },
//       alignment: { horizontal: "left", vertical: "center" },
//       border: BORDER,
//     }
//     const num0 = "#,##0",
//       num2 = "#,##0.00",
//       num3 = "#,##0.00",
//       money = "#,##0"

//     const rows: any[][] = Array.from({ length: 120 }, () => Array(40).fill(""))
//     const A = (r: number, c: number) => XLSX.utils.encode_cell({ r, c })
//     const set = (r: number, c: number, v: any) => {
//       rows[r] ??= []
//       rows[r][c] = v
//     }

//     // ===== Title C4:L4 & Date/Days M4:N5 =====
//     set(3, 2, `STEAM GENERATION REPORT - ${monthHdr}`)
//     set(3, 12, "DATE")
//     set(3, 13, new Intl.DateTimeFormat("en-GB").format(startDt))
//     set(4, 12, "DAYS")
//     set(4, 13, days)

//     // ===== Right Prices L7:N10 =====
//     set(6, 11, "GAS")
//     set(6, 12, gasCostPerMMBtu || 0)
//     set(6, 13, "Rs./mmbtu")
//     set(7, 11, "GAS")
//     set(7, 12, gasCostPerM3 || 0)
//     set(7, 13, "Rs./m3")
//     set(8, 11, "COAL")
//     set(8, 12, coalCostPerTon || 0)
//     set(8, 13, "Rs./ton")
//     set(9, 11, "DIESEL")
//     set(9, 12, 0)
//     set(9, 13, "Rs./liter")

//     // ===== FREE B8:I10 =====
//     set(7, 1, "FREE")
//     set(7, 3, "GENERATION")
//     ;["TURBINE", "WHRB 1", "WHRB 2", "WHRB 3", "WHRB 4", "TOTAL"].forEach((h, i) => set(8, 3 + i, h))
//     set(9, 1, "UNITS")
//     set(9, 2, "tons")
//     ;[FREE_TURBINE, WHRB1, WHRB2, WHRB3, WHRB4, FREE_TOTAL].forEach((v, i) => set(9, 3 + i, v))

//     // ===== GAS FUEL (with HRSG DUCT inside) B12:F18 =====
//     set(11, 1, "GAS FUEL")
//     set(11, 3, "GENERATION")
//     set(13, 1, "UNITS")
//     set(13, 2, "tons")
//     set(12, 3, "HRSG DUCT")
//     set(12, 4, "GAS BOILER")
//     set(12, 5, "TOTAL")

//     // UNITS: tons
//     set(13, 3, HRSG_DUCT_TON)
//     set(13, 4, GAS_TON)
//     set(13, 5, GAS_TON_TOTAL)

//     // GAS m3
//     set(14, 1, "GAS")
//     set(14, 2, "m3")
//     set(14, 3, HRSG_GAS_M3)
//     set(14, 4, GAS_M3)
//     set(14, 5, GAS_M3_TOTAL)

//     // GAS mmbtu
//     set(15, 1, "GAS")
//     set(15, 2, "mmbtu")
//     set(15, 3, HRSG_GAS_MMBTU)
//     set(15, 4, GAS_MMBTU)
//     set(15, 5, GAS_MMBTU_TOTAL)

//     // AMOUNT Rs.
//     set(16, 1, "AMOUNT")
//     set(16, 2, "Rs.")
//     set(16, 3, HRSG_GAS_AMOUNT_RS)
//     set(16, 4, GAS_AMOUNT_RS)
//     set(16, 5, GAS_AMOUNT_RS_TOTAL)

//     // COST Rs./ton
//     set(17, 1, "COST")
//     set(17, 2, "Rs./ton")
//     set(17, 3, HRSG_COST_RS_PER_TON)
//     set(17, 4, GAS_COST_RS_PER_TON)
//     set(17, 5, GAS_COST_RS_PER_TON_TOTAL)

//     // ===== COAL FUEL B20:E25 =====
//     set(20, 1, "COAL FUEL")
//     set(20, 3, "GENERATION")
//     set(21, 3, "COAL BOILER")
//     set(21, 4, "TOTAL")
//     set(22, 1, "UNITS")
//     set(22, 2, "tons")
//     set(22, 3, COAL_TON_STEAM)
//     set(22, 4, COAL_TON_STEAM)
//     set(23, 1, "COAL")
//     set(23, 2, "tons")
//     set(23, 3, COAL_CONS_TON)
//     set(23, 4, COAL_CONS_TON)
//     set(24, 1, "AMOUNT")
//     set(24, 2, "Rs.")
//     set(24, 3, COAL_AMOUNT_RS)
//     set(24, 4, COAL_AMOUNT_RS)
//     set(25, 1, "COST")
//     set(25, 2, "Rs./ton")
//     set(25, 3, COAL_COST_RS_PER_TON)
//     set(25, 4, COAL_COST_RS_PER_TON)

//     // ===== Right table 1: Fuel / Generation (ton) / Share%  L12:N18 =====
//     set(11, 11, "Fuel")
//     set(11, 12, "Generation (ton)")
//     set(11, 13, "Share %")
//     set(12, 11, "FREE")
//     set(12, 12, FREE_GEN)
//     set(12, 13, { t: "n", f: `IF(${A(12, 12)}>0,${A(12, 12)}/${A(15, 12)},0)` })
//     set(13, 11, "GAS")
//     set(13, 12, GAS_GEN)
//     set(13, 13, { t: "n", f: `IF(${A(13, 12)}>=0,${A(13, 12)}/${A(15, 12)},0)` })
//     set(14, 11, "COAL")
//     set(14, 12, COAL_GEN)
//     set(14, 13, { t: "n", f: `IF(${A(14, 12)}>=0,${A(14, 12)}/${A(15, 12)},0)` })
//     set(15, 11, "TOTAL")
//     set(15, 12, TOTAL_GEN)
//     set(15, 13, 1)

//     // ===== Right table 2: Fuel / Cost / Share%  L20:N25 =====
//     set(19, 11, "Fuel")
//     set(19, 12, "Cost")
//     set(19, 13, "Share %")
//     set(20, 11, "FREE")
//     set(20, 12, 0)
//     set(20, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(20, 12)}/${A(23, 12)},0)` })
//     set(21, 11, "GAS")
//     set(21, 12, GAS_AMOUNT_RS)
//     set(21, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(21, 12)}/${A(23, 12)},0)` })
//     set(22, 11, "HRSG")
//     set(22, 12, HRSG_GAS_AMOUNT_RS)
//     set(22, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(22, 12)}/${A(23, 12)},0)` })
//     set(23, 11, "COAL")
//     set(23, 12, COAL_AMOUNT_RS)
//     set(23, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(23, 12)}/${A(23, 12)},0)` })
//     set(24, 11, "TOTAL")
//     set(24, 12, { t: "n", f: `${A(20, 12)}+${A(21, 12)}+${A(22, 12)}+${A(23, 12)}` })
//     set(24, 13, 1)

//     // ===== Bottom green Fuel Cost rows  L27:N28 =====
//     set(26, 11, "Fuel Cost")
//     set(26, 12, COST_PER_TON_WITH_FREE)
//     set(26, 13, "Rs./ton")
//     set(26, 14, "W. FREE ST")
//     set(27, 11, "Fuel Cost")
//     set(27, 12, COST_PER_TON_WO_FREE)
//     set(27, 13, "Rs./ton")
//     set(27, 14, "W.O. FREE ST")

//     // ===== NOTE band B28:H28 =====
//     set(27, 1, "NOTE")
//     set(27, 2, "Natural Gas rates based on latest bill.")

//     const ws = utils.aoa_to_sheet(rows)
//     ws["!merges"] = [
//       { s: { r: 3, c: 2 }, e: { r: 3, c: 11 } },
//       { s: { r: 3, c: 12 }, e: { r: 3, c: 13 } },
//       { s: { r: 4, c: 12 }, e: { r: 4, c: 13 } },

//       { s: { r: 7, c: 1 }, e: { r: 8, c: 2 } },
//       { s: { r: 7, c: 3 }, e: { r: 7, c: 8 } },

//       { s: { r: 11, c: 1 }, e: { r: 12, c: 2 } },
//       { s: { r: 11, c: 3 }, e: { r: 11, c: 5 } },

//       { s: { r: 20, c: 1 }, e: { r: 21, c: 2 } },
//       { s: { r: 20, c: 3 }, e: { r: 20, c: 4 } },

//       { s: { r: 27, c: 1 }, e: { r: 27, c: 7 } },
//     ]
//     ws["!cols"] = [
//       { wch: 2 },
//       { wch: 10 },
//       { wch: 10 },
//       { wch: 12 },
//       { wch: 12 },
//       { wch: 12 },
//       { wch: 12 },
//       { wch: 12 },
//       { wch: 12 },
//       { wch: 8 },
//       { wch: 8 },
//       { wch: 12 },
//       { wch: 14 },
//       { wch: 10 },
//       { wch: 12 },
//     ]

//     const style = (r1: number, c1: number, r2: number, c2: number, s: any, z?: string) => {
//       for (let r = r1; r <= r2; r++)
//         for (let c = c1; c <= c2; c++) {
//           const addr = A(r, c)
//           if (!ws[addr]) ws[addr] = { t: "s", v: "" }
//           ws[addr].s = { ...(ws[addr].s || {}), ...s }
//           if (z) ws[addr].z = z
//         }
//     }

//     // styles
//     style(3, 2, 3, 11, sTitle)
//     style(3, 12, 4, 13, sHdr)
//     style(3, 12, 4, 13, { border: BORDER })

//     style(6, 11, 9, 13, { border: BORDER })
//     style(6, 11, 9, 11, sHdr)
//     style(6, 12, 9, 12, sR, num3)
//     style(6, 13, 9, 13, sHdr)

//     style(7, 1, 7, 2, sBand)
//     style(7, 3, 7, 8, sBand)
//     style(8, 3, 8, 8, sHdr)
//     style(9, 1, 9, 8, { border: BORDER })
//     style(9, 3, 9, 8, sR, num0)
//     style(9, 1, 9, 2, sL)

//     // GAS FUEL area styling (rows 13–18, cols 1–5)
//     style(11, 1, 12, 2, sBand)
//     style(11, 3, 12, 5, sBand)
//     style(13, 1, 13, 5, { border: BORDER })
//     style(14, 1, 18, 5, { border: BORDER })
//     style(14, 3, 18, 5, sR, num3) // numbers
//     style(15, 3, 15, 5, sR, num0) // m3 in integer format
//     style(16, 3, 16, 5, sR, num3) // mmbtu
//     style(17, 3, 17, 5, sR, money) // amount
//     style(18, 3, 18, 5, sR, num3) // cost/ton

//     // COAL block
//     style(20, 1, 21, 2, sBand)
//     style(20, 3, 20, 4, sBand)
//     style(21, 1, 25, 4, { border: BORDER })
//     style(21, 3, 21, 4, sHdr)
//     style(21, 3, 25, 4, sR, num3)
//     style(24, 3, 24, 4, sR, money)
//     style(25, 3, 25, 4, sR, num3)

//     // Right tables
//     style(11, 11, 11, 13, sHdr)
//     style(12, 11, 15, 13, { border: BORDER })
//     style(12, 11, 15, 11, sHdr)
//     style(12, 12, 15, 12, sR, num0)
//     style(12, 13, 15, 13, sR)
//     style(15, 11, 15, 13, sGreen)

//     style(19, 11, 19, 13, sHdr)
//     style(20, 11, 24, 13, { border: BORDER })
//     style(20, 11, 24, 11, sHdr)
//     style(20, 12, 24, 12, sR, money)
//     style(20, 13, 24, 13, sR)
//     style(24, 11, 24, 13, sGreen)

//     // Green fuel cost rows
//     style(26, 11, 27, 13, sGreen)
//     style(26, 11, 27, 11, sL)
//     style(26, 12, 27, 12, sR, num2)
//     style(26, 13, 27, 13, sHdr)
//     style(26, 14, 27, 14, sHdr)

//     // NOTE band
//     style(27, 1, 27, 1, sNote)
//     style(27, 2, 27, 7, { ...sNote, font: { bold: false } })

//     const wb = utils.book_new()
//     utils.book_append_sheet(wb, ws, "Steam Report")
//     writeFile(wb, `STEAM_GENERATION_REPORT_${monthHdr.replace(" ", "_")}.xlsx`)
//   }

//   /** ---------- Export click handler ---------- */
//   const handleExportXlsx = () => {
//     const diffs = buildDiffMap(data)
//     exportToXlsx({
//       start,
//       end,
//       diffs,
//       gasCostPerM3: typeof gasCostPerM3 === "number" ? gasCostPerM3 : gasCostPerM3 === "" ? 0 : gasCostPerM3,
//       gasCostPerMMBtu:
//         typeof gasCostPerMMBtu === "number" ? gasCostPerMMBtu : gasCostPerMMBtu === "" ? 0 : gasCostPerMMBtu,
//       coalCostPerTon: typeof coalCostPerTon === "number" ? coalCostPerTon : coalCostPerTon === "" ? 0 : coalCostPerTon,
//       dieselCostPerLiter:
//         typeof dieselCostPerLiter === "number"
//           ? dieselCostPerLiter
//           : dieselCostPerLiter === ""
//             ? 0
//             : dieselCostPerLiter,
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Steam Generation Report</h1>
//           <p className="text-sm sm:text-base text-gray-600">
//             Monitor and analyze steam generation across all power houses
//           </p>
//         </div>

//         {/* Date Range Form */}
//         <SectionCard title="Report Parameters" className="mb-6">
//           <form onSubmit={fetchReport} className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Start Date & Time
//                 </label>
//                 <input
//                   id="start-time"
//                   type="datetime-local"
//                   value={start}
//                   onChange={(e) => setStart(e.target.value)}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   End Date & Time
//                 </label>
//                 <input
//                   id="end-time"
//                   type="datetime-local"
//                   value={end}
//                   onChange={(e) => setEnd(e.target.value)}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
//                   required
//                 />
//               </div>
//             </div>

//             {err && (
//               <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
//                 <strong className="font-semibold">Error:</strong> {err}
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-3 pt-2">
//               <button
//                 type="submit"
//                 disabled={loading || rangeInvalid}
//                 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
//               >
//                 {loading ? (
//                   <>
//                     <Spinner className="text-white" />
//                     <span>Fetching...</span>
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                       />
//                     </svg>
//                     <span>Fetch Data</span>
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setShowPricesModal(true)}
//                 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm sm:text-base"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <span>Fuel Prices</span>
//               </button>

//               <button
//                 type="button"
//                 disabled={data.length === 0}
//                 onClick={handleExportXlsx}
//                 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 <span>Export XLSX</span>
//               </button>
//             </div>
//           </form>
//         </SectionCard>

//         {data.length > 0 && (
//           <>
//             {/* Power House 1 */}
//             <SectionCard title="Power House 1" className="mb-6">
//               {/* Desktop Table */}
//               <div className="hidden md:block">
//                 <ResponsiveTable>
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Source
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Generation (tons)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {FREE_STEAM_1.map((id, i) => (
//                         <tr key={id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
//                           <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                             {fmt(whrbDiffs1[i])}
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-blue-50 font-semibold">
//                         <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(freeSteamTotal1)}
//                         </td>
//                       </tr>
//                       <tr className="bg-green-50 font-bold border-t-2 border-green-300">
//                         <td className="px-4 py-3 text-sm text-gray-900">GAS FIRED</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(gasDiff1)}
//                         </td>
//                       </tr>
//                       <tr className="bg-purple-50 font-extrabold border-t-2 border-purple-300">
//                         <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(grandTotal1)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </ResponsiveTable>
//               </div>

//               {/* Mobile Cards */}
//               <div className="md:hidden space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
//                   <div className="space-y-1">
//                     {FREE_STEAM_1.map((id, i) => (
//                       <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs1[i]} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                   <Row label="FREE STEAM TOTAL" value={freeSteamTotal1} emphasize />
//                 </div>
//                 <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
//                   <Row label="GAS FIRED" value={gasDiff1} emphasize />
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-300">
//                   <Row label="GRAND TOTAL" value={grandTotal1} emphasize />
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Power House 2 */}
//             <SectionCard title="Power House 2" className="mb-6">
//               <div className="hidden md:block">
//                 <ResponsiveTable>
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Source
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Generation (tons)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {FREE_STEAM_2_ORDERED.map((id, i) => (
//                         <tr key={id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
//                           <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                             {fmt(whrbDiffs2[i])}
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-blue-50 font-semibold">
//                         <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(freeSteamTotal2)}
//                         </td>
//                       </tr>
//                       <tr className="bg-green-50 font-bold border-t-2 border-green-300">
//                         <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(grandTotal2)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </ResponsiveTable>
//               </div>

//               <div className="md:hidden space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
//                   <div className="space-y-1">
//                     {FREE_STEAM_2_ORDERED.map((id, i) => (
//                       <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs2[i]} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                   <Row label="FREE STEAM TOTAL" value={freeSteamTotal2} emphasize />
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-300">
//                   <Row label="GRAND TOTAL" value={grandTotal2} emphasize />
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Power House 3 */}
//             <SectionCard title="Power House 3" className="mb-6">
//               <div className="hidden md:block">
//                 <ResponsiveTable>
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Source
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Generation (tons)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {FREE_STEAM_3_ORDERED.map((id, i) => (
//                         <tr key={id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
//                           <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                             {fmt(whrbDiffs3[i])}
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-blue-50 font-semibold">
//                         <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(freeSteamTotal3)}
//                         </td>
//                       </tr>
//                       <tr className="bg-green-50 font-bold border-t-2 border-green-300">
//                         <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(grandTotal3)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </ResponsiveTable>
//               </div>

//               <div className="md:hidden space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
//                   <div className="space-y-1">
//                     {FREE_STEAM_3_ORDERED.map((id, i) => (
//                       <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs3[i]} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                   <Row label="FREE STEAM TOTAL" value={freeSteamTotal3} emphasize />
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-300">
//                   <Row label="GRAND TOTAL" value={grandTotal3} emphasize />
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Power House 4 */}
//             <SectionCard title="Power House 4" className="mb-6">
//               <div className="hidden md:block">
//                 <ResponsiveTable>
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Source
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Generation (tons)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {FREE_STEAM_4_ORDERED.map((id, i) => (
//                         <tr key={id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
//                           <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                             {fmt(whrbDiffs4[i])}
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-blue-50 font-semibold">
//                         <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(freeSteamTotal4)}
//                         </td>
//                       </tr>
//                       <tr className="bg-green-50 font-bold border-t-2 border-green-300">
//                         <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(grandTotal4)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </ResponsiveTable>
//               </div>

//               <div className="md:hidden space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
//                   <div className="space-y-1">
//                     {FREE_STEAM_4_ORDERED.map((id, i) => (
//                       <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs4[i]} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                   <Row label="FREE STEAM TOTAL" value={freeSteamTotal4} emphasize />
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-300">
//                   <Row label="GRAND TOTAL" value={grandTotal4} emphasize />
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Gas Consumption & HRSG */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//               <SectionCard title="Gas Boiler Consumption">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <span className="text-sm text-gray-600">Gas Used (m³)</span>
//                     <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">{fmt(gasUsedM3)}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <span className="text-sm text-gray-600">Gas Used (MMBtu)</span>
//                     <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
//                       {fmt(gasUsedMMBtu)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 bg-amber-50 rounded-lg px-3 mt-3">
//                     <span className="text-sm font-semibold text-gray-900">Cost (Rs.)</span>
//                     <span className="text-sm font-mono font-bold text-gray-900 tabular-nums">{fmt(gasAmountRsM3)}</span>
//                   </div>
//                 </div>
//               </SectionCard>

//               <SectionCard title="HRSG Duct">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <span className="text-sm text-gray-600">Gas Used (m³)</span>
//                     <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
//                       {fmt(hrsgGasUsedM3)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <span className="text-sm text-gray-600">Steam (tons)</span>
//                     <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
//                       {fmt(hrsgDuctTons)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <span className="text-sm text-gray-600">Gas Used (MMBtu)</span>
//                     <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
//                       {fmt(hrsgGasUsedMMBtu)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 bg-amber-50 rounded-lg px-3 mt-3">
//                     <span className="text-sm font-semibold text-gray-900">Cost (Rs.)</span>
//                     <span className="text-sm font-mono font-bold text-gray-900 tabular-nums">
//                       {fmt(hrsgGasAmountRs)}
//                     </span>
//                   </div>
//                 </div>
//               </SectionCard>
//             </div>

//             {/* Coal Boiler */}
//             <SectionCard title="Coal Boiler (Outsource)" className="mb-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Coal Consumed</div>
//                   <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">
//                     {fmt(coalConsumedDisplay)}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">tons</div>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Steam Generated</div>
//                   <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">{fmt(coalSteamDiff)}</div>
//                   <div className="text-xs text-gray-500 mt-1">tons</div>
//                 </div>
//                 <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
//                   <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Total Cost</div>
//                   <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">{fmt(coalAmount)}</div>
//                   <div className="text-xs text-gray-700 mt-1">Rs.</div>
//                 </div>
//                 <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
//                   <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Cost per Ton</div>
//                   <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">{fmt(costPerTonSteam)}</div>
//                   <div className="text-xs text-gray-700 mt-1">Rs./ton</div>
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Fuel Mix Summary */}
//             <SectionCard title="Fuel Mix Summary" className="mb-6">
//               <div className="hidden md:block">
//                 <ResponsiveTable>
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Fuel Type
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Generation (tons)
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Share (%)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       <tr className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-3 text-sm text-gray-900">FREE (WHRB + Turbine)</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(freeSteamCombined)}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmtPct(freeSteamCombined, totalGen)}
//                         </td>
//                       </tr>
//                       <tr className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-3 text-sm text-gray-900">GAS (Boiler)</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(gasGen)}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmtPct(gasGen, totalGen)}
//                         </td>
//                       </tr>
//                       <tr className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-3 text-sm text-gray-900">COAL (Outsource)</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(coalGen)}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmtPct(coalGen, totalGen)}
//                         </td>
//                       </tr>
//                       <tr className="bg-green-50 font-bold border-t-2 border-green-300">
//                         <td className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
//                           {fmt(totalGen)}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">100.0 %</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </ResponsiveTable>
//               </div>

//               <div className="md:hidden space-y-3">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium text-gray-900">FREE (WHRB + Turbine)</span>
//                     <span className="text-sm font-semibold text-blue-600">{fmtPct(freeSteamCombined, totalGen)}</span>
//                   </div>
//                   <div className="text-right text-sm font-mono text-gray-700 tabular-nums">
//                     {fmt(freeSteamCombined)} tons
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium text-gray-900">GAS (Boiler)</span>
//                     <span className="text-sm font-semibold text-blue-600">{fmtPct(gasGen, totalGen)}</span>
//                   </div>
//                   <div className="text-right text-sm font-mono text-gray-700 tabular-nums">{fmt(gasGen)} tons</div>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium text-gray-900">COAL (Outsource)</span>
//                     <span className="text-sm font-semibold text-blue-600">{fmtPct(coalGen, totalGen)}</span>
//                   </div>
//                   <div className="text-right text-sm font-mono text-gray-700 tabular-nums">{fmt(coalGen)} tons</div>
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-300">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-bold text-gray-900">TOTAL</span>
//                     <span className="text-sm font-bold text-green-700">100.0 %</span>
//                   </div>
//                   <div className="text-right text-sm font-mono font-bold text-gray-900 tabular-nums">
//                     {fmt(totalGen)} tons
//                   </div>
//                 </div>
//               </div>
//             </SectionCard>

//             {/* HRSG Steam Details */}
//             <SectionCard title="HRSG Steam Breakdown" className="mb-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                   <div className="text-xs text-blue-700 uppercase tracking-wide mb-1 font-medium">
//                     Free Turbine Steam
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 font-mono tabular-nums">{fmt(freeTurbineTons)}</div>
//                   <div className="text-xs text-blue-700 mt-1">tons</div>
//                 </div>
//                 <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
//                   <div className="text-xs text-purple-700 uppercase tracking-wide mb-1 font-medium">
//                     HRSG Duct Steam
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 font-mono tabular-nums">{fmt(hrsgDuctTons)}</div>
//                   <div className="text-xs text-purple-700 mt-1">tons</div>
//                 </div>
//               </div>
//               <div className="mt-3 text-xs text-gray-500 italic">HRSG Steam Totalizer = Free Turbine + HRSG Duct</div>
//             </SectionCard>
//           </>
//         )}

//         {data.length === 0 && !loading && (
//           <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
//             <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//             <p className="text-gray-500 text-sm">No data available. Please fetch a report to view results.</p>
//           </div>
//         )}
//       </div>

//       {/* Fuel Prices Modal */}
//       {showPricesModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowPricesModal(false)
//             }
//           }}
//         >
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
//               <h2 className="text-xl font-bold text-white">Fuel Prices Configuration</h2>
//               <button
//                 onClick={() => setShowPricesModal(false)}
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-colors"
//                 aria-label="Close modal"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               <div>
//                 <label htmlFor="gas-mmbtu" className="block text-sm font-semibold text-gray-700 mb-2">
//                   Gas Cost (Rs. per MMBtu)
//                 </label>
//                 <input
//                   id="gas-mmbtu"
//                   type="number"
//                   step="any"
//                   value={gasCostPerMMBtu}
//                   onChange={(e) => setGasCostPerMMBtu(asNumberOrEmpty(e.target.value))}
//                   placeholder="Enter cost per MMBtu"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="gas-m3" className="block text-sm font-semibold text-gray-700 mb-2">
//                   Gas Cost (Rs. per m³)
//                 </label>
//                 <input
//                   id="gas-m3"
//                   type="number"
//                   step="any"
//                   value={gasCostPerM3}
//                   onChange={(e) => setGasCostPerM3(asNumberOrEmpty(e.target.value))}
//                   placeholder="Enter cost per m³"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="coal-ton" className="block text-sm font-semibold text-gray-700 mb-2">
//                   Coal Cost (Rs. per ton)
//                 </label>
//                 <input
//                   id="coal-ton"
//                   type="number"
//                   step="any"
//                   value={coalCostPerTon}
//                   onChange={(e) => setCoalCostPerTon(asNumberOrEmpty(e.target.value))}
//                   placeholder="Enter cost per ton"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="diesel-liter" className="block text-sm font-semibold text-gray-700 mb-2">
//                   Diesel Cost (Rs. per liter)
//                 </label>
//                 <input
//                   id="diesel-liter"
//                   type="number"
//                   step="any"
//                   value={dieselCostPerLiter}
//                   onChange={(e) => setDieselCostPerLiter(asNumberOrEmpty(e.target.value))}
//                   placeholder="Enter cost per liter"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>
//             </div>

//             <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex gap-3">
//               <button
//                 onClick={() => setShowPricesModal(false)}
//                 className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   saveFuelPrices({
//                     gasMMBtu: gasCostPerMMBtu,
//                     gasM3: gasCostPerM3,
//                     coalTon: coalCostPerTon,
//                     dieselL: dieselCostPerLiter,
//                   })
//                   setShowPricesModal(false)
//                 }}
//                 className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
//               >
//                 Save & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"

import React, { useMemo, useState } from "react"
import XLSX from "xlsx-js-style"
const { utils, writeFile } = XLSX

/** ---------- Types ---------- */
type ExportArgs = {
  start: string
  end: string
  diffs: Record<number, number> // tagId -> diff
  gasCostPerM3: number | string
  gasCostPerMMBtu: number | string
  coalCostPerTon: number | string
  dieselCostPerLiter: number | string
}
type TagRecord = { tagId: number; timestamp: string; value: number }
type QueryBody = {
  valueIds: number[]
  timeBegin: string
  timeEnd: string
  timeStep: string
}
type CostInput = number | ""

/** ---------- Config ---------- */
const API_URL = "/api/v1/proxy-query";
// const API_URL = "/query"

/** ---------- Constants / Conversions ---------- */
const MMBTU_PER_M3 = 0.035315
/** HRSG duct conversion (m³ → ton steam) */
const HRSG_DUCT_DIVISOR = 76

/** ---------- Power House 1 ---------- */
const FREE_STEAM_1 = [133, 138, 141, 147] as const
const GAS_ID_1 = 171

/** ---------- Power House 2 ---------- */
const FREE_STEAM_2_ORDERED = [170, 153, 158, 163] as const // 1..4

/** ---------- Power House 3 ---------- */
const FREE_STEAM_3_ORDERED = [4666, 4673, 4680] as const // 1..3

/** ---------- Power House 4 ---------- */
const FREE_STEAM_4_ORDERED = [4687, 4694] as const // 4..5

/** GAS meters */
const GAS_TOTALIZER_ID = 278 // Gas boiler totalizer (m³)
const HRSG_GAS_TOTALIZER_ID = 4658 // HRSG duct gas (m³)

/** ---------- OUTSOURCE BOILER (Coal Boiler) ---------- */
const COAL_CONSUMED_ID = 4649
const COAL_STEAM_ID = 177

/** ---------- EXTRA FREE STEAM TAGS ---------- */
const HRSG_STEAM_TOTALIZER_ID = 4657 // included in FREE

const TAG_NAMES: Record<number, string> = {
  // PH1
  133: "WHRB 1",
  138: "WHRB 2",
  141: "WHRB 3",
  147: "WHRB 4",
  171: "Gas fired",
  278: "GAS BOILER GAS TOTALIZER",
  // PH2
  166: "WHRB 1",
  153: "WHRB 2",
  158: "WHRB 3",
  163: "WHRB 4",
  4657: "HRSG STEAM TOTALIZER",
  4658: "HRSG GAS TOTALIZER",
  // PH3
  4666: "WHRB 1",
  4673: "WHRB 2",
  4680: "WHRB 3",
  // PH4
  4687: "WHRB 4",
  4694: "WHRB 5",
  // COAL BOILER
  4649: "COAL CONSUMED",
  177: "COAL BOILER STEAM",
}

/* ───────────────── Fuel price persistence helpers ──────────────── */
type FuelPrices = { gasMMBtu: CostInput; gasM3: CostInput; coalTon: CostInput; dieselL: CostInput }
const FUEL_PRICES_KEY = "steamReport.fuelPrices"

function loadFuelPrices(): FuelPrices | null {
  try {
    const raw = localStorage.getItem(FUEL_PRICES_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    const coerce = (v: any): CostInput => (v === "" || v == null ? "" : Number.isFinite(Number(v)) ? Number(v) : "")
    return {
      gasMMBtu: coerce(p.gasMMBtu),
      gasM3: coerce(p.gasM3),
      coalTon: coerce(p.coalTon),
      dieselL: coerce(p.dieselL),
    }
  } catch {
    return null
  }
}

function saveFuelPrices(p: FuelPrices) {
  localStorage.setItem(FUEL_PRICES_KEY, JSON.stringify(p))
}

/* ───────────────── Utilities ──────────────── */
function toApiTime(local: string) {
  if (!local) return ""
  return local.replace("T", " ") + ":00.000"
}

/** Freeze number formatting to avoid SSR/CSR locale mismatch */
const NUMBER_FMT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 })
function fmt(n: number | null | undefined) {
  if (n == null || Number.isNaN(n) || !Number.isFinite(n)) return "—"
  return NUMBER_FMT.format(Number(n))
}

function asNumberOrEmpty(v: string): CostInput {
  if (v.trim() === "") return ""
  const n = Number(v)
  return Number.isFinite(n) ? n : ""
}

/** Small spinner for the Fetch button */
function Spinner({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 animate-spin ${className}`} aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

/** Small-screen card row */
function Row({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: number | null | undefined
  emphasize?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2.5 px-1 ${emphasize ? "border-t-2 border-gray-300 pt-3 mt-1" : ""}`}
    >
      <span className={`text-sm ${emphasize ? "font-semibold text-gray-900" : "text-gray-600"}`}>{label}</span>
      <span
        className={`font-mono text-sm tabular-nums ${emphasize ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
      >
        {fmt(value)}
      </span>
    </div>
  )
}

/** New SectionCard component for better organization */
function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200">
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/** New responsive table wrapper */
function ResponsiveTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 sm:rounded-lg">{children}</div>
      </div>
    </div>
  )
}

/** ---------- Build diffs (tagId → diff) from fetched data ---------- */
function buildDiffMap(recs: TagRecord[]) {
  const byId = new Map<number, TagRecord[]>()
  for (const r of recs) {
    if (!byId.has(r.tagId)) byId.set(r.tagId, [])
    byId.get(r.tagId)!.push(r)
  }
  const diffs: Record<number, number> = {}
  for (const [id, arr] of byId) {
    arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    diffs[id] = (arr[arr.length - 1].value ?? 0) - (arr[0].value ?? 0)
  }
  return diffs
}

export default function SteamGenerationReport() {
  const [start, setStart] = useState("2025-12-09T08:00")
  const [end, setEnd] = useState("2025-12-10T08:01")
  const [data, setData] = useState<TagRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string>("")

  // --- Fuel price inputs (stored & persisted) ---
  const [gasCostPerMMBtu, setGasCostPerMMBtu] = useState<CostInput>("")
  const [gasCostPerM3, setGasCostPerM3] = useState<CostInput>("")
  const [coalCostPerTon, setCoalCostPerTon] = useState<CostInput>("")
  const [dieselCostPerLiter, setDieselCostPerLiter] = useState<CostInput>("")

  // Load saved prices on mount
  React.useEffect(() => {
    const saved = loadFuelPrices()
    if (saved) {
      setGasCostPerMMBtu(saved.gasMMBtu)
      setGasCostPerM3(saved.gasM3)
      setCoalCostPerTon(saved.coalTon)
      setDieselCostPerLiter(saved.dieselL)
    }
  }, [])

  // Modal control
  const [showPricesModal, setShowPricesModal] = useState(false)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPricesModal) {
        setShowPricesModal(false)
      }
    }

    if (showPricesModal) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [showPricesModal])

  // Group records by tag, timestamps sorted
  const grouped = useMemo(() => {
    const m = new Map<number, TagRecord[]>()
    for (const r of data) {
      if (!m.has(r.tagId)) m.set(r.tagId, [])
      m.get(r.tagId)!.push(r)
    }
    for (const arr of m.values()) arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    return m
  }, [data])

  // Instead of last - first, we add all positive increases and ignore drops (resets).
  function diffFor(tagId: number) {
  const rows = data.filter(r => r.tagId === tagId);

  if (!rows || rows.length < 2) return 0;

  let total = 0;
  let prev = rows[0].value ?? 0;

  for (let i = 1; i < rows.length; i++) {
    const curr = rows[i].value ?? 0;

    if (curr >= prev) {
      total += curr - prev;
    } else {
      // counter reset
      total += curr;
    }

    prev = curr;
  }

  return total;
}

  /** ---------- Power House 1 totals ---------- */
  const whrbDiffs1 = FREE_STEAM_1.map((id) => diffFor(id))
  const freeSteamTotal1 = whrbDiffs1.reduce<number>((sum, v) => sum + (v ?? 0), 0)
  const gasDiff1 = diffFor(GAS_ID_1)
  const grandTotal1 = freeSteamTotal1 + (gasDiff1 ?? 0)

  /** ---------- Power House 2 totals ---------- */
  const whrbDiffs2 = FREE_STEAM_2_ORDERED.map((id) => diffFor(id))
  const freeSteamTotal2 = whrbDiffs2.reduce<number>((sum, v) => sum + (v ?? 0), 0)
  const grandTotal2 = freeSteamTotal2

  /** ---------- Power House 3 totals ---------- */
  const whrbDiffs3 = FREE_STEAM_3_ORDERED.map((id) => diffFor(id))
  const freeSteamTotal3 = whrbDiffs3.reduce<number>((sum, v) => sum + (v ?? 0), 0)
  const grandTotal3 = freeSteamTotal3

  /** ---------- Power House 4 totals ---------- */
  const whrbDiffs4 = FREE_STEAM_4_ORDERED.map((id) => diffFor(id))
  const freeSteamTotal4 = whrbDiffs4.reduce<number>((sum, v) => sum + (v ?? 0), 0)
  const grandTotal4 = freeSteamTotal4

  /** ---------- GAS & HRSG meters ---------- */
  // Gas boiler (m³)
  const gasUsedM3 = diffFor(GAS_TOTALIZER_ID)
  const gasUsedMMBtu = gasUsedM3 != null ? gasUsedM3 * MMBTU_PER_M3 : null
  const gasAmountRsM3 =
    gasUsedM3 != null && gasCostPerM3 !== "" && Number.isFinite(gasCostPerM3 as number)
      ? gasUsedM3 * (gasCostPerM3 as number)
      : null

  // HRSG duct (m³ → ton via /76, and MMBtu)
  const hrsgGasUsedM3 = diffFor(HRSG_GAS_TOTALIZER_ID)
  const hrsgDuctTons = hrsgGasUsedM3 != null ? hrsgGasUsedM3 / HRSG_DUCT_DIVISOR : 0
  const hrsgGasUsedMMBtu = hrsgGasUsedM3 != null ? hrsgGasUsedM3 * MMBTU_PER_M3 : null
  const hrsgGasAmountRs =
    hrsgGasUsedM3 != null && gasCostPerM3 !== "" && Number.isFinite(gasCostPerM3 as number)
      ? hrsgGasUsedM3 * (gasCostPerM3 as number)
      : null

  /** ---------- Outsource Boiler (Coal Boiler) ---------- */
  const coalConsumedDiff = diffFor(COAL_CONSUMED_ID)
  const coalSteamDiff = diffFor(COAL_STEAM_ID)
  const coalConsumedDisplay = coalConsumedDiff == null ? null : coalConsumedDiff / 1000 // kg -> ton
  const coalAmount =
    coalConsumedDisplay != null && coalCostPerTon !== "" && Number.isFinite(coalCostPerTon as number)
      ? coalConsumedDisplay * (coalCostPerTon as number)
      : null
  const costPerTonSteam =
    coalAmount != null && coalSteamDiff != null && coalSteamDiff > 0 ? coalAmount / coalSteamDiff : null

  /** ---------- HRSG STEAM TAG (counted inside FREE) ---------- */
  const hrsgtotalizerDiff = diffFor(HRSG_STEAM_TOTALIZER_ID) ?? 0
  const freeTurbineTons = hrsgtotalizerDiff - hrsgDuctTons

  /** ---------- Fuel Mix (FREE / GAS / COAL) ---------- */
  const freeSteamCombined = freeSteamTotal1 + freeSteamTotal2 // WHRBs + Turbine
  const gasGen = gasDiff1 ?? 0 // GAS = boiler-only steam (171)
  const coalGen = coalSteamDiff ?? 0
  const totalGen = freeSteamCombined + gasGen + coalGen

  function fmtPct(part: number | null | undefined, total: number) {
    if (part == null || Number.isNaN(part) || total <= 0) return "—"
    return ((part / total) * 100).toLocaleString("en-US", { maximumFractionDigits: 1 }) + " %"
  }

  async function fetchReport(e: React.FormEvent) {
    e.preventDefault()
    setErr("")
    setLoading(true)
    setData([])

    const valueIds = [
      ...FREE_STEAM_1,
      GAS_ID_1,
      ...FREE_STEAM_2_ORDERED,
      ...FREE_STEAM_3_ORDERED,
      ...FREE_STEAM_4_ORDERED,
      COAL_CONSUMED_ID,
      COAL_STEAM_ID,
      HRSG_STEAM_TOTALIZER_ID,
      GAS_TOTALIZER_ID,
      HRSG_GAS_TOTALIZER_ID,
    ]

    const body: QueryBody = {
      valueIds,
      timeBegin: toApiTime(start),
      timeEnd: toApiTime(end),
      timeStep: "3600,1",
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: TagRecord[] = await res.json()
      setData(json)
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch")
    } finally {
      setLoading(false)
    }
  }

  const rangeInvalid = !start || !end || start >= end

  /** ---------- XLSX Export (keep HRSG DUCT inside GAS FUEL) ---------- */
  function exportToXlsx({ start, end, diffs, gasCostPerM3, gasCostPerMMBtu, coalCostPerTon }: ExportArgs) {
    const d = (id: number) => Number(diffs[id] ?? 0)

    // ===== FREE block
    const FREE_TURBINE = freeTurbineTons
    const WHRB1 = d(133) + d(138) + d(141) + d(147)
    const WHRB2 = d(170) + d(153) + d(158) + d(163)
    const WHRB3 = d(4666) + d(4673) + d(4680)
    const WHRB4 = d(4687) + d(4694)
    const FREE_TOTAL = FREE_TURBINE + WHRB1 + WHRB2 + WHRB3 + WHRB4

    // ===== GAS (boiler) & HRSG duct
    const GAS_TON = d(171)
    const GAS_M3 = d(278)
    const GAS_MMBTU = GAS_M3 * MMBTU_PER_M3
    const GAS_AMOUNT_RS = GAS_M3 * (Number(gasCostPerM3) || 0)
    const GAS_COST_RS_PER_TON = GAS_TON > 0 ? GAS_AMOUNT_RS / GAS_TON : 0

    const HRSG_GAS_M3 = d(4658)
    const HRSG_DUCT_TON = HRSG_GAS_M3 / HRSG_DUCT_DIVISOR
    const HRSG_GAS_MMBTU = HRSG_GAS_M3 * MMBTU_PER_M3
    const HRSG_GAS_AMOUNT_RS = HRSG_GAS_M3 * (Number((gasCostPerM3 || 0)))
    const HRSG_COST_RS_PER_TON = HRSG_DUCT_TON > 0 ? HRSG_GAS_AMOUNT_RS / HRSG_DUCT_TON : 0

    // Totals for GAS FUEL block
    const GAS_TON_TOTAL = HRSG_DUCT_TON + GAS_TON
    const GAS_M3_TOTAL = HRSG_GAS_M3 + GAS_M3
    const GAS_MMBTU_TOTAL = HRSG_GAS_MMBTU + GAS_MMBTU
    const GAS_AMOUNT_RS_TOTAL = HRSG_GAS_AMOUNT_RS + GAS_AMOUNT_RS
    const GAS_COST_RS_PER_TON_TOTAL = GAS_TON_TOTAL > 0 ? GAS_AMOUNT_RS_TOTAL / GAS_TON_TOTAL : 0

    // ===== COAL (outsourced boiler)
    const COAL_TON_STEAM = d(177)
    const COAL_CONS_TON = d(4649) / 1000 // kg → ton
    const COAL_AMOUNT_RS = COAL_CONS_TON * (Number(coalCostPerTon || 0))
    const COAL_COST_RS_PER_TON = COAL_TON_STEAM > 0 ? COAL_AMOUNT_RS / COAL_TON_STEAM : 0

    // ===== Mix + fuel-cost summary (HRSG not counted in GAS generation)
    const FREE_GEN = FREE_TOTAL
    const GAS_GEN = GAS_TON
    const COAL_GEN = COAL_TON_STEAM
    const TOTAL_GEN = FREE_GEN + GAS_GEN + COAL_GEN

    const COST_FREE = 0
    const COST_GAS = GAS_AMOUNT_RS
    const COST_HRSG = HRSG_GAS_AMOUNT_RS // shown in cost table as its own line
    const COST_COAL = COAL_AMOUNT_RS
    const COST_TOTAL = COST_FREE + COST_GAS + COST_HRSG + COST_COAL

    const COST_PER_TON_WITH_FREE = TOTAL_GEN > 0 ? COST_TOTAL / TOTAL_GEN : 0
    const nonFreeGen = GAS_GEN + COAL_GEN
    const COST_PER_TON_WO_FREE = nonFreeGen > 0 ? COST_TOTAL / nonFreeGen : 0

    // ===== time/header =====
    const startDt = new Date(start)
    const endDt = new Date(end)
    const days = Math.max(0, Math.round((+endDt - +startDt) / 86_400_000))
    const monthHdr = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(startDt).toUpperCase()

    // ===== styles & helpers =====
    const BORDER = {
      top: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
    }
    const sTitle = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "center", vertical: "center" },
      border: BORDER,
    }
    const sBand = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "EDEDED" } },
      border: BORDER,
    }
    const sHdr = { font: { bold: true }, alignment: { horizontal: "center", vertical: "center" }, border: BORDER }
    const sR = { alignment: { horizontal: "right", vertical: "center" }, border: BORDER }
    const sL = { alignment: { horizontal: "left", vertical: "center" }, border: BORDER }
    const sGreen = { fill: { fgColor: { rgb: "D8EAD8" } }, border: BORDER }
    const sNote = {
      fill: { fgColor: { rgb: "FBE6D5" } },
      font: { bold: true },
      alignment: { horizontal: "left", vertical: "center" },
      border: BORDER,
    }
    const num0 = "#,##0",
      num2 = "#,##0.00",
      num3 = "#,##0.00",
      money = "#,##0"

    const rows: any[][] = Array.from({ length: 120 }, () => Array(40).fill(""))
    const A = (r: number, c: number) => XLSX.utils.encode_cell({ r, c })
    const set = (r: number, c: number, v: any) => {
      rows[r] ??= []
      rows[r][c] = v
    }

    // ===== Title C4:L4 & Date/Days M4:N5 =====
    set(3, 2, `STEAM GENERATION REPORT - ${monthHdr}`)
    set(3, 12, "DATE")
    set(3, 13, new Intl.DateTimeFormat("en-GB").format(startDt))
    set(4, 12, "DAYS")
    set(4, 13, days)

    // ===== Right Prices L7:N10 =====
    set(6, 11, "GAS")
    set(6, 12, gasCostPerMMBtu || 0)
    set(6, 13, "Rs./mmbtu")
    set(7, 11, "GAS")
    set(7, 12, gasCostPerM3 || 0)
    set(7, 13, "Rs./m3")
    set(8, 11, "COAL")
    set(8, 12, coalCostPerTon || 0)
    set(8, 13, "Rs./ton")
    set(9, 11, "DIESEL")
    set(9, 12, 0)
    set(9, 13, "Rs./liter")

    // ===== FREE B8:I10 =====
    set(7, 1, "FREE")
    set(7, 3, "GENERATION")
    ;["TURBINE", "WHRB 1", "WHRB 2", "WHRB 3", "WHRB 4", "TOTAL"].forEach((h, i) => set(8, 3 + i, h))
    set(9, 1, "UNITS")
    set(9, 2, "tons")
    ;[FREE_TURBINE, WHRB1, WHRB2, WHRB3, WHRB4, FREE_TOTAL].forEach((v, i) => set(9, 3 + i, v))

    // ===== GAS FUEL (with HRSG DUCT inside) B12:F18 =====
    set(11, 1, "GAS FUEL")
    set(11, 3, "GENERATION")
    set(13, 1, "UNITS")
    set(13, 2, "tons")
    set(12, 3, "HRSG DUCT")
    set(12, 4, "GAS BOILER")
    set(12, 5, "TOTAL")

    // UNITS: tons
    set(13, 3, HRSG_DUCT_TON)
    set(13, 4, GAS_TON)
    set(13, 5, GAS_TON_TOTAL)

    // GAS m3
    set(14, 1, "GAS")
    set(14, 2, "m3")
    set(14, 3, HRSG_GAS_M3)
    set(14, 4, GAS_M3)
    set(14, 5, GAS_M3_TOTAL)

    // GAS mmbtu
    set(15, 1, "GAS")
    set(15, 2, "mmbtu")
    set(15, 3, HRSG_GAS_MMBTU)
    set(15, 4, GAS_MMBTU)
    set(15, 5, GAS_MMBTU_TOTAL)

    // AMOUNT Rs.
    set(16, 1, "AMOUNT")
    set(16, 2, "Rs.")
    set(16, 3, HRSG_GAS_AMOUNT_RS)
    set(16, 4, GAS_AMOUNT_RS)
    set(16, 5, GAS_AMOUNT_RS_TOTAL)

    // COST Rs./ton
    set(17, 1, "COST")
    set(17, 2, "Rs./ton")
    set(17, 3, HRSG_COST_RS_PER_TON)
    set(17, 4, GAS_COST_RS_PER_TON)
    set(17, 5, GAS_COST_RS_PER_TON_TOTAL)

    // ===== COAL FUEL B20:E25 =====
    set(20, 1, "COAL FUEL")
    set(20, 3, "GENERATION")
    set(21, 3, "COAL BOILER")
    set(21, 4, "TOTAL")
    set(22, 1, "UNITS")
    set(22, 2, "tons")
    set(22, 3, COAL_TON_STEAM)
    set(22, 4, COAL_TON_STEAM)
    set(23, 1, "COAL")
    set(23, 2, "tons")
    set(23, 3, COAL_CONS_TON)
    set(23, 4, COAL_CONS_TON)
    set(24, 1, "AMOUNT")
    set(24, 2, "Rs.")
    set(24, 3, COAL_AMOUNT_RS)
    set(24, 4, COAL_AMOUNT_RS)
    set(25, 1, "COST")
    set(25, 2, "Rs./ton")
    set(25, 3, COAL_COST_RS_PER_TON)
    set(25, 4, COAL_COST_RS_PER_TON)

    // ===== Right table 1: Fuel / Generation (ton) / Share%  L12:N18 =====
    set(11, 11, "Fuel")
    set(11, 12, "Generation (ton)")
    set(11, 13, "Share %")
    set(12, 11, "FREE")
    set(12, 12, FREE_GEN)
    set(12, 13, { t: "n", f: `IF(${A(12, 12)}>0,${A(12, 12)}/${A(15, 12)},0)` })
    set(13, 11, "GAS")
    set(13, 12, GAS_GEN)
    set(13, 13, { t: "n", f: `IF(${A(13, 12)}>=0,${A(13, 12)}/${A(15, 12)},0)` })
    set(14, 11, "COAL")
    set(14, 12, COAL_GEN)
    set(14, 13, { t: "n", f: `IF(${A(14, 12)}>=0,${A(14, 12)}/${A(15, 12)},0)` })
    set(15, 11, "TOTAL")
    set(15, 12, TOTAL_GEN)
    set(15, 13, 1)

    // ===== Right table 2: Fuel / Cost / Share%  L20:N25 =====
    set(19, 11, "Fuel")
    set(19, 12, "Cost")
    set(19, 13, "Share %")
    set(20, 11, "FREE")
    set(20, 12, 0)
    set(20, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(20, 12)}/${A(23, 12)},0)` })
    set(21, 11, "GAS")
    set(21, 12, GAS_AMOUNT_RS)
    set(21, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(21, 12)}/${A(23, 12)},0)` })
    set(22, 11, "HRSG")
    set(22, 12, HRSG_GAS_AMOUNT_RS)
    set(22, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(22, 12)}/${A(23, 12)},0)` })
    set(23, 11, "COAL")
    set(23, 12, COAL_AMOUNT_RS)
    set(23, 13, { t: "n", f: `IF(${A(23, 12)}>0,${A(23, 12)}/${A(23, 12)},0)` })
    set(24, 11, "TOTAL")
    set(24, 12, { t: "n", f: `${A(20, 12)}+${A(21, 12)}+${A(22, 12)}+${A(23, 12)}` })
    set(24, 13, 1)

    // ===== Bottom green Fuel Cost rows  L27:N28 =====
    set(26, 11, "Fuel Cost")
    set(26, 12, COST_PER_TON_WITH_FREE)
    set(26, 13, "Rs./ton")
    set(26, 14, "W. FREE ST")
    set(27, 11, "Fuel Cost")
    set(27, 12, COST_PER_TON_WO_FREE)
    set(27, 13, "Rs./ton")
    set(27, 14, "W.O. FREE ST")

    // ===== NOTE band B28:H28 =====
    set(27, 1, "NOTE")
    set(27, 2, "Natural Gas rates based on latest bill.")

    const ws = utils.aoa_to_sheet(rows)
    ws["!merges"] = [
      { s: { r: 3, c: 2 }, e: { r: 3, c: 11 } },
      { s: { r: 3, c: 12 }, e: { r: 3, c: 13 } },
      { s: { r: 4, c: 12 }, e: { r: 4, c: 13 } },

      { s: { r: 7, c: 1 }, e: { r: 8, c: 2 } },
      { s: { r: 7, c: 3 }, e: { r: 7, c: 8 } },

      { s: { r: 11, c: 1 }, e: { r: 12, c: 2 } },
      { s: { r: 11, c: 3 }, e: { r: 11, c: 5 } },

      { s: { r: 20, c: 1 }, e: { r: 21, c: 2 } },
      { s: { r: 20, c: 3 }, e: { r: 20, c: 4 } },

      { s: { r: 27, c: 1 }, e: { r: 27, c: 7 } },
    ]
    ws["!cols"] = [
      { wch: 2 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 14 },
      { wch: 10 },
      { wch: 12 },
    ]

    const style = (r1: number, c1: number, r2: number, c2: number, s: any, z?: string) => {
      for (let r = r1; r <= r2; r++)
        for (let c = c1; c <= c2; c++) {
          const addr = A(r, c)
          if (!ws[addr]) ws[addr] = { t: "s", v: "" }
          ws[addr].s = { ...(ws[addr].s || {}), ...s }
          if (z) ws[addr].z = z
        }
    }

    // styles
    style(3, 2, 3, 11, sTitle)
    style(3, 12, 4, 13, sHdr)
    style(3, 12, 4, 13, { border: BORDER })

    style(6, 11, 9, 13, { border: BORDER })
    style(6, 11, 9, 11, sHdr)
    style(6, 12, 9, 12, sR, num3)
    style(6, 13, 9, 13, sHdr)

    style(7, 1, 7, 2, sBand)
    style(7, 3, 7, 8, sBand)
    style(8, 3, 8, 8, sHdr)
    style(9, 1, 9, 8, { border: BORDER })
    style(9, 3, 9, 8, sR, num0)
    style(9, 1, 9, 2, sL)

    // GAS FUEL area styling (rows 13–18, cols 1–5)
    style(11, 1, 12, 2, sBand)
    style(11, 3, 12, 5, sBand)
    style(13, 1, 13, 5, { border: BORDER })
    style(14, 1, 18, 5, { border: BORDER })
    style(14, 3, 18, 5, sR, num3) // numbers
    style(15, 3, 15, 5, sR, num0) // m3 in integer format
    style(16, 3, 16, 5, sR, num3) // mmbtu
    style(17, 3, 17, 5, sR, money) // amount
    style(18, 3, 18, 5, sR, num3) // cost/ton

    // COAL block
    style(20, 1, 21, 2, sBand)
    style(20, 3, 20, 4, sBand)
    style(21, 1, 25, 4, { border: BORDER })
    style(21, 3, 21, 4, sHdr)
    style(21, 3, 25, 4, sR, num3)
    style(24, 3, 24, 4, sR, money)
    style(25, 3, 25, 4, sR, num3)

    // Right tables
    style(11, 11, 11, 13, sHdr)
    style(12, 11, 15, 13, { border: BORDER })
    style(12, 11, 15, 11, sHdr)
    style(12, 12, 15, 12, sR, num0)
    style(12, 13, 15, 13, sR)
    style(15, 11, 15, 13, sGreen)

    style(19, 11, 19, 13, sHdr)
    style(20, 11, 24, 13, { border: BORDER })
    style(20, 11, 24, 11, sHdr)
    style(20, 12, 24, 12, sR, money)
    style(20, 13, 24, 13, sR)
    style(24, 11, 24, 13, sGreen)

    // Green fuel cost rows
    style(26, 11, 27, 13, sGreen)
    style(26, 11, 27, 11, sL)
    style(26, 12, 27, 12, sR, num2)
    style(26, 13, 27, 13, sHdr)
    style(26, 14, 27, 14, sHdr)

    // NOTE band
    style(27, 1, 27, 1, sNote)
    style(27, 2, 27, 7, { ...sNote, font: { bold: false } })

    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Steam Report")
    writeFile(wb, `STEAM_GENERATION_REPORT_${monthHdr.replace(" ", "_")}.xlsx`)
  }

  /** ---------- Export click handler ---------- */
  const handleExportXlsx = () => {
    const diffs = buildDiffMap(data)
    exportToXlsx({
      start,
      end,
      diffs,
      gasCostPerM3: typeof gasCostPerM3 === "number" ? gasCostPerM3 : gasCostPerM3 === "" ? 0 : gasCostPerM3,
      gasCostPerMMBtu:
        typeof gasCostPerMMBtu === "number" ? gasCostPerMMBtu : gasCostPerMMBtu === "" ? 0 : gasCostPerMMBtu,
      coalCostPerTon: typeof coalCostPerTon === "number" ? coalCostPerTon : coalCostPerTon === "" ? 0 : coalCostPerTon,
      dieselCostPerLiter:
        typeof dieselCostPerLiter === "number"
          ? dieselCostPerLiter
          : dieselCostPerLiter === ""
            ? 0
            : dieselCostPerLiter,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Steam Generation Report</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and analyze steam generation across all power houses
          </p>
        </div>

        {/* Date Range Form */}
        <SectionCard title="Report Parameters" className="mb-6">
          <form onSubmit={fetchReport} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date & Time
                </label>
                <input
                  id="start-time"
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date & Time
                </label>
                <input
                  id="end-time"
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                <strong className="font-semibold">Error:</strong> {err}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || rangeInvalid}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Spinner className="text-white" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Fetch Data</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPricesModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Fuel Prices</span>
              </button>

              <button
                type="button"
                disabled={data.length === 0}
                onClick={handleExportXlsx}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export XLSX</span>
              </button>
            </div>
          </form>
        </SectionCard>

        {data.length > 0 && (
          <>
            {/* Power House 1 */}
            <SectionCard title="Power House 1" className="mb-6">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <ResponsiveTable>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Generation (tons)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {FREE_STEAM_1.map((id, i) => (
                        <tr key={id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                            {fmt(whrbDiffs1[i])}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(freeSteamTotal1)}
                        </td>
                      </tr>
                      <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                        <td className="px-4 py-3 text-sm text-gray-900">GAS FIRED</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(gasDiff1)}
                        </td>
                      </tr>
                      <tr className="bg-purple-50 font-extrabold border-t-2 border-purple-300">
                        <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(grandTotal1)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ResponsiveTable>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
                  <div className="space-y-1">
                    {FREE_STEAM_1.map((id, i) => (
                      <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs1[i]} />
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Row label="FREE STEAM TOTAL" value={freeSteamTotal1} emphasize />
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <Row label="GAS FIRED" value={gasDiff1} emphasize />
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <Row label="GRAND TOTAL" value={grandTotal1} emphasize />
                </div>
              </div>
            </SectionCard>

            {/* Power House 2 */}
            <SectionCard title="Power House 2" className="mb-6">
              <div className="hidden md:block">
                <ResponsiveTable>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Generation (tons)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {FREE_STEAM_2_ORDERED.map((id, i) => (
                        <tr key={id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                            {fmt(whrbDiffs2[i])}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(freeSteamTotal2)}
                        </td>
                      </tr>
                      <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                        <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(grandTotal2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ResponsiveTable>
              </div>

              <div className="md:hidden space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
                  <div className="space-y-1">
                    {FREE_STEAM_2_ORDERED.map((id, i) => (
                      <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs2[i]} />
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Row label="FREE STEAM TOTAL" value={freeSteamTotal2} emphasize />
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <Row label="GRAND TOTAL" value={grandTotal2} emphasize />
                </div>
              </div>
            </SectionCard>

            {/* Power House 3 */}
            <SectionCard title="Power House 3" className="mb-6">
              <div className="hidden md:block">
                <ResponsiveTable>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Generation (tons)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {FREE_STEAM_3_ORDERED.map((id, i) => (
                        <tr key={id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                            {fmt(whrbDiffs3[i])}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(freeSteamTotal3)}
                        </td>
                      </tr>
                      <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                        <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(grandTotal3)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ResponsiveTable>
              </div>

              <div className="md:hidden space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
                  <div className="space-y-1">
                    {FREE_STEAM_3_ORDERED.map((id, i) => (
                      <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs3[i]} />
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Row label="FREE STEAM TOTAL" value={freeSteamTotal3} emphasize />
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <Row label="GRAND TOTAL" value={grandTotal3} emphasize />
                </div>
              </div>
            </SectionCard>

            {/* Power House 4 */}
            <SectionCard title="Power House 4" className="mb-6">
              <div className="hidden md:block">
                <ResponsiveTable>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Generation (tons)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {FREE_STEAM_4_ORDERED.map((id, i) => (
                        <tr key={id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{TAG_NAMES[id]}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                            {fmt(whrbDiffs4[i])}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="px-4 py-3 text-sm text-gray-900">FREE STEAM TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(freeSteamTotal4)}
                        </td>
                      </tr>
                      <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                        <td className="px-4 py-3 text-sm text-gray-900">GRAND TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(grandTotal4)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ResponsiveTable>
              </div>

              <div className="md:hidden space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Free Steam Sources</h4>
                  <div className="space-y-1">
                    {FREE_STEAM_4_ORDERED.map((id, i) => (
                      <Row key={id} label={TAG_NAMES[id]} value={whrbDiffs4[i]} />
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Row label="FREE STEAM TOTAL" value={freeSteamTotal4} emphasize />
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <Row label="GRAND TOTAL" value={grandTotal4} emphasize />
                </div>
              </div>
            </SectionCard>

            {/* Gas Consumption & HRSG */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SectionCard title="Gas Boiler Consumption">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Gas Used (m³)</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">{fmt(gasUsedM3)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Gas Used (MMBtu)</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
                      {fmt(gasUsedMMBtu)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-amber-50 rounded-lg px-3 mt-3">
                    <span className="text-sm font-semibold text-gray-900">Cost (Rs.)</span>
                    <span className="text-sm font-mono font-bold text-gray-900 tabular-nums">{fmt(gasAmountRsM3)}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="HRSG Duct">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Gas Used (m³)</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
                      {fmt(hrsgGasUsedM3)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Steam (tons)</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
                      {fmt(hrsgDuctTons)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Gas Used (MMBtu)</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 tabular-nums">
                      {fmt(hrsgGasUsedMMBtu)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-amber-50 rounded-lg px-3 mt-3">
                    <span className="text-sm font-semibold text-gray-900">Cost (Rs.)</span>
                    <span className="text-sm font-mono font-bold text-gray-900 tabular-nums">
                      {fmt(hrsgGasAmountRs)}
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Coal Boiler */}
            <SectionCard title="Coal Boiler (Outsource)" className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Coal Consumed</div>
                  <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">
                    {fmt(coalConsumedDisplay)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">tons</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Steam Generated</div>
                  <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">{fmt(coalSteamDiff)}</div>
                  <div className="text-xs text-gray-500 mt-1">tons</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Total Cost</div>
                  <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">{fmt(coalAmount)}</div>
                  <div className="text-xs text-gray-700 mt-1">Rs.</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Cost per Ton</div>
                  <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">{fmt(costPerTonSteam)}</div>
                  <div className="text-xs text-gray-700 mt-1">Rs./ton</div>
                </div>
              </div>
            </SectionCard>

            {/* Fuel Mix Summary */}
            <SectionCard title="Fuel Mix Summary" className="mb-6">
              <div className="hidden md:block">
                <ResponsiveTable>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Fuel Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Generation (tons)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Share (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">FREE (WHRB + Turbine)</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(freeSteamCombined)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmtPct(freeSteamCombined, totalGen)}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">GAS (Boiler)</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(gasGen)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmtPct(gasGen, totalGen)}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">COAL (Outsource)</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(coalGen)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmtPct(coalGen, totalGen)}
                        </td>
                      </tr>
                      <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                        <td className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">
                          {fmt(totalGen)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono text-right tabular-nums">100.0 %</td>
                      </tr>
                    </tbody>
                  </table>
                </ResponsiveTable>
              </div>

              <div className="md:hidden space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">FREE (WHRB + Turbine)</span>
                    <span className="text-sm font-semibold text-blue-600">{fmtPct(freeSteamCombined, totalGen)}</span>
                  </div>
                  <div className="text-right text-sm font-mono text-gray-700 tabular-nums">
                    {fmt(freeSteamCombined)} tons
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">GAS (Boiler)</span>
                    <span className="text-sm font-semibold text-blue-600">{fmtPct(gasGen, totalGen)}</span>
                  </div>
                  <div className="text-right text-sm font-mono text-gray-700 tabular-nums">{fmt(gasGen)} tons</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">COAL (Outsource)</span>
                    <span className="text-sm font-semibold text-blue-600">{fmtPct(coalGen, totalGen)}</span>
                  </div>
                  <div className="text-right text-sm font-mono text-gray-700 tabular-nums">{fmt(coalGen)} tons</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-900">TOTAL</span>
                    <span className="text-sm font-bold text-green-700">100.0 %</span>
                  </div>
                  <div className="text-right text-sm font-mono font-bold text-gray-900 tabular-nums">
                    {fmt(totalGen)} tons
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* HRSG Steam Details */}
            <SectionCard title="HRSG Steam Breakdown" className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-700 uppercase tracking-wide mb-1 font-medium">
                    Free Turbine Steam
                  </div>
                  <div className="text-2xl font-bold text-gray-900 font-mono tabular-nums">{fmt(freeTurbineTons)}</div>
                  <div className="text-xs text-blue-700 mt-1">tons</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs text-purple-700 uppercase tracking-wide mb-1 font-medium">
                    HRSG Duct Steam
                  </div>
                  <div className="text-2xl font-bold text-gray-900 font-mono tabular-nums">{fmt(hrsgDuctTons)}</div>
                  <div className="text-xs text-purple-700 mt-1">tons</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 italic">HRSG Steam Totalizer = Free Turbine + HRSG Duct</div>
            </SectionCard>
          </>
        )}

        {data.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">No data available. Please fetch a report to view results.</p>
          </div>
        )}
      </div>

      {/* Fuel Prices Modal */}
      {showPricesModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPricesModal(false)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Fuel Prices Configuration</h2>
              <button
                onClick={() => setShowPricesModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="gas-mmbtu" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gas Cost (Rs. per MMBtu)
                </label>
                <input
                  id="gas-mmbtu"
                  type="number"
                  step="any"
                  value={gasCostPerMMBtu}
                  onChange={(e) => setGasCostPerMMBtu(asNumberOrEmpty(e.target.value))}
                  placeholder="Enter cost per MMBtu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="gas-m3" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gas Cost (Rs. per m³)
                </label>
                <input
                  id="gas-m3"
                  type="number"
                  step="any"
                  value={gasCostPerM3}
                  onChange={(e) => setGasCostPerM3(asNumberOrEmpty(e.target.value))}
                  placeholder="Enter cost per m³"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="coal-ton" className="block text-sm font-semibold text-gray-700 mb-2">
                  Coal Cost (Rs. per ton)
                </label>
                <input
                  id="coal-ton"
                  type="number"
                  step="any"
                  value={coalCostPerTon}
                  onChange={(e) => setCoalCostPerTon(asNumberOrEmpty(e.target.value))}
                  placeholder="Enter cost per ton"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="diesel-liter" className="block text-sm font-semibold text-gray-700 mb-2">
                  Diesel Cost (Rs. per liter)
                </label>
                <input
                  id="diesel-liter"
                  type="number"
                  step="any"
                  value={dieselCostPerLiter}
                  onChange={(e) => setDieselCostPerLiter(asNumberOrEmpty(e.target.value))}
                  placeholder="Enter cost per liter"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowPricesModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveFuelPrices({
                    gasMMBtu: gasCostPerMMBtu,
                    gasM3: gasCostPerM3,
                    coalTon: coalCostPerTon,
                    dieselL: dieselCostPerLiter,
                  })
                  setShowPricesModal(false)
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}