import MachineCategoryCard from "@/components/MachineCategoryCard";

const page = () => {
  return (
    <>
      <div className="mt-3 grid grid-cols-1">
        <MachineCategoryCard title={"Weaving"} active={120} total={340} image="loom.jpg" />
        <MachineCategoryCard title={"Rebeamer"} active={80} total={82} image="rebeamer.png" />
        <MachineCategoryCard title={"Mercerize"} active={2} total={2} image="mercerize.png" />
        <MachineCategoryCard title={"Sizing"} active={2} total={2} image="sizing.png" />
        <MachineCategoryCard title={"Ball Warping"} active={120} total={340} image="loom.jpg" />
      </div>
    </>
  );
};

export default page;
