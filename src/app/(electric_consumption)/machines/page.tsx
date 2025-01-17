"use client";
import React, { useEffect, useState } from "react";

// Define an interface for the machine data
interface Machine {
  machine_id: string;
  machine_name: string;
  shed: string;
  category: string;
  power: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/machines", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch machines data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("Error: " + error);
  }
}

const MachinesPage = () => {
  const [machines, setMachines] = useState<Machine[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setMachines(result?.data); // Assuming the data is in 'data' field
    };
    fetchData();
  }, []);

  if (!machines) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Machines List
      </h1>
      {/* Responsive Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Machine ID</th>
              <th className="border border-gray-300 px-4 py-2">Machine Name</th>
              <th className="border border-gray-300 px-4 py-2">Shed</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Power</th>
              <th className="border border-gray-300 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine.machine_id}>
                <td className="border border-gray-300 px-4 py-2">{machine.machine_id}</td>
                <td className="border border-gray-300 px-4 py-2">{machine.machine_name}</td>
                <td className="border border-gray-300 px-4 py-2">{machine.shed}</td>
                <td className="border border-gray-300 px-4 py-2">{machine.category}</td>
                <td className="border border-gray-300 px-4 py-2">{machine.power}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={`/machines/${machine.machine_id}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {machines.map((machine) => (
          <div
            key={machine.machine_id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300"
          >
            <p className="text-sm font-bold text-gray-700">Machine ID: {machine.machine_id}</p>
            <p className="text-sm text-gray-600">Name: {machine.machine_name}</p>
            <p className="text-sm text-gray-600">Shed: {machine.shed}</p>
            <p className="text-sm text-gray-600">Category: {machine.category}</p>
            <p className="text-sm text-gray-600">Power: {machine.power}</p>
            <a
              href={`/machines/${machine.machine_id}`}
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachinesPage;
