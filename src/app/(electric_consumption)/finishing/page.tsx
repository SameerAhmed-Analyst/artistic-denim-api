export default function Shed1Page({ machines }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">SHED 1</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {machines.map((machine) => (
          <MachineCard key={machine.MachineID} machine={machine} />
        ))} */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800">{"STENTER"}</h2>
          <div className="mt-4">
            <p className="text-gray-600">
              <span className="font-semibold">Utilities:</span>{" "}
              {/* {machine.Utilities.join(", ")} */}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  "ON" === "ON"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {"ON"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
