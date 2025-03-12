"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Zap, Droplets, Flame, Wind, ArrowRight } from "lucide-react";

// Types for API response
interface Machine {
  Id: number;
  Name: string;
  IsRunning: boolean;
  ShedId: number;
  Electricity: number | null;
  Steam: number | null;
  Water: number | null;
  Gas: number | null;
}

// Simple shed summary interface for UI display
interface ShedSummary {
  id: number;
  totalElectricity: number;
  totalSteam: number;
  totalWater: number;
  totalGas: number;
  machineCount: number;
  runningCount: number;
  hasGasData: boolean;
}

// Function to fetch machines for a specific shed
async function fetchMachines(shedId: number): Promise<Machine[]> {
  try {
    const response = await fetch(`/api/v1/finishing?shedId=${shedId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for shed ${shedId}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching shed ${shedId} data:`, error);
    return [];
  }
}

// Function to calculate shed summary from machines
function calculateShedSummary(
  machines: Machine[],
  shedId: number
): ShedSummary {
  let totalElectricity = 0;
  let totalSteam = 0;
  let totalWater = 0;
  let totalGas = 0;
  let runningCount = 0;
  let hasGasData = false;

  machines.forEach((machine) => {
    if (machine.IsRunning) {
      runningCount++;

      // Add up the values for running machines only
      if (machine.Electricity !== null) {
        totalElectricity += machine.Electricity;
      }

      if (machine.Steam !== null) {
        totalSteam += machine.Steam;
      }

      if (machine.Water !== null) {
        totalWater += machine.Water;
      }

      if (machine.Gas !== null) {
        totalGas += machine.Gas;
        hasGasData = false;
      }
    }
  });

  return {
    id: shedId,
    totalElectricity,
    totalSteam,
    totalWater,
    totalGas,
    machineCount: machines.length,
    runningCount,
    hasGasData,
  };
}

// Skeleton loader component for shed cards
function ShedCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950 shadow-sm animate-pulse">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shed card component - UI only
function ShedCard({ summary }: { summary: ShedSummary }) {
  return (
    <Link
      href={`/finishing/shed/${summary.id}`}
      className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Shed {summary.id}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {summary.runningCount}/{summary.machineCount} Running
            </span>
            <ArrowRight size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Electricity
            </p>
            <p className="font-medium">
              {summary.totalElectricity.toFixed(1)} kW
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-blue-500 bg-blue-100 dark:bg-blue-900/30">
            <Wind size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Steam</p>
            <p className="font-medium">{summary.totalSteam.toFixed(1)} T/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30">
            <Droplets size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Water</p>
            <p className="font-medium">{summary.totalWater.toFixed(1)} L/m</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-red-500 bg-red-100 dark:bg-red-900/30 ${
              !summary.hasGasData ? "opacity-60" : ""
            }`}
          >
            <Flame size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gas</p>
            {summary.hasGasData ? (
              <p className="font-medium">{summary.totalGas.toFixed(1)} m³/h</p>
            ) : (
              <p className="font-medium text-gray-400 dark:text-gray-500">
                Coming soon
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Main dashboard page with skeleton loading
export default function FinishingDashboard() {
  const [shedSummaries, setShedSummaries] = useState<ShedSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch data for both sheds
  const fetchData = useCallback(async () => {
    try {
      // Fetch data for both sheds in parallel
      const [shed1Machines, shed2Machines] = await Promise.all([
        fetchMachines(1),
        fetchMachines(2),
      ]);

      // Calculate summaries
      const shed1Summary = calculateShedSummary(shed1Machines, 1);
      const shed2Summary = calculateShedSummary(shed2Machines, 2);

      setShedSummaries([shed1Summary, shed2Summary]);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling data every second but don't reset loading state.
  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData(); // Poll data every second
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Finishing Department</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Select a shed to view detailed machine information
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // Show skeleton cards only during the initial load
          <>
            <ShedCardSkeleton />
            <ShedCardSkeleton />
          </>
        ) : (
          // Show actual cards when loaded
          shedSummaries.map((summary) => (
            <ShedCard key={summary.id} summary={summary} />
          ))
        )}
      </div>
    </div>
  );
}
