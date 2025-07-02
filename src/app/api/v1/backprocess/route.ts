// app/api/v1/backprocess/route.ts
import { NextResponse } from "next/server";
import { config } from "@/db/dbconfig";
const sql = require("mssql");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shedId = searchParams.get("shedId");

  // Validate shedId (must be "1" or "2")
  if (!shedId || isNaN(Number(shedId)) || !["1", "2"].includes(shedId)) {
    return NextResponse.json(
      { error: "Invalid Shed ID. Must be 1 or 2." },
      { status: 400 }
    );
  }

  // Connect to the database
  const pool = await sql.connect(config);

  try {
    const result = await pool
      .request()
      .input("shedId", sql.Int, Number(shedId))
      .query(
        `SELECT Id, Name, IsRunning, ShedId, Electricity, Steam, Water, Steam_Kitchen 
         FROM BACKPROCESS_MACHINES 
         WHERE ShedId = @shedId`
      );

    return NextResponse.json({ data: result.recordset });
  } catch (error) {
    console.error("Error querying data:", error);
    return NextResponse.json({ error: "Error querying data" }, { status: 500 });
  }
}
