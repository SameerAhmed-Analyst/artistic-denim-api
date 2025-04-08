// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface SteamData {
  id: number;
  whrb4steamflow: number;
  whrb4waterflow: number;
  whrb4steampressure: number;
  whrb5steamflow: number;
  whrb5waterflow: number;
  whrb5steampressure: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/steampowerhouse3", {
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
  const [data, setData] = useState<SteamData[]>([]);
  const [percentageUsedDataW4, setPercentageUsedDataW4] = useState("");
  const [percentageUsedDataW5, setPercentageUsedDataW5] = useState("");

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 1 seconds
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
      const values = data.map(item => item.whrb4steamflow);
      const percentageUsed = initializeChart("whrb4", values, 1.0);
      setPercentageUsedDataW4(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map(item => item.whrb5steamflow);
      const percentageUsed = initializeChart("whrb5", values, 1.0);
      setPercentageUsedDataW5(percentageUsed);
    }
  }, [data]);

  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <h1 className="text-center text-xl font-bold">Power house 4 Generation</h1>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 4</CardTitle>
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
                {percentageUsedDataW4}%
              </div>
              <canvas id="whrb4" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.whrb4steamflow} T/H</p>
                    <p>Steam Pressure {item.whrb4steampressure} PSI</p>                
                    <p>Water Flow {item.whrb4waterflow} M3/H</p>            
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 5</CardTitle>
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
                {percentageUsedDataW5}%
              </div>
              <canvas id="whrb5" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.whrb5steamflow} T/H</p>
                    <p>Steam Pressure {item.whrb5steampressure} PSI</p>                
                    <p>Water Flow {item.whrb5waterflow} M3/H</p>       
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;