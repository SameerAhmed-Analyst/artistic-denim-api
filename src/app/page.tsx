"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { Chart } from "chart.js/auto";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PowerDataTypes {
  id: number;
  powerhouse1gen: number;
  powerhouse2gen: number;
  powerhouse3gen: number;
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

async function getSolarData() {
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

export default function Home() {
  const [data, setData] = useState<PowerDataTypes[]>([]);
  const [percentageUsedDataPH1, setPercentageUsedDataPH1] = useState("");
  const [percentageUsedDataPH2, setPercentageUsedDataPH2] = useState("");
  const [percentageUsedDataCoal, setPercentageUsedDataCoal] = useState("");
  const [percentageUsedDataEPH1, setPercentageUsedDataEPH1] = useState("");
  const [percentageUsedDataEPH2, setPercentageUsedDataEPH2] = useState("");
  const [percentageUsedDataSolar, setPercentageUsedDataSolar] = useState("");
  const [solarData, setSolarData] = useState<SolarData[]>([]);
  const [totalSolar, setTotalSolar] = useState(0);

  const refreshList = async () => {
    const result = await getData();
    setData(result.data);
    const resultSolar = await getSolarData();
    setSolarData(resultSolar.data);
  };

  useEffect(() => {
    refreshList();

    const intervalId = setInterval(() => {
      refreshList(); // Fetch data every 1 seconds
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

   // Testing new thing
  //  const outsideTextLabels = {
  //   id: 'outsideTextLabels',
  //   afterDatasetsDraw(chart, args, plugins) {
  //     const { ctx, data } = chart;
  
  //     const xCenter = chart.getDatasetMeta(0).data[0].x;
  //     const yCenter = chart.getDatasetMeta(0).data[0].y;
  //     const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius - 20;
  
  //     chart.getDatasetMeta(0).data.forEach((dataPoint, index) => {
  //       const value = data.datasets[0].data[index];
  //       console.log(value)
  //       if (value !== 0 && value >= 1) {
  //         const offset = dataPoint.options.offset;
  //         const startAngle = dataPoint.startAngle;
  //         const endAngle = dataPoint.endAngle;
  //         const centerAngle = (startAngle + endAngle) / 2;
  //         const xCoor = (outerRadius + offset) * Math.cos(centerAngle);
  //         const yCoor = (outerRadius + offset) * Math.sin(centerAngle);
  
  //         ctx.save();
  //         ctx.translate(xCenter, yCenter);
  //         ctx.font = 'bold 14px sans-serif';
  //         ctx.textAlign = 'center';
  //         ctx.textBaseline = 'middle';
  //         ctx.fillText(value, xCoor, yCoor);
  //         ctx.restore();
  //       }
  //     });
  //   }
  // };
  
  useEffect(() => {
    if (data.length > 0 && solarData.length > 0) {
      const ctx = document.getElementById("electricalph") as HTMLCanvasElement;
      let chartStatus = Chart.getChart(ctx);

      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      const valuesph1 = data.map((item) => item.powerhouse1gen);
      const valuesph2 = data.map((item) => item.powerhouse2gen);
      const valuesph3 = data.map((item) => item.powerhouse3gen);
      const valuesSolar = solarData.map((item) => item.solar_total_kW+item.AM17_solar1_kW+item.AM17_solar2_kW+item.AM8_solar_kW);
      const totalValueph1 = valuesph1.reduce((acc, curr) => acc + curr, 0);
      const totalValueph2 = valuesph2.reduce((acc, curr) => acc + curr, 0);
      const totalValueph3 = valuesph3.reduce((acc, curr) => acc + curr, 0);
      const totalValueSolar = valuesSolar.reduce((acc, curr) => acc + curr, 0);
      const remainingCapacity = 9650 + 14400 - 25675;
      const percentageUsedph1 = ((totalValueph1 / 9600) * 100).toFixed(1);
      const percentageUsedph2 = ((totalValueph2 / 14400) * 100).toFixed(1);
      const percentageUsedph3 = ((totalValueph3 / 14400) * 100).toFixed(1);
      const percentageUsedSolar = ((totalValueSolar / 1625) * 100).toFixed(1);
      setPercentageUsedDataEPH1(percentageUsedph1);
      setPercentageUsedDataEPH2(percentageUsedph2);
      setPercentageUsedDataSolar(percentageUsedSolar);
      setTotalSolar(totalValueSolar);

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              label: "D",
              data: [totalValueph1, totalValueph2, totalValueph3, totalValueSolar],
              backgroundColor: ["#384C6B", "#a75281", "#C09741", "#9595B7"],
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "60%",
          spacing: 7,
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
        plugins: [
          // outsideTextLabels
        ]
      });
      chart.update(); // Update the chart to apply changes
    }
  }, [data, solarData]);

  useEffect(() => {
    if (data.length > 0) {
      const ctx = document.getElementById(
        "powerhouse2gen"
      ) as HTMLCanvasElement;
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
      setPercentageUsedDataPH1(percentageUsedph1);
      setPercentageUsedDataPH2(percentageUsedph2);
      setPercentageUsedDataCoal(percentageUsedCoal);

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              label: "Data from API",
              data: [totalValueph1, totalValueph2, totalValueCoal],
              backgroundColor: ["#384C6B", "#E28A2B", "#9595B7"],
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "60%",
          spacing: 7,
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
        plugins: [
          // outsideTextLabels
        ]
      });
      chart.update(); // Update the chart to apply changes
    }
  }, [data]);

  return (
    <>
      <div className="">
        {/* <h1 className="text-2xl font-bold text-center pt-5">DASHBOARD</h1> */}
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
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "30%",
                      left: "139px",
                      lineHeight: "19px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {percentageUsedDataEPH1}% */}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "96%",
                      left: "-2px",
                      lineHeight: "19px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {percentageUsedDataEPH2}% */}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "53%",
                      left: "0",
                      marginTop: "-20px",
                      lineHeight: "19px",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "x-large",
                    }}
                  >
                    {data.map((item) =>
                      (
                        (item.powerhouse1gen +
                          item.powerhouse2gen + 
                          item.powerhouse3gen +
                          totalSolar) /
                        1000
                      ).toFixed(1)
                    )}{" "}
                    MW
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "0%",
                      left: "-82px",
                      lineHeight: "19px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {/* {percentageUsedDataSolar}% */}
                  </div>
                  <canvas id="electricalph" width="200" height="200" />
                </div>
              </CardContent>
              <div className="">
                <a href="/powerhouse1">
                  <div className="flex">
                    <div className="bg-[#384C6B] w-10 h-5 m-1"></div>
                    <p>Power House 1</p>
                    {data.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {(item.powerhouse1gen / 1000).toFixed(1)} MW
                        </p>
                      );
                    })}
                  </div>
                </a>
                <a href="/powerhouse2">
                  <div className="flex">
                    <div className="bg-[#a75281] w-10 h-5 m-1"></div>
                    <p>Power House 2</p>
                    {data.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {(item.powerhouse2gen / 1000).toFixed(1)} MW
                        </p>
                      );
                    })}
                  </div>
                </a>
                <a href="/powerhouse3">
                  <div className="flex">
                    <div className="bg-[#C09741] w-10 h-5 m-1"></div>
                    <p>Power House 3</p>
                    {data.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {(item.powerhouse3gen / 1000).toFixed(1)} MW
                        </p>
                      );
                    })}
                  </div>
                </a>
                <a href="/solar">
                  <div className="flex">
                    <div className="bg-[#9595B7] w-10 h-5 m-1"></div>
                    <p>Solar Panels</p>
                    {solarData.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {((item.solar_total_kW+item.AM17_solar1_kW+item.AM17_solar2_kW+item.AM8_solar_kW) / 1000).toFixed(2)} MW
                        </p>
                      );
                    })}
                  </div>
                </a>
                <div className="flex bg-[#1b2d92] m-[2px] p-1 text-white font-semibold rounded">
                  <p className="ml-1">Total Power Generation</p>
                  {data.map((item) => {
                    return (
                      <p className="ml-auto mr-5" key={item.id}>
                        {((item.totalpowergen + item.powerhouse3gen + totalSolar) / 1000).toFixed(1)}{" "}
                        MW
                      </p>
                    );
                  })}
                </div>
              </div>
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
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "21%",
                      left: "131px",
                      lineHeight: "19px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {percentageUsedDataPH1}% */}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "99%",
                      left: "0",
                      lineHeight: "19px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {percentageUsedDataPH2}% */}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "53%",
                      left: "0",
                      marginTop: "-20px",
                      lineHeight: "19px",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "x-large",
                    }}
                  >
                    {data.map((item) =>
                      (item.steamph1 + item.steamph2 + item.cb).toFixed(1)
                    )}{" "}
                    T/H
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      position: "absolute",
                      top: "23%",
                      right: "135px",
                      lineHeight: "19px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {percentageUsedDataCoal}% */}
                  </div>
                  <canvas id="powerhouse2gen" width="200" height="200" />
                </div>
              </CardContent>
              <div className="">
                <a href="/steamph1">
                  <div className="flex">
                    <div className="bg-[#384C6B] w-10 h-5 m-1"></div>
                    <p>Steam Power House 1</p>
                    {data.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {item.steamph1} T/H
                        </p>
                      );
                    })}
                  </div>
                </a>
                <a href="/steamph2">
                  <div className="flex">
                    <div className="bg-[#E28A2B] w-10 h-5 m-1"></div>
                    <p>Steam Power House 2</p>
                    {data.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {item.steamph2} T/H
                        </p>
                      );
                    })}
                  </div>
                </a>
                <a href="/steamph3">
                  <div className="flex">
                    <div className="bg-[#9595B7] w-10 h-5 m-1"></div>
                    <p>Coal Boiler</p>
                    {data.map((item) => {
                      return (
                        <p className="ml-auto mr-5" key={item.id}>
                          {item.cb} T/H
                        </p>
                      );
                    })}
                  </div>
                </a>
                <div className="flex bg-[#1b2d92] m-[2px] p-1 text-white font-semibold rounded">
                  <p className="ml-1">Total Steam Generation</p>
                  {data.map((item) => {
                    return (
                      <p className="ml-auto mr-5" key={item.id}>
                        {(item.steamph1 + item.steamph2 + item.cb).toFixed(1)}{" "}
                        T/H
                      </p>
                    );
                  })}
                </div>
              </div>
            </Card>
            <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-xl font-bold">
                  Gas Pressures
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
              <CardContent className="">
                <div className="flex justify-between">
                  <div className="w-[69.58px]">Capative</div>
                  {data.map((item) => (
                    <>
                      <div key={item.id} className="w-[50.63px]">
                        {item.ngas_psi}
                      </div>
                      <div>PSI</div>
                      <div key={item.id} className="w-[53.64px]">
                        {item.ngas_mbar}
                      </div>
                      <div>mBAR</div>
                    </>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div className="w-[69.58px]">Industrial</div>
                  {data.map((item) => (
                    <>
                      <div key={item.id} className="w-[50.63px]">
                        {item.industrialgas_psi}
                      </div>
                      <div>PSI</div>
                      <div key={item.id} className="w-[53.64px]">
                        {item.industrialgas_mbar}
                      </div>
                      <div>mBAR</div>
                    </>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div className="w-[69.58px]">RLNG</div>
                  {data.map((item) => (
                    <>
                      <div key={item.id} className="w-[50.63px]">
                        {item.rlng_psi}
                      </div>
                      <div>PSI</div>
                      <div key={item.id} className="w-[53.64px]">
                        {item.rlng_mbar}
                      </div>
                      <div>mBAR</div>
                    </>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div className="w-[69.58px]">FGC</div>
                  {data.map((item) => (
                    <>
                      <div key={item.id} className="w-[50.63px]">
                        {item.fgc}
                      </div>
                      <div>PSI</div>
                      <div key={item.id} className="w-[53.64px]">
                        {item.fgc_mbar}
                      </div>
                      <div>&nbsp;&nbsp;&nbsp;BAR</div>
                    </>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
