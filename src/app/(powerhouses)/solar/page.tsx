// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SolarData {
  id: number;
  solar3_kW: number;
  solar3_kWh: number;
  solar4_kW: number;
  solar4_kWh: number;
  solar5_kW: number;
  solar5_kWh: number;
  solar_total_kW: number;
  solar_total_kWh: number;
  AM17_solar1_kW: number;
  AM17_solar1_kWh: number;
  AM17_solar2_kW: number;
  AM17_solar2_kWh: number;
  AM17_total_kW: number;
  AM17_total_kWh: number;
  AM8_solar_kW: number;
  AM8_solar_kWh: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/solar", {
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
  const [data, setData] = useState<SolarData[]>([]);
  const [percentageUsedDataS3, setPercentageUsedDataS3] = useState("");
  const [percentageUsedDataS4, setPercentageUsedDataS4] = useState("");
  const [percentageUsedDataS5, setPercentageUsedDataS5] = useState("");
  const [percentageUsedDataS1AM17, setPercentageUsedDataS1AM17] = useState("");
  const [percentageUsedDataS2AM17, setPercentageUsedDataS2AM17] = useState("");
  const [percentageUsedDataSAM8, setPercentageUsedDataSAM8] = useState("");

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
      const values = data.map((item) => item.solar3_kW);
      const percentageUsed = initializeChart("solar3", values, 500.0);
      setPercentageUsedDataS3(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.solar4_kW);
      const percentageUsed = initializeChart("solar4", values, 625.0);
      setPercentageUsedDataS4(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.solar5_kW);
      const percentageUsed = initializeChart("solar5", values, 500.0);
      setPercentageUsedDataS5(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AM17_solar1_kW);
      const percentageUsed = initializeChart("am17-solar1", values, 908.0);
      setPercentageUsedDataS1AM17(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AM17_solar2_kW);
      const percentageUsed = initializeChart("am17-solar2", values, 750.0);
      setPercentageUsedDataS2AM17(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AM8_solar_kW);
      const percentageUsed = initializeChart("am8-solar", values, 925.0);
      setPercentageUsedDataSAM8(percentageUsed);
    }
  }, [data]);

  return (
    <div className="">
      <h1 className="pt-5 text-center text-xl font-bold">SOLAR Generation</h1>
      <p className="text-center pt-2">
        <span className="bg-blue-700 text-white px-5 py-[6px] rounded-full rounded-tr-none rounded-bl-none font-semibold">
          AM5 SOLAR
        </span>
      </p>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Solar LT-3</CardTitle>
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
                  {percentageUsedDataS3}%
                </div>
                <canvas id="solar3" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.solar3_kW} kW</p>
                      <p>Energy {item.solar3_kWh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Solar LT-4</CardTitle>
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
                  {percentageUsedDataS4}%
                </div>
                <canvas id="solar4" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.solar4_kW} kW</p>
                      <p>Energy {item.solar4_kWh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  625 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Solar LT-5</CardTitle>
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
                  {percentageUsedDataS5}%
                </div>
                <canvas id="solar5" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.solar5_kW} kW</p>
                      <p>Energy {item.solar5_kWh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="text-center pt-2">
        <span className="bg-blue-500 text-white px-5 py-[6px] rounded-full rounded-tr-none rounded-bl-none font-semibold">
          AM17 SOLAR
        </span>
      </p>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Solar-1 AM17</CardTitle>
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
                  {percentageUsedDataS1AM17}%
                </div>
                <canvas id="am17-solar1" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.AM17_solar1_kW} kW</p>
                      <p>Energy {item.AM17_solar1_kWh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  908 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Solar-2 AM17</CardTitle>
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
                  {percentageUsedDataS2AM17}%
                </div>
                <canvas id="am17-solar2" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.AM17_solar2_kW} kW</p>
                      <p>Energy {item.AM17_solar2_kWh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  750 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="text-center pt-2">
        <span className="bg-blue-300 px-5 py-[6px] rounded-full rounded-tr-none rounded-bl-none font-semibold">
          AM8 SOLAR
        </span>
      </p>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">AM-8 Solar</CardTitle>
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
                  {percentageUsedDataSAM8}%
                </div>
                <canvas id="am8-solar" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.AM8_solar_kW} kW</p>
                      <p>Energy {item.AM8_solar_kWh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  925 total capacity in KW
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
