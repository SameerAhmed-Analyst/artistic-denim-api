import CustomCard from "@/components/customcard";

const page = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <CustomCard title={"Weaving"} active={120} total={300} />
      <CustomCard title={"Dyeing"} active={2} total={2} />
      <CustomCard title={"Rebeamer"} active={24} total={30} />
      <CustomCard title={"Ball Warping"} active={1} total={1} />
      <CustomCard title={"Mercerize"} active={1} total={1} />
      <CustomCard title={"Sizing"} active={5} total={6} />
    </div>
  );
};

export default page;
