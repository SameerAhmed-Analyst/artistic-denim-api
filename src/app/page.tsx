"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PowerDataTypes {
  id: number;
  powerhouse1gen: number;
  powerhouse2gen: number;
  totalpowergen: number;
  steamph1: number;
  steamph2: number;
  cb: number;
  steamgen: number;
  ps: null;
  ngas_psi: number;
  ngas_mbar: number;
  rlng_psi: number;
  rlng_mbar: number;
  fgc: number;
  fgc_mbar: number;
  industrialgas_psi: number;
  industrialgas_mbar: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/dashboard", {
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

export default function Home() {
  const [data, setData] = useState<PowerDataTypes[]>([]);
  const [percentageUsedDataPH1, setPercentageUsedDataPH1] = useState("");
  const [percentageUsedDataPH2, setPercentageUsedDataPH2] = useState("");
  const [percentageUsedDataCoal, setPercentageUsedDataCoal] = useState("");
  const [percentageUsedDataEPH1, setPercentageUsedDataEPH1] = useState("");
  const [percentageUsedDataEPH2, setPercentageUsedDataEPH2] = useState("");

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

  useEffect(() => {
    if (data.length > 0) {
      const ctx = document.getElementById("electricalph") as HTMLCanvasElement;
      let chartStatus = Chart.getChart(ctx);

      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      const valuesph1 = data.map((item) => item.powerhouse1gen);
      const valuesph2 = data.map((item) => item.powerhouse2gen);
      const totalValueph1 = valuesph1.reduce((acc, curr) => acc + curr, 0);
      const totalValueph2 = valuesph2.reduce((acc, curr) => acc + curr, 0);
      const remainingCapacity = (totalValueph1 + totalValueph2) - 15000;
      const percentageUsedph1 = ((totalValueph1 / 15000) * 100).toFixed(1);
      const percentageUsedph2 = ((totalValueph2 / 15000) * 100).toFixed(1);
      setPercentageUsedDataEPH1(percentageUsedph1)
      setPercentageUsedDataEPH2(percentageUsedph2)

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              label: "Data from API",
              data: [totalValueph1, totalValueph2, remainingCapacity],
              backgroundColor: ["#1b2d92", "#518EC9", "#E5E8E8"],
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "70%",
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
      chart.update(); // Update the chart to apply changes
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const ctx = document.getElementById("powerhouse2gen") as HTMLCanvasElement;
      let chartStatus = Chart.getChart(ctx);

      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      const valuesph1 = data.map((item) => item.steamph1);
      const valuesph2 = data.map((item) => item.steamph2);
      const valuesCoal = data.map((item) => item.cb);
      const totalValueph1 = valuesph1.reduce((acc, curr) => acc + curr, 0);
      const totalValueph2 = valuesph2.reduce((acc, curr) => acc + curr, 0);
      const totalValueCoal = valuesCoal.reduce((acc, curr) => acc + curr, 0);
      const percentageUsedph1 = ((totalValueph1 / 22) * 100).toFixed(1);
      const percentageUsedph2 = ((totalValueph2 / 21) * 100).toFixed(1);
      const percentageUsedCoal = ((totalValueCoal / 21) * 100).toFixed(1);
      setPercentageUsedDataPH1(percentageUsedph1)
      setPercentageUsedDataPH2(percentageUsedph2)
      setPercentageUsedDataCoal(percentageUsedCoal)

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              label: "Data from API",
              data: [totalValueph1, totalValueph2, totalValueCoal],
              backgroundColor: ["#1b2d92", "#2E8B57", "#FF4533"],
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "70%",
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
      chart.update(); // Update the chart to apply changes
    }
  }, [data]);

  return (
    <>
      <div className="">
        <h1 className="text-2xl font-bold text-center pt-5">DASHBOARD</h1>
        <div className="p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-xl font-bold">
                  Electrical Power Generation
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
              <CardContent className="flex justify-center">
                <div
                  style={{
                    width: "250px",
                    height: "250px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "-1%",
                      left: "74px",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    {percentageUsedDataEPH1}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "99%",
                      left: "0",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    {percentageUsedDataEPH2}%
                  </div>
                  <canvas id="electricalph" width="200" height="200" />
                </div>
              </CardContent>
            </Card>
            <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-xl font-bold">
                  Steam Generation
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
              <CardContent className="flex justify-center">
                <div
                  style={{
                    width: "250px",
                    height: "250px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "-1%",
                      left: "74px",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    {percentageUsedDataPH1}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "99%",
                      left: "0",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    {percentageUsedDataPH2}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "23%",
                      right: "135px",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    {percentageUsedDataCoal}%
                  </div>
                  <canvas id="powerhouse2gen" width="200" height="200" />
                </div>
                <div className="">
                  {/* {data.map((item) => {
                  return (
                    <div key={item.id} className="pt-3 text-base font-bold">
                      <p>Load {item.turbinekw} kW</p>
                      <p>Energy {item.turbinekwh} kWh</p>
                    </div>
                  );
                })} */}
                  {/* <p className="text-xs text-muted-foreground">
                  5500 total capacity in KW
                </p> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
