// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// interface OverviewData {
//   id: number;
//   KW_BRIDGE_TRANSFORMER_PH2: number;
//   KW_AM17_SPINNING_PH2: number;
//   TOWARDS_PH1_kw: number;
//   TOWARDS_PH2_kw: number;
// }

// interface DashboardData {
//   id: 1;
//   powerhouse1gen: number;
//   powerhouse2gen: number;
//   powerhouse3gen: number;
//   AM17_PH2: number;
//   totalpowergen: number;
// }

// async function getData() {
//   try {
//     const res = await fetch("/api/v1/overview", {
//       method: "GET",
//       cache: "no-store",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return {};
//   }
// }

// const FloatingLine = ({ path, color, reverse = false }) => (
//   <motion.path
//     d={path}
//     stroke={color}
//     strokeWidth="3"
//     fill="none"
//     strokeDasharray="10,15"
//     initial={{ strokeDashoffset: 0 }}
//     animate={{ strokeDashoffset: reverse ? 100 : -100 }}
//     transition={{
//       repeat: Number.POSITIVE_INFINITY,
//       duration: 3,
//       ease: "linear",
//     }}
//   />
// );

// const Node = ({ x, y, color, title, value }) => (
//   <g transform={`translate(${x},${y})`}>
//     <circle r="40" fill="white" stroke={color} strokeWidth="2" />
//     <text x="0" y="0" textAnchor="middle" className="text-[10px] font-medium">
//       {value}
//     </text>
//     <text
//       x="0"
//       y="30"
//       textAnchor="middle"
//       className="text-[10px] text-gray-500"
//     >
//       {title}
//     </text>
//   </g>
// );

// const FlowValue = ({ x, y, value, rotate = 0 }) => (
//   <text
//     x={x}
//     y={y}
//     textAnchor="middle"
//     className="text-[10px] font-medium fill-gray-600"
//     transform={`rotate(${rotate} ${x} ${y})`}
//   >
//     {value}
//   </text>
// );

// export default function EnergyFlow() {
//   const [isReverse, setIsReverse] = useState(false);
//   const [totalKW, setTotalKW] = useState({ value: 2526.4 });
//   const [data, setData] = useState<OverviewData[]>([]);
//   const [data1, setData1] = useState<DashboardData[]>([]);

//   const refreshList = async () => {
//     const result = await getData();
//     setData(result?.data || []);
//     setData1(result?.data1 || []);
//   };

//   useEffect(() => {
//     refreshList();

//     const intervalId = setInterval(() => {
//       refreshList();
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const paths = {
//     ph1ToPH2: "M100,100 L300,100",
//     ph2ToPH3: "M300,100 L300,300",
//     ph3ToPH4: "M300,300 L100,300",
//   };

//   const flowData = {
//     ph1ToPH2: {
//       forward: `${
//         data.length > 0
//           ? data.map((item) => item.KW_BRIDGE_TRANSFORMER_PH2)
//           : "0 KW"
//       }`,
//       reverse: "2,402 KW",
//     },
//     ph2ToPH3: {
//       forward: `${
//         data.length > 0 ? data.map((item) => item.KW_AM17_SPINNING_PH2) : "0 KW"
//       }`,
//       reverse: "300 KW",
//     },
//     ph3ToPH4: {
//       forward: `${
//         data.length > 0 ? data.map((item) => item.TOWARDS_PH2_kw) : "0 KW"
//       }`,
//       reverse: `${
//         data.length > 0 ? data.map((item) => item.TOWARDS_PH1_kw) : "0 KW"
//       }`,
//     },
//   };

//   useEffect(() => {
//     const newValue = isReverse ? 17020 : 2526.4;
//     setTotalKW({ value: newValue });
//   }, [isReverse]);

//   return (
//     <svg
//       className="w-full max-w-[400px] h-auto"
//       viewBox="0 0 400 400"
//       preserveAspectRatio="xMidYMid meet"
//     >
//       {/* Static Paths */}
//       <path d={paths.ph1ToPH2} stroke="#e5e7eb" strokeWidth="2" fill="none" />
//       <path d={paths.ph2ToPH3} stroke="#e5e7eb" strokeWidth="2" fill="none" />
//       <path d={paths.ph3ToPH4} stroke="#e5e7eb" strokeWidth="2" fill="none" />

//       {/* Floating Lines */}
//       <FloatingLine path={paths.ph1ToPH2} color="#fbbf24" reverse={false} />
//       <FloatingLine path={paths.ph2ToPH3} color="#ec4899" reverse={false} />
//       <FloatingLine path={paths.ph3ToPH4} color="#fb1f24" reverse={true} />

//       {/* Flow Values */}
//       <FlowValue
//         x="200"
//         y="80"
//         value={
//           isReverse
//             ? `← ${flowData.ph1ToPH2.reverse}`
//             : `${flowData.ph1ToPH2.forward} →`
//         }
//       />
//       <FlowValue
//         x="320"
//         y="200"
//         value={
//           isReverse
//             ? `↑ ${flowData.ph2ToPH3.reverse}`
//             : `${flowData.ph2ToPH3.forward} ↓`
//         }
//         rotate={-90}
//       />
//       <FlowValue
//         x="200"
//         y="320"
//         value={
//           isReverse
//             ? `← ${flowData.ph3ToPH4.forward}`
//             : `${flowData.ph3ToPH4.reverse} →`
//         }
//       />

//       {/* Total KW in the middle (Simplified) */}
//       <text
//         x="200"
//         y="190"
//         textAnchor="middle"
//         className="text-[14px] font-bold fill-gray-700"
//       >
//         Total KW
//       </text>
//       <text
//         x="200"
//         y="220"
//         textAnchor="middle"
//         className="text-[18px] font-medium fill-gray-700"
//       >
//         {data1.map((item) => item.totalpowergen)} KW
//       </text>

//       {/* Nodes (One value per node) */}
//       <Node
//         x={100}
//         y={100}
//         color="#fbbf24"
//         title="PH1"
//         value="2,402 KW" // One value in node
//       />
//       <Node
//         x={300}
//         y={100}
//         color="#ec4899"
//         title="PH2"
//         value="0 W" // One value in node
//       />
//       <Node
//         x={100}
//         y={300}
//         color="#60a5fa"
//         title="PH4"
//         value="466.1 kW" // One value in node
//       />
//       <Node
//         x={300}
//         y={300}
//         color="#fb1f24"
//         title="PH3"
//         value="300 KW" // One value in node
//       />
//     </svg>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const FloatingLine = ({ path, color, reverse = false }) => (
//   <motion.path
//     d={path}
//     stroke={color}
//     strokeWidth="3"
//     fill="none"
//     strokeDasharray="10,15"
//     initial={{ strokeDashoffset: 0 }}
//     animate={{ strokeDashoffset: reverse ? 100 : -100 }}
//     transition={{
//       repeat: Number.POSITIVE_INFINITY,
//       duration: 3,
//       ease: "linear",
//     }}
//   />
// );

// const Node = ({ x, y, color, title, values }) => (
//   <g transform={`translate(${x},${y})`}>
//     <circle r="40" fill="white" stroke={color} strokeWidth="2" />
//     {values.map((value, i) => (
//       <text
//         key={i}
//         x="0"
//         y={i * 20 - 10}
//         textAnchor="middle"
//         className="text-[10px] font-medium"
//       >
//         {value}
//       </text>
//     ))}
//     <text
//       x="0"
//       y="30"
//       textAnchor="middle"
//       className="text-[10px] text-gray-500"
//     >
//       {title}
//     </text>
//   </g>
// );

// const FlowValue = ({ x, y, value, rotate = 0 }) => (
//   <text
//     x={x}
//     y={y}
//     textAnchor="middle"
//     className="text-[10px] font-medium fill-gray-600"
//     transform={`rotate(${rotate} ${x} ${y})`}
//   >
//     {value}
//   </text>
// );

// export default function EnergyFlow() {
//   const [isReverse, setIsReverse] = useState(false);
//   const [totalKW, setTotalKW] = useState({ value: 2526.4, isIncreasing: true });

//   const paths = {
//     solarToGenset: "M100,100 L300,100",
//     gensetToPH2: "M300,100 L300,300",
//     ph2ToGrid: "M300,300 L100,300",
//   };

//   const flowData = {
//     solarToGenset: { forward: "1,594.2 KW", reverse: "2,402 KW" },
//     gensetToPH2: { forward: "466.1 KW", reverse: "300 KW" },
//     ph2ToGrid: { forward: "466.1 KW", reverse: "0 W" },
//   };

//   useEffect(() => {
//     const newValue = isReverse ? 17020 : 2526.4;
//     setTotalKW((prev) => ({
//       value: newValue,
//       isIncreasing: newValue > prev.value,
//     }));
//   }, [isReverse]);

//   return (
//     <div className="m-auto w-auto flex flex-col items-center justify-center bg-gray-50 p-2">
//       <svg
//         className="w-full max-w-[400px] h-auto"
//         viewBox="0 0 400 400"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         {/* Static Paths */}
//         <path
//           d={paths.solarToGenset}
//           stroke="#e5e7eb"
//           strokeWidth="2"
//           fill="none"
//         />
//         <path
//           d={paths.gensetToPH2}
//           stroke="#e5e7eb"
//           strokeWidth="2"
//           fill="none"
//         />
//         <path
//           d={paths.ph2ToGrid}
//           stroke="#e5e7eb"
//           strokeWidth="2"
//           fill="none"
//         />

//         {/* Floating Lines */}
//         <FloatingLine
//           path={paths.solarToGenset}
//           color="#fbbf24"
//           reverse={isReverse}
//         />
//         <FloatingLine
//           path={paths.gensetToPH2}
//           color="#ec4899"
//           reverse={isReverse}
//         />
//         <FloatingLine
//           path={paths.ph2ToGrid}
//           color="#fb1f24"
//           reverse={isReverse}
//         />

//         {/* Flow Values */}
//         <FlowValue
//           x="200"
//           y="80"
//           value={
//             isReverse
//               ? `← ${flowData.solarToGenset.reverse}`
//               : `${flowData.solarToGenset.forward} →`
//           }
//         />
//         <FlowValue
//           x="320"
//           y="200"
//           value={
//             isReverse
//               ? `↑ ${flowData.gensetToPH2.reverse}`
//               : `${flowData.gensetToPH2.forward} ↓`
//           }
//           rotate={-90}
//         />
//         <FlowValue
//           x="200"
//           y="320"
//           value={
//             isReverse
//               ? `← ${flowData.ph2ToGrid.reverse}`
//               : `${flowData.ph2ToGrid.forward} →`
//           }
//         />

//         {/* Total KW in the middle */}
//         <text
//           x="200"
//           y="190"
//           textAnchor="middle"
//           className="text-[14px] font-bold fill-gray-700"
//         >
//           Total KW
//         </text>
//         <text
//           x="200"
//           y="220"
//           textAnchor="middle"
//           className={`text-[18px] font-medium ${
//             totalKW.isIncreasing ? "fill-green-500" : "fill-red-500"
//           }`}
//         >
//           {totalKW.value.toLocaleString(undefined, {
//             minimumFractionDigits: 1,
//             maximumFractionDigits: 1,
//           })}{" "}
//           KW
//           {totalKW.isIncreasing ? " ▲" : " ▼"}
//         </text>

//         {/* Nodes */}
//         <Node
//           x={100}
//           y={100}
//           color="#fbbf24"
//           title="PH1"
//           values={["2,402 KW", "1,594.2 KW"]}
//         />
//         <Node
//           x={300}
//           y={100}
//           color="#ec4899"
//           title="PH2"
//           values={["0 W", "0 W"]}
//         />
//         <Node
//           x={100}
//           y={300}
//           color="#60a5fa"
//           title="PH3"
//           values={["0 W", "466.1 kW"]}
//         />
//         <Node
//           x={300}
//           y={300}
//           color="#fb1f24"
//           title="PH4"
//           values={["466.1 kW", "300 KW"]}
//         />
//       </svg>
//     </div>
//   );
// }

// ======================================================================

// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const FloatingLine = ({ path, color, reverse = false }) => (
//   <motion.path
//     d={path}
//     stroke={color}
//     strokeWidth="3"
//     fill="none"
//     strokeDasharray="10,15"
//     initial={{ strokeDashoffset: 0 }}
//     animate={{ strokeDashoffset: reverse ? 100 : -100 }}
//     transition={{
//       repeat: Number.POSITIVE_INFINITY,
//       duration: 3,
//       ease: "linear",
//     }}
//   />
// );

// const Node = ({ x, y, color, title, value }) => (
//   <g transform={`translate(${x},${y})`}>
//     <circle r="40" fill="white" stroke={color} strokeWidth="2" />
//     {/* Value positioned at the center of the circle */}
//     <text
//       x="0"
//       y="0"
//       textAnchor="middle"
//       alignmentBaseline="middle"
//       className="text-[12px] font-medium"
//     >
//       {value} {/* Displaying the numeric value */}
//     </text>
//     <text
//       x="0"
//       y="30"
//       textAnchor="middle"
//       className="text-[10px] text-gray-500"
//     >
//       {title}
//     </text>
//   </g>
// );

// const FlowValue = ({ x, y, value, rotate = 0 }) => (
//   <text
//     x={x}
//     y={y}
//     textAnchor="middle"
//     className="text-[10px] font-medium fill-gray-600"
//     transform={`rotate(${rotate} ${x} ${y})`}
//   >
//     {value} {/* Displaying the numeric value */}
//   </text>
// );

// export default function EnergyFlow() {
//   const [flowData, setFlowData] = useState({
//     ph1toPH2: 0,
//     ph2toPH3: 0,
//     ph3toPH4: 0,
//     totalGen: 0,
//   });

//   useEffect(() => {
//     // Replace with your API endpoint
//     const fetchFlowData = async () => {
//       try {
//         const response = await fetch("/api/energy-flow");
//         const data = await response.json();
//         // console.log(data.data.overview[0]);
//         // console.log(data.data.dashboard[0].totalpowergen);
//         setFlowData({
//           ph1toPH2: data.data.overview[0].KW_BRIDGE_TRANSFORMER_PH2,
//           ph2toPH3: data.data.overview[0].KW_AM17_SPINNING_PH2,
//           ph3toPH4: data.data.overview[0].TOWARDS_PH2_kw,
//           totalGen: data.data.dashboard[0].totalpowergen,
//         });
//       } catch (error) {
//         console.error("Error fetching flow data:", error);
//       }
//     };

//     // Fetch data every 1 second (1000ms)
//     const intervalId = setInterval(fetchFlowData, 1000);

//     // Cleanup the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, []); // Empty dependency array ensures this runs only once, when the component mounts.

//   const paths = {
//     ph1toPH2: "M100,100 L300,100",
//     ph2toPH3: "M300,100 L300,300",
//     ph3toPH4: "M300,300 L100,300",
//   };

//   return (
//     <div className="m-auto w-auto flex flex-col items-center justify-center bg-gray-50 p-2">
//       <svg
//         className="w-full max-w-[400px] h-auto"
//         viewBox="0 0 400 400"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         {/* Static Paths */}
//         <path d={paths.ph1toPH2} stroke="#e5e7eb" strokeWidth="2" fill="none" />
//         <path d={paths.ph2toPH3} stroke="#e5e7eb" strokeWidth="2" fill="none" />
//         <path d={paths.ph3toPH4} stroke="#e5e7eb" strokeWidth="2" fill="none" />

//         {/* Floating Lines */}
//         {/* <FloatingLine path={paths.ph1toPH2} color="#fbbf24" /> */}
//         {flowData.ph1toPH2 > 0 ? (
//           <FloatingLine path={paths.ph1toPH2} color="#fbbf24" reverse={false} />
//         ) : (
//           <FloatingLine path={paths.ph1toPH2} color="#fbbf24" reverse={true} />
//         )}
//         <FloatingLine path={paths.ph2toPH3} color="#ec4899" />
//         {/* <FloatingLine path={paths.ph3toPH4} color="#fb1f24" /> */}
//         {flowData.ph3toPH4 > 0 ? (
//           <FloatingLine path={paths.ph3toPH4} color="#fb1f24" reverse={false} />
//         ) : (
//           <FloatingLine path={paths.ph3toPH4} color="#fb1f24" reverse={true} />
//         )}

//         {/* Flow Values */}
//         <FlowValue
//           x="200"
//           y="80"
//           value={`${Math.abs(flowData.ph1toPH2)} KW ${
//             flowData.ph1toPH2 > 0 ? "→" : "←"
//           }`}
//         />
//         <FlowValue
//           x="320"
//           y="200"
//           value={`${flowData.ph2toPH3} KW ↓`}
//           rotate={-90}
//         />
//         <FlowValue
//           x="200"
//           y="320"
//           value={`${Math.abs(flowData.ph3toPH4)} KW ${
//             flowData.ph3toPH4 > 0 ? "←" : "→"
//           }`}
//         />

//         {/* Total KW in the middle */}
//         <text
//           x="200"
//           y="190"
//           textAnchor="middle"
//           className="text-[14px] font-bold fill-gray-700"
//         >
//           Total KW
//         </text>
//         <text
//           x="200"
//           y="220"
//           textAnchor="middle"
//           className="text-[18px] font-medium fill-gray-700"
//         >
//           {flowData.totalGen} KW
//         </text>

//         {/* Nodes */}
//         <Node x={100} y={100} color="#fbbf24" title="PH1" value={`1 MW`} />
//         <Node x={300} y={100} color="#ec4899" title="PH2" value="2 MW" />
//         <Node x={300} y={300} color="#fb1f24" title="PH3" value={`3 MW`} />
//         <Node x={100} y={300} color="#60a5fa" title="PH4" value={`4 MW`} />
//       </svg>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FloatingLineProps {
  path: string;
  color: string;
  reverse?: boolean;
}

interface NodeProps {
  x: number;
  y: number;
  color: string;
  title: string;
  value: string;
}

interface FlowValueProps {
  x: string;
  y: string;
  value: string;
  rotate?: number;
}

const FloatingLine = ({ path, color, reverse = false }: FloatingLineProps) => (
  <motion.path
    d={path}
    stroke={color}
    strokeWidth="3"
    fill="none"
    strokeDasharray="10,15"
    initial={{ strokeDashoffset: 0 }}
    animate={{ strokeDashoffset: reverse ? 100 : -100 }}
    transition={{
      repeat: Number.POSITIVE_INFINITY,
      duration: 3,
      ease: "linear",
    }}
  />
);

const Node = ({ x, y, color, title, value }: NodeProps) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="40" fill="white" stroke={color} strokeWidth="2" />
    {/* Value positioned at the center of the circle */}
    <text
      x="0"
      y="0"
      textAnchor="middle"
      alignmentBaseline="middle"
      className="text-[12px] font-medium"
    >
      {value} {/* Displaying the numeric value */}
    </text>
    <text
      x="0"
      y="30"
      textAnchor="middle"
      className="text-[10px] text-gray-500"
    >
      {title}
    </text>
  </g>
);

const FlowValue = ({ x, y, value, rotate = 0 }: FlowValueProps) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    className="text-[11px] font-medium fill-gray-600"
    transform={`rotate(${rotate} ${x} ${y})`}
  >
    {value} {/* Displaying the numeric value */}
  </text>
);

export default function EnergyFlow() {
  const [flowData, setFlowData] = useState({
    ph1toPH2: 0,
    ph2toPH3: 0,
    ph3toPH4: 0,
    totalGen: 0,
    ph1Total: 0,
    ph2Total: 0,
    ph3Total: 0,
    ph4Total: 0,
  });

  useEffect(() => {
    const fetchFlowData = async () => {
      try {
        const response = await fetch("/api/v1/overview");
        const data = await response.json();
        setFlowData({
          ph1toPH2: data.data.overview[0].KW_BRIDGE_TRANSFORMER_PH2,
          ph2toPH3: data.data.overview[0].KW_AM17_SPINNING_PH2,
          ph3toPH4: data.data.overview[0].TOWARDS_PH2_kw,
          totalGen: data.data.dashboard[0].totalpowergen,
          ph1Total: data.data.dashboard[0].powerhouse1gen,
          ph2Total: data.data.dashboard[0].powerhouse2gen,
          ph3Total: data.data.dashboard[0].powerhouse3gen,
          ph4Total: data.data.dashboard[0].AM17_PH2,
        });
      } catch (error) {
        console.error("Error fetching flow data:", error);
      }
    };

    // Fetch data every 1 second (1000ms)
    const intervalId = setInterval(fetchFlowData, 500);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const paths = {
    ph1toPH2: "M100,70 L300,70",
    ph2toPH3: "M300,100 L300,300",
    ph3toPH4: "M300,270 L100,270",
  };

  return (
    <svg
      className="w-full max-w-[500px] h-auto"
      viewBox="0 0 400 350"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Static Paths */}
      <path d={paths.ph1toPH2} stroke="#e5e7eb" strokeWidth="2" fill="none" />
      <path d={paths.ph2toPH3} stroke="#e5e7eb" strokeWidth="2" fill="none" />
      <path d={paths.ph3toPH4} stroke="#e5e7eb" strokeWidth="2" fill="none" />

      {/* Floating Lines */}
      {flowData.ph1toPH2 > 0 ? (
        <FloatingLine path={paths.ph1toPH2} color="#ec4899" reverse={true} />
      ) : (
        <FloatingLine path={paths.ph1toPH2} color="#fbbf24" reverse={false} />
      )}
      {flowData.ph2toPH3 > 0 ? (
        <FloatingLine path={paths.ph2toPH3} color="#ec4899" reverse={false} />
      ) : (
        <FloatingLine path={paths.ph2toPH3} color="#fb1f24" reverse={true} />
      )}
      {flowData.ph3toPH4 > 0 ? (
        <FloatingLine path={paths.ph3toPH4} color="#fb1f24" reverse={false} />
      ) : (
        <FloatingLine path={paths.ph3toPH4} color="#60a5fa" reverse={true} />
      )}

      {/* Flow Values */}
      <FlowValue
        x="200"
        y="60"
        value={`${Math.abs(flowData.ph1toPH2)} KW ${
          flowData.ph1toPH2 > 0 ? "←" : "→"
        }`}
      />
      <FlowValue
        x="320"
        y="170"
        value={`${Math.abs(flowData.ph2toPH3)} KW ${
          flowData.ph2toPH3 > 0 ? "←" : "→"
        }`}
        rotate={-90}
      />
      <FlowValue
        x="200"
        y="290"
        value={`${Math.abs(flowData.ph3toPH4)} KW ${
          flowData.ph3toPH4 > 0 ? "→" : "←"
        }`}
      />

      {/* Total KW in the middle */}
      <text
        x="200"
        y="150"
        textAnchor="middle"
        className="text-[18px] font-bold fill-gray-700"
      >
        Total
      </text>
      <text
        x="200"
        y="180"
        textAnchor="middle"
        className="text-[24px] font-bold fill-[#1b2d92]"
      >
        {flowData.totalGen} KW
      </text>

      {/* Nodes */}
      <Node
        x={100}
        y={70}
        color="#fbbf24"
        title="PH1"
        value={`${(flowData.ph1Total / 1000).toFixed(2)} MW`}
      />
      <Node
        x={300}
        y={70}
        color="#ec4899"
        title="PH2"
        value={`${(flowData.ph2Total / 1000).toFixed(2)} MW`}
      />
      <Node
        x={300}
        y={270}
        color="#fb1f24"
        title="PH3"
        value={`${(flowData.ph3Total / 1000).toFixed(2)} MW`}
      />
      <Node
        x={100}
        y={270}
        color="#60a5fa"
        title="PH4"
        value={`${(flowData.ph4Total / 1000).toFixed(2)} MW`}
      />
    </svg>
  );
}
