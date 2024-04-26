import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ICustomCard {
  title: string;
  active: number;
  total: number;
}

const CustomCard = ({ title, active, total }: ICustomCard) => {
  return (
    <Card className="rounded-none m-2 p-2">
      <CardContent className="p-2 space-y-2">
        <div className="flex-1 text-center space-y-1">
          <p className="text-base font-semibold leading-none">{title}</p>
          <div className="flex justify-center space-x-1">
            <span className="h-2 w-2 translate-y-1.5 rounded-full bg-green-600" />
            <p className="text-sm text-muted-foreground">
              Active {active}/{total}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
