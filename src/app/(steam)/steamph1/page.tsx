"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface SteamData {
  id: number;
  whrbsteam: number;
  whrb1steam: number;
  whrb1pressure: number;
  whrb1water: number;
  whrb2steam: number;
  whrb2pressure: number;
  whrb2water: number;
  whrb3steam: number;
  whrb3pressure: number;
  whrb4steam: number;
  whrb4pressure: number;
  gasfiredsteamflow: number;
  gasfiredgasflow: number;
  gasfiredwaterflow: number;
  gasfiredpressure: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/steampowerhouse1", {
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
  const [percentageUsedData, setPercentageUsedData] = useState("");
  const [percentageUsedDataW1, setPercentageUsedDataW1] = useState("");
  const [percentageUsedDataW2, setPercentageUsedDataW2] = useState("");
  const [percentageUsedDataW3, setPercentageUsedDataW3] = useState("");
  const [percentageUsedDataW4, setPercentageUsedDataW4] = useState("");

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
      const values = data.map((item) => item.gasfiredsteamflow);
      const percentageUsed = initializeChart("gas", values, 20.0);
      setPercentageUsedData(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.whrb1steam);
      const percentageUsed = initializeChart("whrb1", values, 1.5);
      setPercentageUsedDataW1(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.whrb2steam);
      const percentageUsed = initializeChart("whrb2", values, 0.75);
      setPercentageUsedDataW2(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.whrb3steam);
      const percentageUsed = initializeChart("whrb3", values, 0.88);
      setPercentageUsedDataW3(percentageUsed);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.whrb4steam);
      const percentageUsed = initializeChart("whrb4", values, 0.88);
      setPercentageUsedDataW4(percentageUsed);
    }
  }, [data]);

  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <h1 className="text-center text-xl font-bold">
          Power House 1 Generation
        </h1>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">
              Gas Fired Boiler
            </CardTitle>
            <a href="/steamph1/171">
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
            </a>
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
                {percentageUsedData}%
              </div>
              <canvas id="gas" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.gasfiredsteamflow} T/H</p>
                    <p>Water Flow {item.gasfiredwaterflow} M3/H</p>
                    <p>Steam Pressure {item.gasfiredpressure} PSI</p>
                    <p>Gas Flow {item.gasfiredgasflow} M3/H</p>
                  </div>
                );
              })}
              {/* <p className="text-xs text-muted-foreground">
                1500 total capacity in KW
              </p> */}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 1</CardTitle>
            <a href="/steamph1/133">
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
            </a>
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
                {percentageUsedDataW1}%
              </div>
              <canvas id="whrb1" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.whrb1steam} T/H</p>
                    <p>Steam Pressure {item.whrb1pressure} PSI</p>
                    <p>Water Flow {item.whrb1water} M3/H</p>
                  </div>
                );
              })}
              {/* <p className="text-xs text-muted-foreground">
                1500 total capacity in KW
              </p> */}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 2</CardTitle>
            <a href="/steamph1/138">
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
            </a>
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
                {percentageUsedDataW2}%
              </div>
              <canvas id="whrb2" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.whrb2steam} T/H</p>
                    <p>Steam Pressure {item.whrb2pressure} PSI</p>
                    <p>Water Flow {item.whrb2water} M3/H</p>
                  </div>
                );
              })}
              {/* <p className="text-xs text-muted-foreground">
                1500 total capacity in KW
              </p> */}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 3</CardTitle>
            <a href="/steamph1/141">
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
            </a>
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
                {percentageUsedDataW3}%
              </div>
              <canvas id="whrb3" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.whrb3steam} T/H</p>
                    <p>Steam Pressure {item.whrb3pressure} PSI</p>
                    {/* <p>Water Flow {item.whrb2water} M3/H</p>  */}
                  </div>
                );
              })}
              {/* <p className="text-xs text-muted-foreground">
                1500 total capacity in KW
              </p> */}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 4</CardTitle>
            <a href="/steamph1/147">
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
            </a>
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
                    <p>Steam Flow {item.whrb4steam} T/H</p>
                    <p>Steam Pressure {item.whrb4pressure} PSI</p>
                    {/* <p>Water Flow {item.whrb4water} M3/H</p>  */}
                  </div>
                );
              })}
              {/* <p className="text-xs text-muted-foreground">
                1500 total capacity in KW
              </p> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
