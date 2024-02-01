// components/ui/CardComponent.tsx
import React from 'react';
import { Card } from '@tremor/react';
import { CardContent, CardHeader, CardTitle } from './ui/card';
import { EngineData } from '@/app/(powerhouses)/powerhouse1/page';

interface CardComponentProps {
  title: string;
  percentageUsed: string;
  canvasId: string;
  data: EngineData[];
  dataKey: string;
  totalCapacity: number;
}

const CardComponent: React.FC<CardComponentProps> = ({
  title,
  percentageUsed,
  canvasId,
  data,
  dataKey,
  totalCapacity,
}) => {
  return (
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
                {percentageUsed}%
              </div>
              <canvas id={canvasId} width="100" height="100" />
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
                {totalCapacity} total capacity in KW
              </p>
            </div>
          </CardContent>
    </Card>
  );
};

export default CardComponent;
