// app/finishing/shed1/page.tsx
"use client";
import React from 'react';
import { dummyMachines } from '../dummyData';

export default function Shed1Page() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6">SHED 1 <sup className="text-red-600 text-xs">* Testing</sup></h1>
      {dummyMachines.map((machine) => (
        <div
          key={machine.MachineID}
          className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-transform transform hover:scale-105"
        >
          {/* Machine Name and Status Indicator */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{machine.MachineName}</h2>
            <div
              className={`w-4 h-4 rounded-full ${
                machine.Status === "ON" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>

          {/* Consumption Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-sm sm:text-base">UTILITY</th>
                  <th className="px-3 py-2 text-left text-sm sm:text-base">INSTANT</th>
                  <th className="px-3 py-2 text-left text-sm sm:text-base">TILL NOW</th>
                </tr>
              </thead>
              <tbody>
                {machine.Consumption.map((cons, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2 text-sm sm:text-base">{cons.UtilityType}</td>
                    <td className="px-3 py-2 text-sm sm:text-base">
                      {cons.Instantaneous} {cons.Unit}
                    </td>
                    <td className="px-3 py-2 text-sm sm:text-base">
                      {cons.TillNow} {cons.Unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}