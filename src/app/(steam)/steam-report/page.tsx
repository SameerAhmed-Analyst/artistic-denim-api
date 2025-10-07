"use client";

import React, { useMemo, useState } from "react";

type TagRecord = { tagId: number; timestamp: string; value: number };
type QueryBody = {
  valueIds: number[];
  timeBegin: string;
  timeEnd: string;
  timeStep: string;
};

const API_URL = "/api/v1/proxy-query";

/** ---------- Power House 1 ---------- */
const FREE_STEAM_1 = [133, 138, 141, 147] as const;
const GAS_ID_1 = 171;

/** ---------- Power House 2 ---------- */
const FREE_STEAM_2_ORDERED = [170, 151, 156, 161] as const; // 1..4
const HRSG_ID_2 = 4460;

const TAG_NAMES: Record<number, string> = {
  // PH1
  133: "WHRB 1",
  138: "WHRB 2",
  141: "WHRB 3",
  147: "WHRB 4",
  171: "Gas fired",
  // PH2
  170: "WHRB 1",
  151: "WHRB 2",
  156: "WHRB 3",
  161: "WHRB 4",
  4460: "HRSG",
};

function toApiTime(local: string) {
  if (!local) return "";
  return local.replace("T", " ") + ":00.000";
}

function fmt(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

/** Small-screen card row */
function Row({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: number | null | undefined;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className={`text-gray-600 ${emphasize ? "font-medium" : ""}`}>
        {label}
      </span>
      <span
        className={`font-mono tabular-nums ${emphasize ? "font-semibold" : ""}`}
      >
        {fmt(value)}
      </span>
    </div>
  );
}

export default function SteamGenerationReport() {
  const [start, setStart] = useState("2025-10-05T00:00");
  const [end, setEnd] = useState("2025-10-05T03:01");
  const [data, setData] = useState<TagRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  // Group records by tag, timestamps sorted
  const grouped = useMemo(() => {
    const m = new Map<number, TagRecord[]>();
    for (const r of data) {
      if (!m.has(r.tagId)) m.set(r.tagId, []);
      m.get(r.tagId)!.push(r);
    }
    for (const arr of m.values()) {
      arr.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
    return m;
  }, [data]);

  // Compute (final - initial) per tag
  function diffFor(tagId: number): number | null {
    const arr = grouped.get(tagId);
    if (!arr || arr.length === 0) return null;
    const first = arr[0].value;
    const last = arr[arr.length - 1].value;
    return last - first;
  }

  /** ---------- Power House 1 totals ---------- */
  const whrbDiffs1 = FREE_STEAM_1.map((id) => diffFor(id));
  const freeSteamTotal1 = whrbDiffs1
    .filter((v): v is number => v != null)
    .reduce((a, b) => a + b, 0);
  const gasDiff1 = diffFor(GAS_ID_1);
  const grandTotal1 = freeSteamTotal1 + (gasDiff1 ?? 0);

  /** ---------- Power House 2 totals ---------- */
  const whrbDiffs2 = FREE_STEAM_2_ORDERED.map((id) => diffFor(id));
  const freeSteamTotal2 = whrbDiffs2.reduce((sum, v) => sum + (v ?? 0), 0);
  const hrsgDiff2 = diffFor(HRSG_ID_2);
  const grandTotal2 = freeSteamTotal2 + (hrsgDiff2 ?? 0);

  async function fetchReport(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setData([]);

    const valueIds = [
      ...FREE_STEAM_1,
      GAS_ID_1,
      ...FREE_STEAM_2_ORDERED,
      HRSG_ID_2,
    ];

    const body: QueryBody = {
      valueIds,
      timeBegin: toApiTime(start),
      timeEnd: toApiTime(end),
      timeStep: "3600,1",
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: TagRecord[] = await res.json();
      setData(json);
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl p-4 sm:p-5 md:p-6">
        <h1 className="mb-4 text-center text-xl font-semibold tracking-tight md:text-2xl">
          Steam Generation Report
        </h1>

        {/* Date-time selection */}
        <form
          onSubmit={fetchReport}
          className="mb-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-5"
        >
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Start</span>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 rounded border border-gray-300 bg-white p-3 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:p-2 sm:text-sm"
              required
            />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">End</span>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 rounded border border-gray-300 bg-white p-3 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:p-2 sm:text-sm"
              required
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-500 active:translate-y-[1px] disabled:opacity-60 sm:py-2 sm:text-sm"
              disabled={loading}
            >
              {loading ? "Fetching…" : "Fetch"}
            </button>
          </div>
        </form>

        {err ? (
          <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-700">
            Error: {err}
          </p>
        ) : null}

        {/* ---------- Power House 1 ---------- */}
        <section className="mb-6">
          <div className="rounded-t border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-medium">
            Power House 1
          </div>

          {/* Mobile cards */}
          <div className="border-x border-b border-gray-200 bg-white p-3 md:hidden">
            <div className="rounded-lg border border-gray-100 p-3">
              {FREE_STEAM_1.map((id) => (
                <Row key={id} label={TAG_NAMES[id]} value={diffFor(id)} />
              ))}
              <Row label="Gas fired" value={gasDiff1} />
              <div className="my-2 h-px bg-gray-100" />
              <Row label="Total" value={grandTotal1} emphasize />
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-b border border-gray-200 bg-white md:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[30%]" />
              </colgroup>
              <thead>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-center">WHRB 1</th>
                  <th className="px-3 py-2 text-center">WHRB 2</th>
                  <th className="px-3 py-2 text-center">WHRB 3</th>
                  <th className="px-3 py-2 text-center">WHRB 4</th>
                  <th className="px-3 py-2 text-center">Gas fired</th>
                  <th className="px-3 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  {FREE_STEAM_1.map((id) => (
                    <td key={id} className="px-3 py-2 text-center font-mono">
                      {fmt(diffFor(id))}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-mono">
                    {fmt(gasDiff1)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono font-semibold">
                    {fmt(grandTotal1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- Power House 2 ---------- */}
        <section>
          <div className="rounded-t border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-medium">
            Power House 2
          </div>

          {/* Mobile cards */}
          <div className="border-x border-b border-gray-200 bg-white p-3 md:hidden">
            <div className="rounded-lg border border-gray-100 p-3">
              {FREE_STEAM_2_ORDERED.map((id) => (
                <Row key={id} label={TAG_NAMES[id]} value={diffFor(id)} />
              ))}
              <Row label="HRSG" value={hrsgDiff2} />
              <div className="my-2 h-px bg-gray-100" />
              <Row label="Total" value={grandTotal2} emphasize />
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-b border border-gray-200 bg-white md:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[30%]" />
              </colgroup>
              <thead>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-center">WHRB 1</th>
                  <th className="px-3 py-2 text-center">WHRB 2</th>
                  <th className="px-3 py-2 text-center">WHRB 3</th>
                  <th className="px-3 py-2 text-center">WHRB 4</th>
                  <th className="px-3 py-2 text-center">HRSG</th>
                  <th className="px-3 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  {FREE_STEAM_2_ORDERED.map((id) => (
                    <td key={id} className="px-3 py-2 text-center font-mono">
                      {fmt(diffFor(id))}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-mono">
                    {fmt(hrsgDiff2)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono font-semibold">
                    {fmt(grandTotal2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-3 text-center text-xs text-gray-600">
          Each value is <span className="font-mono">final − initial</span> over
          the selected range.
        </p>
      </div>
    </div>
  );
}
