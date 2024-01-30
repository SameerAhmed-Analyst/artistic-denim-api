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
  const [percentageUsedDataT1, setPercentageUsedDataT1] = useState("");

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 3 seconds
    }, 3000);

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
    const percentageUsed = ((totalValue / totalCapacity) * 100).toFixed(2);

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
      const percentageUsed = initializeChart("turbine", values, 5500);
      setPercentageUsedDataT1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine1kw);
      const percentageUsed = initializeChart("engine1", values, 1400.0);
      setPercentageUsedDataE1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine2kw);
      const percentageUsed = initializeChart("engine2", values, 1500.0);
      setPercentageUsedDataE2(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine3kw);
      const percentageUsed = initializeChart("engine3", values, 1500.0);
      setPercentageUsedDataE3(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine4kw);
      const percentageUsed = initializeChart("engine4", values, 1500.0);
      setPercentageUsedDataE4(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine5kw);
      const percentageUsed = initializeChart("engine5", values, 1500.0);
      setPercentageUsedDataE5(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine6kw);
      const percentageUsed = initializeChart("engine6", values, 1500.0);
      setPercentageUsedDataE6(percentageUsed);
    }
  }, [data]);

  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">Turbine</CardTitle>
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
              <canvas id="turbine" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    <p>Load {item.turbinekw} kW</p>
                    <p>Energy {item.turbinekwh} kWh</p>
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
            <CardTitle className="text-xl font-bold">Engine 1</CardTitle>
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
                    <p>Load {item.engine1kw} kW</p>
                    <p>Energy {item.engine1kwh} kWh</p>
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
                    <p>Load {item.engine2kw} kW</p>
                    <p>Energy {item.engine2kwh} kWh</p>
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
                    <p>Load {item.engine3kw} kW</p>
                    <p>Energy {item.engine3kwh} kWh</p>
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
                    <p>Load {item.engine4kw} kW</p>
                    <p>Energy {item.engine4kwh} kWh</p>
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
                    <p>Load {item.engine5kw} kW</p>
                    <p>Energy {item.engine5kwh} kWh</p>
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
                    <p>Load {item.engine6kw} kW</p>
                    <p>Energy {item.engine6kwh} kWh</p>
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
  );
};

export default Page;
