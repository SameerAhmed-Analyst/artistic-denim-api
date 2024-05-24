// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DataItem {
  id: number;
  KE_KW: number;
  KE_KWH: number;
  AM5_KW: number;
  AM5_KWH: number;
  CAT_KW: number;
  CAT_KWH: number;
  MAN_KW: number;
  MAN_KWH: number;
  MAK1_KW: number;
  MAK1_KWH: number;
  MAK2_KW: number;
  MAK2_KWH: number;
  Takeoff1kw: number;
  Takeoff1kwh: number;
  Takeoff2kw: number;
  Takeoff2kwh: number;
  Takeoff3kw: number;
  Takeoff3kwh: number;
  Takeoff4kw: number;
  Takeoff4kwh: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/powerhouse3", {
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
  const [percentageUsedDataKE, setPercentageUsedDataKE] = useState("");
  const [percentageUsedDataAM5, setPercentageUsedDataAM5] = useState("");
  const [percentageUsedDataCAT, setPercentageUsedDataCAT] = useState("");
  const [percentageUsedDataMAN, setPercentageUsedDataMAN] = useState("");
  const [percentageUsedDataMAK1, setPercentageUsedDataMAK1] = useState("");
  const [percentageUsedDataMAK2, setPercentageUsedDataMAK2] = useState("");

  const [percentageUsedDataT1, setPercentageUsedDataT1] = useState("");
  const [percentageUsedDataT2, setPercentageUsedDataT2] = useState("");
  const [percentageUsedDataT3, setPercentageUsedDataT3] = useState("");
  const [percentageUsedDataT4, setPercentageUsedDataT4] = useState("");

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 3 seconds
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
      const values = data.map((item) => item.KE_KW);
      const percentageUsed = initializeChart("ke", values, 900);
      setPercentageUsedDataKE(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AM5_KW);
      const percentageUsed = initializeChart("am5", values, 10000);
      setPercentageUsedDataAM5(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.CAT_KW);
      const percentageUsed = initializeChart("cat", values, 900);
      setPercentageUsedDataCAT(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.MAN_KW);
      const percentageUsed = initializeChart("man", values, 900);
      setPercentageUsedDataMAN(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.MAK1_KW);
      const percentageUsed = initializeChart("mak1", values, 900);
      setPercentageUsedDataMAK1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.MAK2_KW);
      const percentageUsed = initializeChart("mak2", values, 900);
      setPercentageUsedDataMAK2(percentageUsed);
    }
  }, [data]);

  // Take Off

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff1kw);
      const percentageUsed = initializeChart("takeoff1", values, 1500);
      setPercentageUsedDataT1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff2kw);
      const percentageUsed = initializeChart("takeoff2", values, 1500);
      setPercentageUsedDataT2(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff3kw);
      const percentageUsed = initializeChart("takeoff3", values, 1250);
      setPercentageUsedDataT3(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff4kw);
      const percentageUsed = initializeChart("takeoff4", values, 1250);
      setPercentageUsedDataT4(percentageUsed);
    }
  }, [data]);

  return (
    <div>
      <h1 className="pt-5 text-center text-xl font-bold">
        Power house 3 Generation
      </h1>
      <p className="text-center">
        <span className="bg-yellow-400 p-1">Under Development</span>
      </p>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">KE</CardTitle>
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
                  {percentageUsedDataKE}%
                </div>
                <canvas id="ke" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.KE_KW} kW</p>
                      <p>Energy {item.KE_KWH} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  900 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">AM5</CardTitle>
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
                  {percentageUsedDataAM5}%
                </div>
                <canvas id="am5" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.AM5_KW} kW</p>
                      <p>Energy {item.AM5_KWH} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                10000 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">CAT</CardTitle>
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
                  {percentageUsedDataCAT}%
                </div>
                <canvas id="cat" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.CAT_KW} kW</p>
                      <p>Energy {item.CAT_KWH} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  900 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">MAN</CardTitle>
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
                  {percentageUsedDataMAN}%
                </div>
                <canvas id="man" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.MAN_KW} kW</p>
                      <p>Energy {item.MAN_KWH} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  900 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">MAK-1</CardTitle>
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
                  {percentageUsedDataMAK1}%
                </div>
                <canvas id="mak1" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.MAK1_KW} kW</p>
                      <p>Energy {item.MAK1_KWH} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  900 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">MAK-2</CardTitle>
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
                  {percentageUsedDataMAK2}%
                </div>
                <canvas id="mak2" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.MAK2_KW} kW</p>
                      <p>Energy {item.MAK2_KWH} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  900 total capacity in KW
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
              <CardTitle className="text-xl font-bold">
                AM-18/Load Takeoff-1
              </CardTitle>
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
                  {percentageUsedDataT1}%
                </div>
                <canvas id="takeoff1" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.Takeoff1kw} kW</p>
                      <p>Energy {item.Takeoff1kwh} kWh</p>
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
              <CardTitle className="text-xl font-bold">
                AM-17B/Load Takeoff-2
              </CardTitle>
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
                  {percentageUsedDataT2}%
                </div>
                <canvas id="takeoff2" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.Takeoff2kw} kW</p>
                      <p>Energy {item.Takeoff2kwh} kWh</p>
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
              <CardTitle className="text-xl font-bold">
                AUXILIARY/Load Takeoff-3
              </CardTitle>
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
                  {percentageUsedDataT3}%
                </div>
                <canvas id="takeoff3" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.Takeoff3kw} kW</p>
                      <p>Energy {item.Takeoff3kwh} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1250 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                AM-17A/Load Takeoff-3
              </CardTitle>
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
                  {percentageUsedDataT4}%
                </div>
                <canvas id="takeoff4" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.Takeoff4kw} kW</p>
                      <p>Energy {item.Takeoff4kwh} kWh</p>
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
