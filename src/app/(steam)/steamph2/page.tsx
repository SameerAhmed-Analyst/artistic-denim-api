// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import Hrsg from "@/components/Hrsg";

export interface SteamData {
  id: number;
  hrsgsteamflow: number;
  hrsgsteamtotal: number;
  hrsgwaterflow: number;
  hrsgwatertotal: number;
  whrb1steamflow: number;
  whrb2steamflow: number;
  whrb3steamflow: number;
  whrb4steamflow: number;
  whrb1steamtotal: number;
  whrb2steamtotal: number;
  whrb3steamtotal: number;
  whrb4steamtotal: number;
  whrb1waterflow: number;
  whrb2waterflow: number;
  whrb3waterflow: number;
  whrb4waterflow: number;
  whrb1watertotal: number;
  whrb2watertotal: number;
  whrb3watertotal: number;
  whrb4watertotal: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/steampowerhouse2", {
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
  const [data, setData] = useState<SteamData[]>([]);
  const [percentageUsedData, setPercentageUsedData] = useState("");

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 3 seconds
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.whrb1steamflow);
      const totalCapacity = 1.0;
      const totalValue = values.reduce((acc, curr) => acc + curr, 0);
      const remainingCapacity = totalCapacity - totalValue;
      const percentageUsed = ((totalValue / totalCapacity) * 100).toFixed(2);
      setPercentageUsedData(percentageUsed);

      const ctx = document.getElementById("whrb1") as HTMLCanvasElement;

      let chartStatus = Chart.getChart(ctx);
      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      const chart = new Chart(ctx, {
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

      chart.update(); // Update the chart to apply changes
    }
  }, [data]);

  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-xl font-bold">WHRB 1</CardTitle>
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
                {percentageUsedData}%
              </div>
              <canvas id="whrb1" width="100" height="100" />
            </div>
            <div className="">
              {data.map((item) => {
                return (
                  <div key={item.id} className="text-sm">
                    <p>Steam Flow {item.whrb1steamflow} T/H</p>
                    <p>Steam Total {item.whrb1steamtotal} Ton</p>
                    <p>Water Flow {item.whrb1waterflow} M3/H</p>
                    <p>Water Total {item.whrb1watertotal} M3</p>
                  </div>
                );
              })}
              {/* <p className="text-xs text-muted-foreground">
                1500 total capacity in KW
              </p> */}
            </div>
          </CardContent>
        </Card>
        {/* <Hrsg /> */}
      </div>
    </div>
  );
};

export default Page;
