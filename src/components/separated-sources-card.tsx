// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// interface SourceNodeProps {
//   title: string;
//   steamValue: number;
//   pressureValue: number;
//   status: "normal" | "warning" | "critical";
//   color: string;
// }

// const SourceNode = ({
//   title,
//   steamValue,
//   pressureValue,
//   status,
//   color,
// }: SourceNodeProps) => {
//   // Determine colors based on status
//   const getStatusColor = () => {
//     switch (status) {
//       case "critical":
//         return "#dc2626";
//       case "warning":
//         return "#d97706";
//       default:
//         return color;
//     }
//   };

//   const statusColor = getStatusColor();

//   return (
//     <div className="flex flex-col items-center">
//       <div
//         className="relative w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] rounded-full border-2 flex flex-col items-center justify-center bg-white"
//         style={{ borderColor: statusColor }}
//       >
//         {/* Status indicator */}
//         <div
//           className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
//             status === "critical"
//               ? "bg-red-600"
//               : status === "warning"
//               ? "bg-amber-600"
//               : "bg-emerald-600"
//           }`}
//         />

//         {/* Animated status indicator for warning/critical */}
//         {status !== "normal" && (
//           <motion.div
//             className="absolute inset-0 rounded-full"
//             initial={{ opacity: 0.7, scale: 0.9 }}
//             animate={{ opacity: 0, scale: 1.1 }}
//             transition={{
//               repeat: Number.POSITIVE_INFINITY,
//               duration: 1.5,
//               ease: "easeOut",
//             }}
//             style={{ border: `2px solid ${statusColor}` }}
//           />
//         )}

//         {/* Steam value */}
//         <div className="text-center text-xs sm:text-sm font-medium">
//           {steamValue.toFixed(0)} kg/h
//         </div>

//         {/* Pressure value */}
//         <div className="text-center text-xs sm:text-sm text-gray-600">
//           {pressureValue.toFixed(1)} PSI
//         </div>
//       </div>

//       {/* Title */}
//       <div className="mt-2 text-center text-xs sm:text-sm font-medium text-gray-700">
//         {title}
//       </div>
//     </div>
//   );
// };

// export default function SeparatedSourcesCard() {
//   const [sourceData, setSourceData] = useState({
//     // Source values
//     ph1Steam: 280,
//     ph1Pressure: 85.5,
//     ph1Status: "normal" as const,

//     ph2Steam: 220,
//     ph2Pressure: 92.3,
//     ph2Status: "normal" as const,

//     ph3Steam: 180,
//     ph3Pressure: 78.6,
//     ph3Status: "warning" as const,

//     ph4Steam: 120,
//     ph4Pressure: 65.2,
//     ph4Status: "normal" as const,

//     coalSteam: 350,
//     coalPressure: 110.8,
//     coalStatus: "normal" as const,

//     // Total values
//     totalSteam: 1150,
//     systemStatus: "normal" as const,
//   });

//   useEffect(() => {
//     const fetchSourceData = async () => {
//       try {
//         // This is a placeholder for your actual API call
//         // Replace with your actual endpoint
//         const response = await fetch("/api/v1/steam-sources");
//         const data = await response.json();

//         // Uncomment and adjust this when you have the actual API
//         /*
//         setSourceData({
//           ph1Steam: data.data.ph1Steam,
//           ph1Pressure: data.data.ph1Pressure,
//           ph1Status: data.data.ph1Status,

//           ph2Steam: data.data.ph2Steam,
//           ph2Pressure: data.data.ph2Pressure,
//           ph2Status: data.data.ph2Status,

//           ph3Steam: data.data.ph3Steam,
//           ph3Pressure: data.data.ph3Pressure,
//           ph3Status: data.data.ph3Status,

//           ph4Steam: data.data.ph4Steam,
//           ph4Pressure: data.data.ph4Pressure,
//           ph4Status: data.data.ph4Status,

//           coalSteam: data.data.coalSteam,
//           coalPressure: data.data.coalPressure,
//           coalStatus: data.data.coalStatus,

//           totalSteam: data.data.totalSteam,
//           systemStatus: data.data.systemStatus,
//         });
//         */

//         // For demo purposes, let's randomize the values slightly
//         setSourceData((prevData) => {
//           // Randomly change PH3 status between warning and critical
//           const ph3NewStatus =
//             Math.random() > 0.8 ? ("critical" as const) : ("warning" as const);

//           return {
//             ...prevData,
//             ph1Steam: prevData.ph1Steam + (Math.random() * 10 - 5),
//             ph1Pressure: prevData.ph1Pressure + (Math.random() * 2 - 1),

//             ph2Steam: prevData.ph2Steam + (Math.random() * 10 - 5),
//             ph2Pressure: prevData.ph2Pressure + (Math.random() * 2 - 1),

//             ph3Steam: prevData.ph3Steam + (Math.random() * 10 - 5),
//             ph3Pressure: prevData.ph3Pressure + (Math.random() * 2 - 1),
//             ph3Status: ph3NewStatus,

//             ph4Steam: prevData.ph4Steam + (Math.random() * 10 - 5),
//             ph4Pressure: prevData.ph4Pressure + (Math.random() * 2 - 1),

//             coalSteam: prevData.coalSteam + (Math.random() * 15 - 7.5),
//             coalPressure: prevData.coalPressure + (Math.random() * 3 - 1.5),

//             systemStatus:
//               ph3NewStatus === "critical"
//                 ? ("warning" as const)
//                 : ("normal" as const),
//             totalSteam:
//               prevData.ph1Steam +
//               prevData.ph2Steam +
//               prevData.ph3Steam +
//               prevData.ph4Steam +
//               prevData.coalSteam,
//           };
//         });
//       } catch (error) {
//         console.error("Error fetching source data:", error);
//       }
//     };

//     // Fetch data every 2 seconds
//     const intervalId = setInterval(fetchSourceData, 2000);

//     // Cleanup the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//       <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//           <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0">
//             Steam Sources
//           </h2>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-1">
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   sourceData.systemStatus === "critical"
//                     ? "bg-red-600"
//                     : sourceData.systemStatus === "warning"
//                     ? "bg-amber-600"
//                     : "bg-emerald-600"
//                 }`}
//               />
//               <span className="text-xs text-gray-500">
//                 {sourceData.systemStatus.toUpperCase()}
//               </span>
//             </div>
//             <div className="text-sm font-medium">
//               Total:{" "}
//               <span className="font-mono">
//                 {sourceData.totalSteam.toFixed(0)} kg/h
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 justify-items-center">
//           <SourceNode
//             title="Power House 1"
//             steamValue={sourceData.ph1Steam}
//             pressureValue={sourceData.ph1Pressure}
//             status={sourceData.ph1Status}
//             color="#3b82f6"
//           />

//           <SourceNode
//             title="Power House 2"
//             steamValue={sourceData.ph2Steam}
//             pressureValue={sourceData.ph2Pressure}
//             status={sourceData.ph2Status}
//             color="#8b5cf6"
//           />

//           <div className="col-span-2 sm:col-span-1 sm:order-none">
//             <SourceNode
//               title="Coal Boiler"
//               steamValue={sourceData.coalSteam}
//               pressureValue={sourceData.coalPressure}
//               status={sourceData.coalStatus}
//               color="#10b981"
//             />
//           </div>

//           <SourceNode
//             title="Power House 3"
//             steamValue={sourceData.ph3Steam}
//             pressureValue={sourceData.ph3Pressure}
//             status={sourceData.ph3Status}
//             color="#ec4899"
//           />

//           <SourceNode
//             title="Power House 4"
//             steamValue={sourceData.ph4Steam}
//             pressureValue={sourceData.ph4Pressure}
//             status={sourceData.ph4Status}
//             color="#f59e0b"
//           />
//         </div>
//       </div>

//       <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
//         <span>Updated: {new Date().toLocaleTimeString()}</span>
//         <span>Steam Sources Monitoring System</span>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

interface SourceNodeProps {
  title: string;
  steamValue: number;
  pressureValue: number;
  color: string;
}

const SourceNode = ({
  title,
  steamValue,
  pressureValue,
  color,
}: SourceNodeProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] rounded-full border-2 flex flex-col items-center justify-center bg-white"
        style={{ borderColor: color }}
      >
        <div className="text-center text-[10px] font-bold">
          {steamValue.toFixed(2)} TON/h
        </div>
        <div className="text-center text-[10px] text-gray-600">
          {pressureValue.toFixed(1)} PSI
        </div>
        <div className="absolute bottom-1 text-center text-[8px] font-medium text-gray-700">
          {title}
        </div>
      </div>
    </div>
  );
};

export default function SeparatedSourcesCard() {
  const [sourceData, setSourceData] = useState({
    ph1Steam: 0,
    ph2Steam: 0,
    ph3Steam: 0,
    ph4Steam: 0,
    coalSteam: 0,
  });

  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const response = await fetch("/api/v1/dashboard");
        const data = await response.json();

        const dashboardData = data.data.dashboard[0];

        if (dashboardData) {
          setSourceData({
            ph1Steam: dashboardData.steamph1 ?? 0,
            ph2Steam: dashboardData.steamph2 ?? 0,
            ph3Steam: dashboardData.steamph3 ?? 0,
            ph4Steam: dashboardData.steamph4 ?? 0,
            coalSteam: dashboardData.cb ?? 0,
          });
        }
      } catch (error) {
        console.error("Error fetching source data:", error);
      }
    };

    fetchSourceData();
    const intervalId = setInterval(fetchSourceData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
        <SourceNode
          title="PH 1"
          steamValue={sourceData.ph1Steam}
          pressureValue={0.0}
          color="#8b5cf6"
        />
        <SourceNode
          title="PH 2"
          steamValue={sourceData.ph2Steam}
          pressureValue={0.0}
          color="#8b5cf6"
        />
        <SourceNode
          title="PH 3"
          steamValue={sourceData.ph3Steam}
          pressureValue={0.0}
          color="#8b5cf6"
        />
        <SourceNode
          title="PH 4"
          steamValue={sourceData.ph4Steam}
          pressureValue={0.0}
          color="#8b5cf6"
        />
        <div className="col-span-2 sm:col-span-1 sm:order-none">
          <SourceNode
            title="CB"
            steamValue={sourceData.coalSteam}
            pressureValue={0.0}
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  );
}
