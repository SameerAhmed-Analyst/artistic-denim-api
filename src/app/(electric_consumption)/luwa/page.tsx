// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface LuwaData {
  id: number;
  luwa_1_kW: number;
  luwa_2_kW: number;
  luwa_3_kW: number;
  luwa_4_kW: number;
  luwa_5_kW: number;
  luwa_6_kW: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/luwa", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("error: " + error);
  }
}

const Page = () => {
  const [data, setData] = useState<LuwaData[]>([]); // Updated to LUWA Data
  const [percentageUsedDataL1, setPercentageUsedDataL1] = useState("");
  const [percentageUsedDataL2, setPercentageUsedDataL2] = useState("");

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 1 second
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const initializeChart = (
    canvasId: string,
    values: number[],
    totalCapacity: number
  ) => {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    let chartStatus = Chart.getChart(ctx);

    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }

    const totalValue = values.reduce((acc, curr) => acc + curr, 0);
    const remainingCapacity = totalCapacity - totalValue;
    const percentageUsed = ((totalValue / totalCapacity) * 100).toFixed(1);

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Data from API",
            data: [totalValue, remainingCapacity],
            backgroundColor: ["#1b2d92", "#E5E8E8"],
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "80%",
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            enabled: false,
          },
        },
        animation: false,
      },
    });

    chart.update();
    return percentageUsed;
  };

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.luwa_1_kW); // Updated to LUWA 1 kW
      const percentageUsed = initializeChart(
        "luwa1",
        values,
        250
      );
      setPercentageUsedDataL1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.luwa_2_kW); // Updated to LUWA 2 kW
      const percentageUsed = initializeChart(
        "luwa2",
        values,
        250
      );
      setPercentageUsedDataL2(percentageUsed);
    }
  }, [data]);

  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <h1 className="text-center text-xl font-bold">LUWA LOAD</h1>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">LUWA 1</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent className="flex justify-evenly">
            <div
              style={{
                width: "100px",
                height: "100px",
                float: "left",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  position: "absolute",
                  top: "55%",
                  left: "0",
                  marginTop: "-20px",
                  lineHeight: "19px",
                  textAlign: "center",
                }}
              >
                {data.map((item) => item.luwa_1_kW.toFixed(0))} kW
              </div>
              <canvas id="luwa1" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    <p>Load {item.luwa_1_kW} kW</p>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                250 total capacity in KW
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">LUWA 2</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent className="flex justify-evenly">
            <div
              style={{
                width: "100px",
                height: "100px",
                float: "left",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  position: "absolute",
                  top: "55%",
                  left: "0",
                  marginTop: "-20px",
                  lineHeight: "19px",
                  textAlign: "center",
                }}
              >
                {data.map((item) => item.luwa_2_kW.toFixed(0))} kW
              </div>
              <canvas id="luwa2" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    <p>Load {item.luwa_2_kW} kW</p>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                250 total capacity in KW
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Repeat this for LUWA 2 to LUWA 6 as required */}
      </div>
    </div>
  );
};

export default Page;
