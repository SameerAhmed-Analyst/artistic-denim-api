// app/backprocess/shed/[shedNumber]/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Wind,
  Droplets,
} from "lucide-react";

// Types for API response
type UtilityType = "Electricity" | "Steam" | "Water" | "SteamKitchen";

interface Machine {
  Id: number;
  Name: string;
  IsRunning: boolean;
  ShedId: number;
  Electricity: number | null;
  Steam: number | null;
  Water: number | null;
  Steam_Kitchen: number | null;
}

const utilityIcons: Record<
  UtilityType,
  { icon: React.ReactNode; color: string }
> = {
  Electricity: {
    icon: <Zap size={14} />,
    color: "text-yellow-500 bg-yellow-100",
  },
  Steam: {
    icon: <Wind size={14} />,
    color: "text-blue-500 bg-blue-100",
  },
  Water: {
    icon: <Droplets size={14} />,
    color: "text-cyan-500 bg-cyan-100",
  },
  SteamKitchen: {
    icon: <Wind size={14} />,
    color: "text-blue-500 bg-blue-100",
  },
};

// Machine Card Component
function MachineCard({ machine }: { machine: Machine }) {
  const [expanded, setExpanded] = useState(false);

  // Collect the utilities that have a non-null value
  const utilities: UtilityType[] = [];
  if (machine.Electricity !== null) utilities.push("Electricity");
  if (machine.Steam !== null) utilities.push("Steam");
  if (machine.Water !== null) utilities.push("Water");
  if (machine.Steam_Kitchen !== null) utilities.push("SteamKitchen"); // Add only if value is not null

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              machine.IsRunning ? "bg-green-500" : "bg-gray-300"
            )}
          />
          <h3 className="font-medium text-sm">{machine.Name}</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {utilities.map((utility) => (
              <div
                key={utility}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center",
                  utilityIcons[utility].color
                )}
                title={utility}
              >
                {utilityIcons[utility].icon}
              </div>
            ))}
          </div>

          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 text-sm border-t">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">Status</span>
            <span
              className={cn(
                "flex items-center gap-1",
                machine.IsRunning ? "text-green-600" : "text-gray-500"
              )}
            >
              <Activity size={14} />
              {machine.IsRunning ? "Running" : "Stopped"}
            </span>
          </div>

          <div className="space-y-1.5">
            {utilities.map((utility) => (
              <div key={utility} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center",
                      utilityIcons[utility].color
                    )}
                  >
                    {utilityIcons[utility].icon}
                  </div>
                  <span className="text-gray-600">{utility}</span>
                </div>
                <div className="text-gray-600">
                  {machine[utility] !== null
                    ? `${machine[utility]} ${
                        utility === "Electricity"
                          ? "kW" // Electricity -> kW
                          : utility === "Water"
                          ? "m³/h" // Water -> m³/h
                          : "TON/h" // Steam and SteamKitchen -> TON/h
                      }`
                    : "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchMachines(shedId: number): Promise<Machine[]> {
  try {
    const response = await fetch(`/api/v1/backprocess?shedId=${shedId}`, {
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

export default function ShedPage({
  params,
}: {
  params: { shedNumber: string };
}) {
  const shedId = parseInt(params.shedNumber, 10);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const shedMachines = await fetchMachines(shedId);
        setMachines(shedMachines);
        setLoading(false);
      } catch (error) {
        console.error("Error loading machines:", error);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [shedId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Backprocess Shed {shedId}</h1>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          {machines.length} Machines
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {machines.map((machine) => (
          <MachineCard key={machine.Id} machine={machine} />
        ))}
      </div>
    </div>
  );
}
