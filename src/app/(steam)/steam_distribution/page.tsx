// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export interface SteamData {
  id: number;
  jean_steamflow: number;
  jean_pressure: number;
  jean_temp: number;
  jean_steamtotal: number;
  mon_single_steamflow: number;
  mon_single_pressure: number;
  mon_single_temp: number;
  mon_single_steamtotal: number;
  mon_double_steamflow: number;
  mon_double_pressure: number;
  mon_double_temp: number;
  mon_double_steamtotal: number;
}

async function getData() {
  try {
    const res = await fetch("/api/v1/steamdistribution", {
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

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className="pt-5 text-center text-xl font-bold">
        Steam Distribution
      </h1>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl font-bold">
                MonFort Single
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
              <div>
                <Image
                  src={"/steam-flow.png"}
                  alt={""}
                  width={100}
                  height={50}
                />
              </div>
              <div className="">
                {data.map((item) => {
                  return (
                    <div key={item.id} className="text-sm">
                      <p>Steam Flow {item.mon_single_steamflow} T/H</p>
                      <p>Pressure {item.mon_single_pressure} mPa</p>
                      <p>Temperature {item.mon_single_temp} C°</p>
                      <p>Totalizer {item.mon_single_steamtotal} TON</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
