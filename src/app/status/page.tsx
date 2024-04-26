import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomCard from "@/components/customcard";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="mt-10 grid grid-cols-1">
        <Card className="rounded-md m-2 p-2 bg-black">
          <CardContent className="flex justify-between pb-0">
            <p className="text-white">Weaving</p>
            <p className="text-white">71</p>
          </CardContent>
        </Card>
        <Card className="rounded-none m-2 p-2">
          <CardContent className="flex justify-evenly pb-0">
            <div className=" flex items-center space-x-4 p-2">
              <Image
                src={"/air-jet-loom-500x500.jpg"}
                width={100}
                height={100}
                alt={""}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none">Weaving</p>
                <p className="text-sm text-muted-foreground">
                  Currently 120 Machines Working.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2">
        <CustomCard title={"Weaving"} active={120} total={300} />
        <CustomCard title={"Dyeing"} active={2} total={2} />
        <CustomCard title={"Rebeamer"} active={24} total={30} />
        <CustomCard title={"Ball Warping"} active={1} total={1} />
        <CustomCard title={"Mercerize"} active={1} total={1} />
        <CustomCard title={"Sizing"} active={5} total={6} />
      </div>
    </>
  );
};

export default page;
