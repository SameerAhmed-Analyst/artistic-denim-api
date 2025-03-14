import { NextRequest, NextResponse } from "next/server"
import { config } from "@/db/dbconfig"
const sql = require('mssql')

export const dynamic = 'force-dynamic'

export const GET = async () => {

    const pool = await sql.connect(config);

    try {

        const [result1, result2] = await Promise.all([
            pool.request().query('SELECT * FROM dashboard'),
            pool.request().query('SELECT hrsgsteampressure FROM Steam_PH2'),
        ]);

        // Combine results
        const combinedResults = {
            dashboard: result1.recordset,
            steam_p_hrsg: result2.recordset,
        };

        return NextResponse.json({ data: combinedResults }); // Send the data in the response
    } catch (error) {
        console.log("Error querying data: ", error);
        return NextResponse.json({ error: "Error querying data" });
    }
}