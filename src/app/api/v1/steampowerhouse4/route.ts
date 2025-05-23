import { NextRequest, NextResponse } from "next/server"
import { config } from "@/db/dbconfig"
const sql = require('mssql')

export const dynamic = 'force-dynamic'

export const GET = async () => {

    const pool = await sql.connect(config);

    try {
        const result = await pool.request().query('SELECT whrb4steamflow, whrb4waterflow, whrb4steampressure, whrb5steamflow, whrb5waterflow, whrb5steampressure FROM Steam_PH3');
        // console.log(result.recordset); // Log the data to the console

        return NextResponse.json({ data: result.recordset }); // Send the data in the response
    } catch (error) {
        console.log("Error querying data: ", error);
        return NextResponse.json({ error: "Error querying data" });
    }
}