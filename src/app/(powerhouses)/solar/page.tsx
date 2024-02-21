// // pages/index.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { Card } from "@tremor/react";
// import { Chart } from "chart.js/auto";
// import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// async function getData() {
//   try {
//     const res = await fetch("/api/v1/solar", {
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
//     console.log("error: " + error);
//   }
// }

// const Page = () => {
//   const [data, setData] = useState<Daum[]>([]);
//   const [percentageUsedDataE1, setPercentageUsedDataE1] = useState("");
//   const [percentageUsedDataE2, setPercentageUsedDataE2] = useState("");

//   const refreshList = async () => {
//     const result = await getData();
//     setData(result.data);
//   };

//   useEffect(() => {
//     refreshList();

//     const intervalId = setInterval(() => {
//       refreshList(); // Fetch data every 3 seconds
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const initializeChart = (
//     canvasId: string,
//     values: number[],
//     totalCapacity: number
//   ) => {
//     const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
//     let chartStatus = Chart.getChart(ctx);

//     if (chartStatus !== undefined) {
//       chartStatus.destroy();
//     }

//     const totalValue = values.reduce((acc, curr) => acc + curr, 0);
//     const remainingCapacity = totalCapacity - totalValue;
//     const percentageUsed = ((totalValue / totalCapacity) * 100).toFixed(1);

//     const chart = new Chart(ctx, {
//       type: "doughnut",
//       data: {
//         datasets: [
//           {
//             label: "Data from API",
//             data: [totalValue, remainingCapacity],
//             backgroundColor: ["#1b2d92", "#E5E8E8"],
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         cutout: "80%",
//         plugins: {
//           legend: {
//             position: "bottom",
//           },
//           tooltip: {
//             enabled: false,
//           },
//         },
//         animation: false,
//       },
//     });

//     chart.update();
//     return percentageUsed;
//   };

//   useEffect(() => {
//     if (data.length > 0) {
//       const values = data.map((item) => item.turbinekw);
//       const percentageUsed = initializeChart("turbine", values, 5500);
//       setPercentageUsedDataTR1(percentageUsed);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (data.length > 0) {
//       const values = data.map((item) => item.engine1kw);
//       const percentageUsed = initializeChart("engine1", values, 1400.0);
//       setPercentageUsedDataE1(percentageUsed);
//     }
//   }, [data]);

//   return (
//     <div className="">
//       <h1 className="pt-5 text-center text-xl font-bold">
//         Power house 2 Generation
//       </h1>
//       <div className="p-5">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card className="p-0">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
//               <CardTitle className="text-xl font-bold">Turbine</CardTitle>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 className="h-4 w-4 text-muted-foreground"
//               >
//                 <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//               </svg>
//             </CardHeader>
//             <CardContent className="flex justify-evenly">
//               <div
//                 style={{
//                   width: "100px",
//                   height: "100px",
//                   float: "left",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "40px",
//                     position: "absolute",
//                     top: "55%",
//                     left: "0",
//                     marginTop: "-20px",
//                     lineHeight: "19px",
//                     textAlign: "center",
//                   }}
//                 >
//                   {percentageUsedDataTR1}%
//                 </div>
//                 <canvas id="turbine" width="100" height="100" />
//               </div>
//               <div className="">
//                 {data.map((item) => {
//                   return (
//                     <div key={item.id} className="pt-3 text-base font-bold">
//                       <p>Load {item.turbinekw} kW</p>
//                       <p>Energy {item.turbinekwh} kWh</p>
//                     </div>
//                   );
//                 })}
//                 <p className="text-xs text-muted-foreground">
//                   5500 total capacity in KW
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       <h1 className="pt-1 text-center text-xl font-bold">UTILIZATION</h1>
//       <div className="p-5">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card className="p-0">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
//               <CardTitle className="text-xl font-bold">
//                 Weaving Shade 4
//               </CardTitle>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 className="h-4 w-4 text-muted-foreground"
//               >
//                 <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//               </svg>
//             </CardHeader>
//             <CardContent className="flex justify-evenly">
//               <div
//                 style={{
//                   width: "100px",
//                   height: "100px",
//                   float: "left",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "40px",
//                     position: "absolute",
//                     top: "55%",
//                     left: "0",
//                     marginTop: "-20px",
//                     lineHeight: "19px",
//                     textAlign: "center",
//                   }}
//                 >
//                   {percentageUsedDataT1}%
//                 </div>
//                 <canvas id="takeoff4" width="100" height="100" />
//               </div>
//               <div className="">
//                 {data.map((item) => {
//                   return (
//                     <div key={item.id} className="pt-3 text-base font-bold">
//                       <p>Load {item.Takeoff4kw} kW</p>
//                       <p>Energy {item.Takeoff4kwh} kWh</p>
//                     </div>
//                   );
//                 })}
//                 <p className="text-xs text-muted-foreground">
//                   1500 total capacity in KW
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page