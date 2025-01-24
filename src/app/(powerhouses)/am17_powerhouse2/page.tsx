// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DataItem {
  id: number;
  ENGINE1_KW: number;
  ENGINE1_KWH: number;
  ENGINE2_KW: number;
  ENGINE2_KWH: number;
  ENGINE3_KW: number;
  ENGINE3_KWH: number;
  AUXILIARY_kw: number;
  AUXILIARY_kwh: number;
  TOWARDS_PH1_kw: number;
  TOWARDS_PH1_kwh: number;
  AM17_B_kw: number;
  AM17_B_kwh: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/am17_ph2", {
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
  const [data, setData] = useState<DataItem[]>([]);
  const [percentageUsedDataE1, setPercentageUsedDataE1] = useState("");
  const [percentageUsedDataE2, setPercentageUsedDataE2] = useState("");
  const [percentageUsedDataE3, setPercentageUsedDataE3] = useState("");

  const [percentageUsedDataAUX, setPercentageUsedDataAUX] = useState("");
  const [percentageUsedDataTOPH1, setPercentageUsedDataTOPH1] = useState("");
  const [percentageUsedDataAM17B, setPercentageUsedDataAM17B] = useState("");

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
      const values = data.map((item) => item.ENGINE1_KW);
      const percentageUsed = initializeChart("engine1", values, 1500);
      setPercentageUsedDataE1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.ENGINE2_KW);
      const percentageUsed = initializeChart("engine2", values, 1500);
      setPercentageUsedDataE2(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.ENGINE3_KW);
      const percentageUsed = initializeChart("engine3", values, 1500);
      setPercentageUsedDataE3(percentageUsed);
    }
  }, [data]);

  // Take Off

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AM17_B_kw);
      const percentageUsed = initializeChart(
        "takeoff2",
        values,
        5500
      );
      setPercentageUsedDataAM17B(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AUXILIARY_kw);
      console.log(values);
      const percentageUsed = initializeChart(
        "takeoff3",
        values,
        1250
      );
      setPercentageUsedDataAUX(percentageUsed);
    }
  }, [data]);

  return (
    <div>
      <h1 className="pt-5 text-center text-xl font-bold">
        AM 17 Power house 2 Generation
      </h1>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">ENGINE 1</CardTitle>
              <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                R-LNG
              </span>
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
                  {percentageUsedDataE1}%
                </div>
                <canvas id="engine1" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.ENGINE1_KW} kW</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">ENGINE 2</CardTitle>
              <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                R-LNG
              </span>
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
                  {percentageUsedDataE2}%
                </div>
                <canvas id="engine2" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.ENGINE2_KW} kW</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">ENGINE 3</CardTitle>
              <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                R-LNG
              </span>
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
                  {percentageUsedDataE3}%
                </div>
                <canvas id="engine3" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.ENGINE3_KW} kW</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <h1 className="text-center text-xl font-bold">UTILIZATION</h1>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">AM-17 B</CardTitle>
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
                  {percentageUsedDataAM17B} %
                </div>
                <canvas id="takeoff2" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.AM17_B_kw} kW</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  5500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">AUXILIARY</CardTitle>
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
                  {percentageUsedDataAUX} %
                </div>
                <canvas id="takeoff3" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.AUXILIARY_kw} kW</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1250 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
