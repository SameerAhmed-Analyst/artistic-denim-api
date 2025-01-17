"use client"
import { useEffect, useState } from 'react';

interface MachineData {
  machine_id: string;
  machine_name: string;
  shed: string;
  category: string;
  current_amperes: number;
  frequency: number;
  kwh: number;
  power_factor: number;
  power: number;
  voltage: number;
  status: string;
}

const MachineDetails = ({ params }: { params: { id: string } }) => {
  const [machineData, setMachineData] = useState<MachineData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await fetch(`/api/v1/machines/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setMachineData(data.data);
        } else {
          setError(data.error || 'Error fetching data');
        }
      } catch (err) {
        setError('Failed to fetch machine data');
      }
    };

    fetchMachineData();
  }, [params.id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 text-red-600">
        <div className="text-xl font-semibold">{error}</div>
      </div>
    );
  }

  if (!machineData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Machine Details: {machineData.machine_name}</h1>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium text-gray-600"><strong>Shed:</strong> {machineData.shed}</p>
          <p className="font-medium text-gray-600"><strong>Category:</strong> {machineData.category}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium text-gray-600"><strong>Current (Amperes):</strong> {machineData.current_amperes}</p>
          <p className="font-medium text-gray-600"><strong>Frequency (Hz):</strong> {machineData.frequency}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium text-gray-600"><strong>Energy Consumption (kWh):</strong> {machineData.kwh}</p>
          <p className="font-medium text-gray-600"><strong>Power Factor:</strong> {machineData.power_factor}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium text-gray-600"><strong>Power (kW):</strong> {machineData.power}</p>
          <p className="font-medium text-gray-600"><strong>Voltage (V):</strong> {machineData.voltage}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium text-gray-600"><strong>Status:</strong> {machineData.status}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default MachineDetails;
