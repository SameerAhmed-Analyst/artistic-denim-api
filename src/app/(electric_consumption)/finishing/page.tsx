// import React from "react";

// interface Machine {
//   MachineID: string;
//   Utilities: string[];
//   Status: string;
// }

// const Shed1Page = ({ machines }: { machines: Machine[] }) => {
//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">SHED 1</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {machines.map((machine) => (
//           <div key={machine.MachineID} className="bg-white shadow-lg rounded-lg p-6 mb-4">
//             <h2 className="text-xl font-bold text-gray-800">{machine.MachineID}</h2>
//             <div className="mt-4">
//               <p className="text-gray-600">
//                 <span className="font-semibold">Utilities:</span>{" "}
//                 {machine.Utilities.join(", ")}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-semibold">Status:</span>{" "}
//                 <span
//                   className={`inline-block px-2 py-1 rounded text-sm font-medium ${
//                     machine.Status === "ON" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {machine.Status}
//                 </span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shed1Page;

import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Finishing</h1>
      <div className="flex gap-4">
        {/* Link to Shed 1 page */}
        <Link href="/finishing/shed/1">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
            Shed 1
          </button>
        </Link>

        {/* Link to Shed 2 page */}
        <Link href="/finishing/shed/2">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
            Shed 2
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
