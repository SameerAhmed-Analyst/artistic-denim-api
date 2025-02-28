// "use client";

// import { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import Select from "react-select";
// import { Line, Bar, Pie } from "react-chartjs-2";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Chart,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js components
// Chart.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Data type options
// const dataOptions = [
//   { value: "TURBINE_KW", label: "TURBINE" },
//   { value: "MAK1_KW", label: "MAK 1" },
//   { value: "MAK2_KW", label: "MAK 2" },
//   { value: "MAN_KW", label: "MAN" },
//   { value: "CAPTIVE_PRESSURE", label: "CAPTIVE" },
//   { value: "RLNG_PRESSURE", label: "RLNG" },
//   { value: "INDUSTRIAL_PRESSURE", label: "Industrial" },
//   { value: "FGC_PRESSURE", label: "FGC" },
// ];

// export default function Home() {
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [selectedDataTypes, setSelectedDataTypes] = useState<
//     { value: string; label: string }[]
//   >([]);
//   const [tableData, setTableData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     if (!startDate || !endDate || selectedDataTypes.length === 0) {
//       alert("Please select a date range and at least one data type.");
//       return;
//     }

//     setLoading(true);

//     const query = new URLSearchParams({
//       startDate: startDate?.toISOString() || "",
//       endDate: endDate?.toISOString() || "",
//       dataTypes: selectedDataTypes.map((d) => d.value).join(","),
//     }).toString();

//     const response = await fetch(`/api/v1/custom_reports?${query}`);
//     const result = await response.json();
//     setTableData(result.data);
//     setLoading(false);
//   };

//   // Generate Chart.js Data
//   const chartLabels = tableData.map((item) => item.time);
//   const selectedKeys = selectedDataTypes.map((d) => d.value);

//   const generateChartData = () => ({
//     labels: chartLabels,
//     datasets: selectedKeys.map((key, index) => ({
//       label: key.replace("_KW", "").replace("_PRESSURE", ""),
//       data: tableData.map((item) => item[key] || 0),
//       backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][
//         index % 5
//       ],
//       borderColor: "#333",
//       borderWidth: 1,
//     })),
//   });

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Report Fetching System</h1>

//       {/* Date Range Picker */}
//       <div className="mb-4 flex space-x-4">
//         <DatePicker
//           selected={startDate}
//           onChange={(date) => setStartDate(date)}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           className="p-2 border rounded"
//           placeholderText="Start Date"
//         />
//         <DatePicker
//           selected={endDate}
//           onChange={(date) => setEndDate(date)}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           className="p-2 border rounded"
//           placeholderText="End Date"
//         />
//       </div>

//       {/* Data Type Selection */}
//       <Select
//         isMulti
//         options={dataOptions}
//         value={selectedDataTypes}
//         onChange={(selected) => setSelectedDataTypes(selected as any)}
//         className="mb-4"
//       />

//       {/* Fetch Data Button */}
//       <button
//         onClick={fetchData}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         disabled={loading}
//       >
//         {loading ? "Fetching..." : "Fetch Data"}
//       </button>

//       {/* Charts */}
//       {tableData.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           <div className="p-4 bg-white rounded shadow">
//             <h2 className="text-lg font-semibold mb-2">Line Chart</h2>
//             <Line data={generateChartData()} />
//           </div>
//           <div className="p-4 bg-white rounded shadow">
//             <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
//             <Bar data={generateChartData()} />
//           </div>
//           <div className="p-4 bg-white rounded shadow">
//             <h2 className="text-lg font-semibold mb-2">Pie Chart</h2>
//             <Pie data={generateChartData()} />
//           </div>
//         </div>
//       )}

//       {/* Data Table */}
//       {tableData.length > 0 && (
//         <table className="w-full mt-6 border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Time</th>
//               {selectedKeys.map((key) => (
//                 <th key={key} className="border p-2">
//                   {key.replace("_KW", "").replace("_PRESSURE", "")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, index) => (
//               <tr key={index} className="border-b">
//                 <td className="border p-2">{row.time}</td>
//                 {selectedKeys.map((key) => (
//                   <td key={key} className="border p-2">
//                     {row[key]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Line, Bar, Pie } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Data type options
const dataOptions = [
  { value: "TURBINE_KW", label: "TURBINE" },
  { value: "MAK1_KW", label: "MAK 1" },
  { value: "MAK2_KW", label: "MAK 2" },
  { value: "MAN_KW", label: "MAN" },
  { value: "CAPTIVE_PRESSURE", label: "CAPTIVE" },
  { value: "RLNG_PRESSURE", label: "RLNG" },
  { value: "INDUSTRIAL_PRESSURE", label: "Industrial" },
  { value: "FGC_PRESSURE", label: "FGC" },
];

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDataTypes, setSelectedDataTypes] = useState<
    { value: string; label: string }[]
  >([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!startDate || !endDate || selectedDataTypes.length === 0) {
      alert("Please select a date range and at least one data type.");
      return;
    }

    setLoading(true);

    const query = new URLSearchParams({
      startDate: startDate?.toISOString() || "",
      endDate: endDate?.toISOString() || "",
      dataTypes: selectedDataTypes.map((d) => d.value).join(","),
    }).toString();

    const response = await fetch(`/api/v1/custom_reports?${query}`);
    const result = await response.json();
    setTableData(result.data);
    setLoading(false);
  };

  // Generate Chart.js Data
  const chartLabels = tableData.map((item) => item.time);
  const selectedKeys = selectedDataTypes.map((d) => d.value);

  const generateChartData = () => ({
    labels: chartLabels,
    datasets: selectedKeys.map((key, index) => ({
      label: key.replace("_KW", "").replace("_PRESSURE", ""),
      data: tableData.map((item) => item[key] || 0),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][
        index % 5
      ],
      borderColor: "#333",
      borderWidth: 1,
    })),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Report Generate
      </h1>

      {/* Date Pickers (Responsive Layout) */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="p-2 border rounded w-full mb-4"
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          className="p-2 border rounded w-full"
          placeholderText="End Date"
        />
      </div>

      {/* Data Type Selection */}
      <Select
        isMulti
        options={dataOptions}
        value={selectedDataTypes}
        onChange={(selected) => setSelectedDataTypes(selected as any)}
        className="mb-4"
      />

      {/* Fetch Data Button */}
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 w-full md:w-auto rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Generate Report"}
      </button>

      {/* Charts (Fully Responsive) */}
      {tableData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-white rounded shadow h-64 sm:h-72">
            <h2 className="text-md font-semibold mb-2 text-center">Line Chart</h2>
            <Line data={generateChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="p-4 bg-white rounded shadow h-64 sm:h-72">
            <h2 className="text-md font-semibold mb-2 text-center">Bar Chart</h2>
            <Bar data={generateChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="p-4 bg-white rounded shadow h-64 sm:h-72">
            <h2 className="text-md font-semibold mb-2 text-center">Pie Chart</h2>
            <Pie data={generateChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      {/* Responsive Table */}
      {tableData.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-xs md:text-sm">
                <th className="border p-2">Time</th>
                {selectedKeys.map((key) => (
                  <th key={key} className="border p-2">
                    {key.replace("_KW", "").replace("_PRESSURE", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="border p-2">{row.time}</td>
                  {selectedKeys.map((key) => (
                    <td key={key} className="border p-2">{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
