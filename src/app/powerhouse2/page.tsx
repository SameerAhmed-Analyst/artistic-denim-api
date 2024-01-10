// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, DonutChart, Title } from "@tremor/react";
import Chart from "chart.js/auto";
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
      next: {
        revalidate: 1,
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

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 3 seconds
    }, 7500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.engine2kw);
      const totalCapacity = 1200.0;
      const totalValue = values.reduce((acc, curr) => acc + curr, 0);
      const remainingCapacity = totalCapacity - totalValue;
      const percentageUsed = ((totalValue / totalCapacity) * 100).toFixed(2);

      const ctx = document.getElementById(
        "myChart"
      ) as HTMLCanvasElement | null;

      let chartStatus = Chart.getChart("myChart");
      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      Chart.register({
        id: "centerTextPlugin",
        afterDraw: (chart, args, options) => {
          const { ctx } = chart;
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "10x Arial";
          ctx.fillStyle = "#000";
          ctx.fillText(`${percentageUsed}%`, centerX, centerY);
        },
      });

      const chartOptions: Chart.ChartOptions<"doughnut"> = {
        responsive: true,
        cutout: "80%",
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            enabled: false,
          },
          centerTextPlugin: {}, // Use the custom plugin
        },
        // Other options...
      };

      if (ctx !== null) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                label: "Data from API",
                data: [totalValue, remainingCapacity],
                backgroundColor: ["#28B463", "#E5E8E8"],
              },
            ],
          },
          options: chartOptions,
        });
      } else {
        console.error("Canvas context is null. Cannot create chart.");
      }
    }
  }, [data]);

  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div style={{ width: "100px", height: "100px" }}>
              <canvas id="myChart"></canvas>
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    Load {item.engine2kw} kW
                    <p>Energy {item.engine2kwh} kWh</p>
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
            <div style={{ width: "100px", height: "100px" }}>
              <canvas id="myChart"></canvas>
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    Load {item.engine2kw} kW
                    <p>Energy {item.engine2kwh} kWh</p>
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
            <div style={{ width: "100px", height: "100px" }}>
              <canvas id="myChart"></canvas>
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    Load {item.engine2kw} kW
                    <p>Energy {item.engine2kwh} kWh</p>
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
            <div style={{ width: "100px", height: "100px" }}>
              <canvas id="myChart"></canvas>
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    Load {item.engine2kw} kW
                    <p>Energy {item.engine2kwh} kWh</p>
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
            <div style={{ width: "100px", height: "100px" }}>
              <canvas id="myChart"></canvas>
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    Load {item.engine2kw} kW
                    <p>Energy {item.engine2kwh} kWh</p>
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
            <div style={{ width: "100px", height: "100px" }}>
              <canvas id="myChart"></canvas>
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="pt-3 text-base font-bold">
                    Load {item.engine2kw} kW
                    <p>Energy {item.engine2kwh} kWh</p>
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
  );
};

export default Page;
