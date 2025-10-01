// 'use client';

// import { use } from 'react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';

// interface SolarData {
//   timestamp: string;
//   value: number;
// }

// export default function SolarPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params); // unwrap async route param

//   const [data, setData] = useState<SolarData[]>([]);
//   const [totalUsed, setTotalUsed] = useState<number | null>(null);
//   const [showCalculation, setShowCalculation] = useState(false);

//   const [startTime, setStartTime] = useState(dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm'));
//   const [endTime, setEndTime] = useState(dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm'));
//   const [activeRange, setActiveRange] = useState<string>('yesterday');

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setActiveRange('custom'); // switch to custom if manually edited
//     if (name === 'startTime') setStartTime(value);
//     else if (name === 'endTime') setEndTime(value);
//   };

//   const handleRangeChange = (range: string) => {
//     setActiveRange(range);
//     switch (range) {
//       case 'today':
//         setStartTime(dayjs().startOf('day').format('YYYY-MM-DDTHH:mm'));
//         setEndTime(dayjs().endOf('day').format('YYYY-MM-DDTHH:mm'));
//         break;
//       case 'yesterday':
//         setStartTime(dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm'));
//         setEndTime(dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm'));
//         break;
//       case 'last7':
//         setStartTime(dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DDTHH:mm'));
//         setEndTime(dayjs().endOf('day').format('YYYY-MM-DDTHH:mm'));
//         break;
//       case 'thisWeek':
//         setStartTime(dayjs().startOf('week').format('YYYY-MM-DDTHH:mm'));
//         setEndTime(dayjs().endOf('week').format('YYYY-MM-DDTHH:mm'));
//         break;
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axios.post('/query', {
//         valueIds: [id],
//         valueNames: [""],
//         timeBegin: startTime,
//         timeEnd: endTime,
//         sqlClause: "",
//         timeStep: "60,1"
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [startTime, endTime]);

//   useEffect(() => {
//     if (showCalculation && data.length > 0) {
//       const initialValue = data[0]?.value;
//       const lastValue = data[data.length - 1]?.value;
//       if (initialValue !== undefined && lastValue !== undefined) {
//         setTotalUsed(lastValue - initialValue);
//       }
//     }
//   }, [showCalculation, data]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-gray-800">Solar Data Calculation</h1>

//         {/* Quick Range Buttons */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {[
//             { label: 'Today', value: 'today' },
//             { label: 'Yesterday', value: 'yesterday' },
//             { label: 'Last 7 Days', value: 'last7' },
//             { label: 'This Week', value: 'thisWeek' },
//             { label: 'Custom', value: 'custom' },
//           ].map((range) => (
//             <button
//               key={range.value}
//               onClick={() => handleRangeChange(range.value)}
//               className={`px-4 py-2 rounded-md text-sm font-medium border ${
//                 activeRange === range.value
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-white text-gray-700 hover:bg-blue-100'
//               }`}
//             >
//               {range.label}
//             </button>
//           ))}
//         </div>

//         {/* Manual Date Pickers */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
//               Start Time
//             </label>
//             <input
//               type="datetime-local"
//               name="startTime"
//               id="startTime"
//               value={startTime}
//               onChange={handleDateChange}
//               className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
//               End Time
//             </label>
//             <input
//               type="datetime-local"
//               name="endTime"
//               id="endTime"
//               value={endTime}
//               onChange={handleDateChange}
//               className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Toggle Calculation */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             checked={showCalculation}
//             onChange={() => setShowCalculation(!showCalculation)}
//             id="calculate"
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="calculate" className="text-gray-700">
//             Calculate Total Used
//           </label>
//         </div>

//         {/* Result */}
//         {showCalculation && totalUsed !== null ? (
//           <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-2">
//             <p className="text-gray-700">
//               <strong>Initial Value:</strong> {data[0]?.value}
//             </p>
//             <p className="text-gray-700">
//               <strong>Last Value:</strong> {data[data.length - 1]?.value}
//             </p>
//             <p className="text-lg font-semibold text-blue-700">
//               Total Used: {totalUsed}
//             </p>
//           </div>
//         ) : (
//           <p className="text-sm text-gray-500">
//             Check the box above to calculate total energy usage.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// app/solar/[id]/page.tsx
import SolarPage from './SolarPage';

export default function Page({ params }: { params: { id: string } }) {
  // Pass the numeric id down; your API expects numbers not strings
  return <SolarPage id={params.id} />;
}

