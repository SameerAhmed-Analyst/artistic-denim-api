import MachineCategoryCard from "@/components/MachineCategoryCard";

const page = () => {
  return (
    <>
      <div className="mt-3 grid grid-cols-1 lg:grid-cols-3">
        <MachineCategoryCard title={"Weaving"} active={120} total={340} image="loom.jpg" />
        <MachineCategoryCard title={"Rebeamer"} active={80} total={82} image="rebeamer.png" />
        <MachineCategoryCard title={"Mercerize"} active={2} total={2} image="mercerize.png" />
        <MachineCategoryCard title={"Sizing"} active={2} total={2} image="sizing.png" />
        <MachineCategoryCard title={"Ball Warping"} active={120} total={340} image="loom.jpg" />
        <p className="-z-10 absolute top-2/4 left-[15%] text-blue-300 font-bold -rotate-45 text-5xl">Development</p>
      </div>
    </>
  );
};

export default page;
