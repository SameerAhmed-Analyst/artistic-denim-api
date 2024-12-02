// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface Daum {
  id: number;
  engine1kw: number;
  engine1kwh: number;
  engine2kw: number;
  engine2kwh: number;
  engine3kw: number;
  engine3kwh: number;
  engine4kw: number;
  engine4kwh: number;
  engine5kw: number;
  engine5kwh: number;
  engine6kw: number;
  engine6kwh: number;
  turbinekw: number;
  turbinekwh: number;
  Takeoff4kw: number;
  Takeoff4kwh: number;
  Takeoff5kw: number;
  Takeoff5kwh: number;
  Takeoff6kw: number;
  Takeoff6kwh: number;
  Takeoff7kw: number;
  Takeoff7kwh: number;
  Takeoff8kw: number;
  Takeoff8kwh: number;
  AUX_LV_Takeoff: number;
  AUX_LV_KWH: number;
  engine1: number;
  engine2: number;
  engine3: number;
  engine4: number;
  engine5: number;
  engine6: number;
  turbine: number;
  engine1bit: number;
  engine2bit: number;
  engine3bit: number;
  engine4bit: number;
  engine5bit: number;
  engine6bit: number;
  turbinebit: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/powerhousetwo", {
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
  const [data, setData] = useState<Daum[]>([]);
  const [percentageUsedDataE1, setPercentageUsedDataE1] = useState("");
  const [percentageUsedDataE2, setPercentageUsedDataE2] = useState("");
  const [percentageUsedDataE3, setPercentageUsedDataE3] = useState("");
  const [percentageUsedDataE4, setPercentageUsedDataE4] = useState("");
  const [percentageUsedDataE5, setPercentageUsedDataE5] = useState("");
  const [percentageUsedDataE6, setPercentageUsedDataE6] = useState("");
  const [percentageUsedDataTR1, setPercentageUsedDataTR1] = useState("");
  const [percentageUsedDataT1, setPercentageUsedDataT1] = useState("");
  const [percentageUsedDataT2, setPercentageUsedDataT2] = useState("");
  const [percentageUsedDataT3, setPercentageUsedDataT3] = useState("");
  const [percentageUsedDataT4, setPercentageUsedDataT4] = useState("");
  const [percentageUsedDataT5, setPercentageUsedDataT5] = useState("");
  const [percentageUsedDataT6, setPercentageUsedDataT6] = useState("");
  const [fuelSelectorE1, setFuelSelectorE1] = useState<number[]>([]);
  const [fuelSelectorE2, setFuelSelectorE2] = useState<number[]>([]);
  const [fuelSelectorE3, setFuelSelectorE3] = useState<number[]>([]);
  const [fuelSelectorE4, setFuelSelectorE4] = useState<number[]>([]);
  const [fuelSelectorE5, setFuelSelectorE5] = useState<number[]>([]);
  const [fuelSelectorE6, setFuelSelectorE6] = useState<number[]>([]);
  const [fuelSelectorTR, setFuelSelectorTR] = useState<number[]>([]);

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
      const values = data.map((item) => item.turbinekw);
      const percentageUsed = initializeChart("turbine", values, 5700);
      setPercentageUsedDataTR1(percentageUsed);
      const fuel_selector = data.map(item => item.turbinebit);
      setFuelSelectorTR(fuel_selector);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine1kw);
      const percentageUsed = initializeChart("engine1", values, 1400.0);
      setPercentageUsedDataE1(percentageUsed);
      const fuel_selector = data.map(item => item.engine1bit);
      setFuelSelectorE1(fuel_selector);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine2kw);
      const percentageUsed = initializeChart("engine2", values, 1500.0);
      setPercentageUsedDataE2(percentageUsed);
      const fuel_selector = data.map(item => item.engine2bit);
      setFuelSelectorE2(fuel_selector);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine3kw);
      const percentageUsed = initializeChart("engine3", values, 1500.0);
      setPercentageUsedDataE3(percentageUsed);
      const fuel_selector = data.map(item => item.engine3bit);
      setFuelSelectorE3(fuel_selector);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine4kw);
      const percentageUsed = initializeChart("engine4", values, 1500.0);
      setPercentageUsedDataE4(percentageUsed);
      const fuel_selector = data.map(item => item.engine4bit);
      setFuelSelectorE4(fuel_selector);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine5kw);
      const percentageUsed = initializeChart("engine5", values, 1500.0);
      setPercentageUsedDataE5(percentageUsed);
      const fuel_selector = data.map(item => item.engine5bit);
      setFuelSelectorE5(fuel_selector);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine6kw);
      const percentageUsed = initializeChart("engine6", values, 1500.0);
      setPercentageUsedDataE6(percentageUsed);
      const fuel_selector = data.map(item => item.engine6bit);
      setFuelSelectorE6(fuel_selector);
    }
  }, [data]);

  // Take Off

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff4kw);
      const percentageUsed = initializeChart("takeoff4", values, 2500);
      setPercentageUsedDataT1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff5kw);
      const percentageUsed = initializeChart("takeoff5", values, 2500);
      setPercentageUsedDataT2(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff6kw);
      const percentageUsed = initializeChart("takeoff6", values, 2500);
      setPercentageUsedDataT3(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff7kw);
      const percentageUsed = initializeChart("takeoff7", values, 6000);
      setPercentageUsedDataT4(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.Takeoff8kw);
      const percentageUsed = initializeChart("takeoff8", values, 6000);
      setPercentageUsedDataT5(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.AUX_LV_Takeoff);
      const percentageUsed = initializeChart("aux", values, 1565);
      setPercentageUsedDataT6(percentageUsed);
    }
  }, [data]);

  return (
    <div className="">
      <h1 className="pt-5 text-center text-xl font-bold">
        Power house 2 Generation
      </h1>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Turbine</CardTitle>
              {fuelSelectorTR.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                  {percentageUsedDataTR1}%
                </div>
                <canvas id="turbine" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.turbinekw)} kW</p>
                      <p>Energy {Math.trunc(item.turbinekwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  5700 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Engine 1</CardTitle>
              {fuelSelectorE1.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                      <p>Load {Math.trunc(item.engine1kw)} kW</p>
                      <p>Energy {Math.trunc(item.engine1kwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1400 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">Engine 2</CardTitle>
              {fuelSelectorE2.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                      <p>Load {Math.trunc(item.engine2kw)} kW</p>
                      <p>Energy {Math.trunc(item.engine2kwh)} kWh</p>
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
              <CardTitle className="text-xl font-bold">Engine 3</CardTitle>
              {fuelSelectorE3.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                      <p>Load {Math.trunc(item.engine3kw)} kW</p>
                      <p>Energy {Math.trunc(item.engine3kwh)} kWh</p>
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
              <CardTitle className="text-xl font-bold">Engine 4</CardTitle>
              {fuelSelectorE4.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                  {percentageUsedDataE4}%
                </div>
                <canvas id="engine4" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.engine4kw)} kW</p>
                      <p>Energy {Math.trunc(item.engine4kwh)} kWh</p>
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
              <CardTitle className="text-xl font-bold">Engine 5</CardTitle>
              {fuelSelectorE5.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                  {percentageUsedDataE5}%
                </div>
                <canvas id="engine5" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.engine5kw)} kW</p>
                      <p>Energy {Math.trunc(item.engine5kwh)} kWh</p>
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
              <CardTitle className="text-xl font-bold">Engine 6</CardTitle>
              {fuelSelectorE6.includes(1) && (
                <span className="-ml-24 text-xs font-bold bg-yellow-400 border-2 border-transparent rounded-md px-[0.5rem] py-[0.100rem] shadow-md">
                  R-LNG
                </span>
              )}
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
                  {percentageUsedDataE6}%
                </div>
                <canvas id="engine6" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.engine6kw)} kW</p>
                      <p>Energy {Math.trunc(item.engine6kwh)} kWh</p>
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
      <h1 className="pt-1 text-center text-xl font-bold">UTILIZATION</h1>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                Weaving Shade 4
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
                <canvas id="takeoff4" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.Takeoff4kw)} kW</p>
                      <p>Energy {Math.trunc(item.Takeoff4kwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  2500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                Weaving Shade 5 & 6
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
                <canvas id="takeoff5" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.Takeoff5kw)} kW</p>
                      <p>Energy {Math.trunc(item.Takeoff5kwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  2500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                PROCESSING UNIT
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
                <canvas id="takeoff6" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.Takeoff6kw)} kW</p>
                      <p>Energy {Math.trunc(item.Takeoff6kwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  2500 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">SPINNING AM-8</CardTitle>
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
                <canvas id="takeoff7" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.Takeoff7kw)} kW</p>
                      <p>Energy {Math.trunc(item.Takeoff7kwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  6000 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                SPINNING AM-17
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
                  {percentageUsedDataT5}%
                </div>
                <canvas id="takeoff8" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.Takeoff8kw)} kW</p>
                      <p>Energy {Math.trunc(item.Takeoff8kwh)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  6000 total capacity in KW
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                AUXILIARY LOAD PH-2
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
                  {percentageUsedDataT6}%
                </div>
                <canvas id="aux" width="100" height="100" />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {Math.trunc(item.AUX_LV_Takeoff)} kW</p>
                      <p>Energy {Math.trunc(item.AUX_LV_KWH)} kWh</p>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  1565 total capacity in KW
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
