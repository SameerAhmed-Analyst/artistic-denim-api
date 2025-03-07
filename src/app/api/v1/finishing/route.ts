// import { NextResponse } from 'next/server'
// import { config } from "@/db/dbconfig"
// const sql = require('mssql')

// export const dynamic = 'force-dynamic'

// export const GET = async (req: Request) => {
//   const url = new URL(req.url)
//   const shedNumber = url.searchParams.get("shed")

//   const pool = await sql.connect(config)

//   try {
//     const result = await pool.request()
//       .input('shedNumber', sql.Int, shedNumber)
//       .query(`
//         SELECT m.MachineID, m.MachineName, m.Status, c.UtilityType, c.Instantaneous, c.TillNow, c.Unit
//         FROM Machines m
//         JOIN Consumptions c ON m.MachineID = c.MachineID
//         WHERE m.Shed = @shedNumber
//       `)

//     return NextResponse.json(result.recordset)
//   } catch (error) {
//     console.log("Error querying data: ", error)
//     return NextResponse.json({ error: "Error querying data" })
//   }
// }

import { NextResponse } from "next/server";
import { config } from "@/db/dbconfig";
const sql = require("mssql");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shedId = searchParams.get("shedId");

  if (!shedId || isNaN(Number(shedId)) || !["1", "2"].includes(shedId)) {
    return NextResponse.json(
      { error: "Invalid Shed ID. Must be 1 or 2." },
      { status: 400 }
    );
  }

  const pool = await sql.connect(config);

  try {
    const result = await pool
      .request()
      .input("shedId", sql.Int, Number(shedId))
      .query(
        `SELECT Id, Name, IsRunning, ShedId, Electricity, Steam, Water, Gas FROM Machines WHERE ShedId = @shedId`
      );

    return NextResponse.json({ data: result.recordset });
  } catch (error) {
    console.error("Error querying data:", error);
    return NextResponse.json({ error: "Error querying data" }, { status: 500 });
  }
}
