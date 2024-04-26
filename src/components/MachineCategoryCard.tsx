import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ICustomCateCard {
  title: string;
  active: number;
  total: number;
  image: string;
}

const MachineCategoryCard = ({
  title,
  active,
  total,
  image,
}: ICustomCateCard) => {
  return (
    <Card className="rounded-none m-2 p-2">
      <CardContent className="flex justify-evenly pb-0">
        <div className=" flex items-center space-x-4 p-2">
          <Link href={`/status/${title.toLocaleLowerCase()}`} >
            <Image src={"/" + image} width={100} height={50} alt={""} />
          </Link>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">
              Currently {active}/{total} Machines Working.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineCategoryCard;
