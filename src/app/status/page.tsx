import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <div className="mt-10">
      <Card className="rounded-md m-2 p-2 bg-black">
        <CardContent className="flex justify-between pb-0">
          <p className="text-white">Weaving</p>
          <p className="text-white">71</p>
          <p className="text-white">Status</p>
        </CardContent>
      </Card>
      <Card className="rounded-none m-2 p-2">
        <CardContent className="flex justify-between pb-0">
          <p>Spinning</p>
          <p>40</p>
          <p>Status</p>
        </CardContent>
      </Card>
      <Card className="rounded-none m-2 p-2">
        <CardContent className="flex justify-between pb-0">
          <p>Dyeing</p>
          <p>2</p>
          <p>Status</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
