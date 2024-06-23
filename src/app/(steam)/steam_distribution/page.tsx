// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export interface SteamData {
  id: number;
  htp_pad_steamflow: number;
  htp_pad_pressure: number;
  htp_pad_temp: number;
  htp_pad_steamtotal: number;
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

async function getData(): Promise<{ data: SteamData[] } | undefined> {
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
    console.error("Error fetching data:", error);
  }
}

type SteamDataKey = 'htp_pad' | 'mon_single' | 'mon_double' | 'jean';

type SteamDataMap = {
  [key in SteamDataKey]: {
    steamflow: keyof SteamData;
    pressure: keyof SteamData;
    temp: keyof SteamData;
    steamtotal: keyof SteamData;
  };
};

const steamDataMap: SteamDataMap = {
  htp_pad: {
    steamflow: 'htp_pad_steamflow',
    pressure: 'htp_pad_pressure',
    temp: 'htp_pad_temp',
    steamtotal: 'htp_pad_steamtotal',
  },
  mon_single: {
    steamflow: 'mon_single_steamflow',
    pressure: 'mon_single_pressure',
    temp: 'mon_single_temp',
    steamtotal: 'mon_single_steamtotal',
  },
  mon_double: {
    steamflow: 'mon_double_steamflow',
    pressure: 'mon_double_pressure',
    temp: 'mon_double_temp',
    steamtotal: 'mon_double_steamtotal',
  },
  jean: {
    steamflow: 'jean_steamflow',
    pressure: 'jean_pressure',
    temp: 'jean_temp',
    steamtotal: 'jean_steamtotal',
  },
};

const SteamCard: React.FC<{ title: string, dataKey: SteamDataKey, data: SteamData[] }> = ({ title, dataKey, data }) => (
  <Card className="p-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
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
    <CardContent className="flex justify-evenly items-center">
      <div>
        <Image
          src={"/flow-meter.png"}
          alt="Flow Meter"
          width={100}
          height={100}
          priority={false}
          loading="lazy"
        />
      </div>
      <div className="text-sm">
        {data.map((item) => (
          <div key={item.id}>
            <p>Steam Flow {item[steamDataMap[dataKey].steamflow]?.toFixed(2) ?? 'N/A'} T/H</p>
            <p>Pressure {item[steamDataMap[dataKey].pressure]?.toFixed(2) ?? 'N/A'} mPa</p>
            <p>Temperature {item[steamDataMap[dataKey].temp]?.toFixed(2) ?? 'N/A'} C°</p>
            <p>Totalizer {item[steamDataMap[dataKey].steamtotal]?.toFixed(2) ?? 'N/A'} TON</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Page: React.FC = () => {
  const [data, setData] = useState<SteamData[]>([]);

  const refreshList = async () => {
    const result = await getData();
    if (result) {
      setData(result.data);
    }
  };

  useEffect(() => {
    refreshList();
    const intervalId = setInterval(refreshList, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className="pt-5 text-center text-xl font-bold">Steam Distribution</h1>
      <p className="text-center pt-2">
        <span className="bg-green-300 px-5 py-[6px] rounded-full rounded-tr-none rounded-bl-none font-semibold">Shed 1 Distribution</span>
      </p>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SteamCard title="HTP PAD" dataKey="htp_pad" data={data} />
        </div>
      </div>
      <p className="text-center pt-2">
        <span className="bg-teal-300 px-5 py-[6px] rounded-full rounded-tr-none rounded-bl-none font-semibold">Shed 2 Distribution</span>
      </p>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SteamCard title="Monfort" dataKey="mon_single" data={data} />
          <SteamCard title="Goller" dataKey="mon_double" data={data} />
          <SteamCard title="Jeanologia" dataKey="jean" data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
