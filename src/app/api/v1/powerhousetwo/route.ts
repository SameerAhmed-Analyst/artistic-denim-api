import { NextRequest, NextResponse } from "next/server"
import { config } from "@/db/dbconfig"
const sql = require('mssql')

export const GET = async (response: NextResponse, { params }: { params: { table: string } }) => {

    const pool = await sql.connect(config);

    try {
        const result = await pool.request().query('SELECT * FROM powerhouse2');
        // console.log(result.recordset); // Log the data to the console

        return NextResponse.json({ data: result.recordset }); // Send the data in the response
    } catch (error) {
        console.log("Error querying data: ", error);
        return NextResponse.json({ error: "Error querying data" });
    }
}