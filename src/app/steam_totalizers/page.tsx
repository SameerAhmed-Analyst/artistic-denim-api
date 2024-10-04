"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Page = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const fetchData = async () => {
    if (!startDate || !endDate || !startTime || !endTime) {
      setError("Please select a complete date and time range.");
      return;
    }

    setError("");
    setLoading(true); // Set loading state

    try {
      const response = await fetch(
        `/api/v1/totalizers?start_date=${startDate}&end_date=${endDate}&start_time=${startTime}&end_time=${endTime}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result.data || []); // Ensure that an empty array is used if no data is found
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false); // Stop loading when request completes
    }
  };

  return (
    <div className="m-auto p-6">
      <h1 className="font-bold text-center text-3xl">Totalizers</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="flex justify-between ">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button className="flex w-auto justify-center rounded-md bg-[#1b2d92] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={fetchData}>Fetch Data</button>
      </div>
      
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">HTP Pad Totalizer</TableHead>
              <TableHead className="text-center">Monfort Totalizer</TableHead>
              <TableHead className="text-center">Goller Totalizer</TableHead>
              <TableHead className="text-center">Jeanologia Totalizer</TableHead>
              <TableHead className="text-center">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{item.id}</TableCell>
                  <TableCell className="text-center">{item.htp_pad_totalizer}</TableCell>
                  <TableCell className="text-center">{item.monfort_totalizer}</TableCell>
                  <TableCell className="text-center">{item.goller_totalizer}</TableCell>
                  <TableCell className="text-center">{item.jeanologia_totalizer}</TableCell>
                  <TableCell className="text-center">
                    {new Date(item.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <TableCell colSpan={6} className="text-xl font-bold text-center text-red-400">No data available for the selected range.</TableCell>
              </tr>
            )}
          </TableBody>
        </Table>
        // <table className='table-auto'>
        //   <thead>
        //     <tr>
        //       <th scope="col">ID</th>
        //       <th scope="col">HTP Pad Totalizer</th>
        //       <th scope="col">Monfort Totalizer</th>
        //       <th scope="col">Goller Totalizer</th>
        //       <th scope="col">Jeanologia Totalizer</th>
        //       <th scope="col">Timestamp</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {data.length > 0 ? (
        //       data.map((item) => (
        //         <tr key={item.id}>
        //           <td>{item.id}</td>
        //           <td>{item.htp_pad_totalizer}</td>
        //           <td>{item.monfort_totalizer}</td>
        //           <td>{item.goller_totalizer}</td>
        //           <td>{item.jeanologia_totalizer}</td>
        //           <td>{new Date(item.timestamp).toLocaleString()}</td> {/* Format timestamp */}
        //         </tr>
        //       ))
        //     ) : (
        //       <tr>
        //         <td colSpan="6">No data available for the selected range.</td>
        //       </tr>
        //     )}
        //   </tbody>
        // </table>
      )}
    </div>
  );
};

export default Page;
