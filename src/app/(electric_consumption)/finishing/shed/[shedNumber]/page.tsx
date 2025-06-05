// "use client";
// import React, { useEffect, useState } from 'react';

// interface Consumption {
//   UtilityType: string;
//   Instantaneous: number;
//   TillNow: number;
//   Unit: string;
// }

// interface Machine {
//   MachineID: number;
//   MachineName: string;
//   Status: number;  // 1 = ON, 0 = OFF
//   Consumption: Consumption[];  // Grouped consumption data
// }

// export default function Shed1Page() {
//   const [machines, setMachines] = useState<Machine[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchMachines = async () => {
//     try {
//       const res = await fetch('/api/v1/finishing?shed=2');  // Fetch data for Shed 1
//       const data = await res.json();
//     //   console.log("Fetched data:", data);  // Log the fetched data

//       // Group consumption data by MachineID
//       const groupedMachines: Machine[] = [];
//       data.forEach((entry: any) => {
//         const machineIndex = groupedMachines.findIndex((machine) => machine.MachineID === entry.MachineID);
//         if (machineIndex === -1) {
//           // If machine is not in the list, add it with the first consumption
//           groupedMachines.push({
//             MachineID: entry.MachineID,
//             MachineName: entry.MachineName,
//             Status: entry.Status,
//             Consumption: [{
//               UtilityType: entry.UtilityType,
//               Instantaneous: entry.Instantaneous,
//               TillNow: entry.TillNow,
//               Unit: entry.Unit
//             }],
//           });
//         } else {
//           // If machine already exists, append the consumption data
//           groupedMachines[machineIndex].Consumption.push({
//             UtilityType: entry.UtilityType,
//             Instantaneous: entry.Instantaneous,
//             TillNow: entry.TillNow,
//             Unit: entry.Unit
//           });
//         }
//       });

//       setMachines(groupedMachines);
//       setLoading(false);  // Set loading to false after data is fetched
//     } catch (error) {
//       console.error("Error fetching machine data:", error);
//       setLoading(false);  // Set loading to false if an error occurs
//     }
//   };

//   useEffect(() => {
//     fetchMachines();
//     const intervalId = setInterval(fetchMachines, 1000);  // Fetch every 1 second
//     return () => clearInterval(intervalId);  // Cleanup on component unmount
//   }, []);

//   // If still loading, show loading message
//   if (loading) {
//     return <div className="text-center text-lg">Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4 sm:p-6">
//       <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
//         SHED 1 <sup className="text-red-600 text-xs">* Testing</sup>
//       </h1>

//       {/* Render each machine */}
//       {machines.length > 0 ? (
//         machines.map((machine) => (
//           <div
//             key={machine.MachineID}
//             className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-transform transform hover:scale-105"
//           >
//             {/* Machine Name and Status Indicator */}
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg sm:text-xl font-bold text-gray-800">{machine.MachineName}</h2>
//               <div
//                 className={`w-4 h-4 rounded-full ${machine.Status === 1 ? "bg-green-500" : "bg-red-500"}`}
//               ></div>
//             </div>

//             {/* Consumption Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="px-3 py-2 text-left text-sm sm:text-base">UTILITY</th>
//                     <th className="px-3 py-2 text-left text-sm sm:text-base">INSTANT</th>
//                     <th className="px-3 py-2 text-left text-sm sm:text-base">TILL NOW</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Map over consumption data */}
//                   {machine.Consumption && machine.Consumption.length > 0 ? (
//                     machine.Consumption.map((cons, index) => (
//                       <tr key={index} className="border-b">
//                         <td className="px-3 py-2 text-sm sm:text-base">{cons.UtilityType}</td>
//                         <td className="px-3 py-2 text-sm sm:text-base">
//                           {cons.Instantaneous} {cons.Unit}
//                         </td>
//                         <td className="px-3 py-2 text-sm sm:text-base">
//                           {cons.TillNow} {cons.Unit}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="px-3 py-2 text-sm sm:text-base text-center text-gray-500">
//                         No consumption data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center text-lg text-gray-500">No machines found</div>
//       )}
//     </div>
//   );
// }

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  Droplets,
  Flame,
  Wind,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { notFound } from "next/navigation";

// Types
type UtilityType = "Electricity" | "Steam" | "Water" | "Gas";

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

// API function
async function getMachines(shedId: number) {
  try {
    const res = await fetch(`/api/v1/finishing?shedId=${shedId}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await res.json();
    console.log("API Response:", result); // ✅ Check if API returns correct data
    return result.data;
  } catch (error) {
    console.log("error: " + error);
    return [];
  }
}

// Machine card component
function MachineCard({ machine }: { machine: Machine }) {
  const [expanded, setExpanded] = useState(false);

  // Determine which utilities this machine has
  const utilities: UtilityType[] = [];
  if (machine.Electricity !== null) utilities.push("Electricity");
  if (machine.Steam !== null) utilities.push("Steam");
  if (machine.Water !== null) utilities.push("Water");
  if (machine.Gas !== null) utilities.push("Gas");

  // Utility icons mapping
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
    Gas: {
      icon: <Flame size={14} />,
      color: "text-red-500 bg-red-100",
    },
  };

  // Helper function to combine class names
  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  // Utility value mapping
  const utilityValues: Record<
    UtilityType,
    { value: number | null; unit: string }
  > = {
    Electricity: { value: machine.Electricity, unit: "kW" },
    Steam: { value: machine.Steam, unit: "T/h" },
    Water: { value: machine.Water, unit: "m³/h" },
    Gas: { value: machine.Gas, unit: "m³/h" },
  };

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
              machine.IsRunning
                ? "bg-green-500"
                : "bg-gray-300"
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
                machine.IsRunning
                  ? "text-green-600"
                  : "text-gray-500"
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
                  <span className="text-gray-600">
                    {utility}
                  </span>
                </div>
                <div className="text-gray-600">
                  {utilityValues[utility].value !== null
                    ? `${utilityValues[utility].value} ${utilityValues[utility].unit}`
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

// Main page component
export default function ShedPage({
  params,
}: {
  params: { shedNumber: string };
}) {
  const shedId = Number.parseInt(params.shedNumber);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  // Validate shed ID
  if (isNaN(shedId) || shedId < 1 || shedId > 2) {
    notFound();
  }

  // Fetch data function
  const refreshData = async () => {
    const data = await getMachines(shedId);
    console.log("Fetched Machines:", data); // ✅ Check if data is coming

    // 🔥 Convert API response to match expected format
    // const formattedMachines = data.map((machine: any) => ({
    //   id: machine.Id,
    //   name: machine.Name,
    //   isRunning: machine.IsRunning,
    //   shedId: machine.ShedId,
    //   electricity: machine.Electricity,
    //   steam: machine.Steam,
    //   water: machine.Water,
    //   gas: machine.Gas,
    // }));

    // setMachines(formattedMachines);
    setMachines(data);
    setLoading(false);
  };

  // Set up polling
  useEffect(() => {
    refreshData();

    const intervalId = setInterval(() => {
      refreshData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [shedId]);

  // Loading state
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
        <h1 className="text-2xl font-bold">Finishing Shed {shedId}</h1>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          {machines.length} Machines
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {machines.map((machine) => (
          <MachineCard key={machine.Id} machine={machine} />
        ))}
      </div>
    </div>
  );
}
