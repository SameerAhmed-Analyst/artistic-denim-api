import { NextRequest, NextResponse } from "next/server"
import { config } from "@/db/dbconfig"
const sql = require('mssql')

export const dynamic = 'force-dynamic'

export const GET = async () => {

    const pool = await sql.connect(config);

    try {
        const result1 = await pool.request().query('SELECT * FROM OVERVIEW');
        const result2 = await pool.request().query('SELECT powerhouse1gen, powerhouse2gen, powerhouse3gen, AM17_PH2, totalpowergen FROM dashboard');
        
        // Combine results
        const combinedResults = {
            overview: result1.recordset,
            dashboard: result2.recordset
        };
    
        return NextResponse.json({ data: combinedResults });
    } catch (error) {
        console.log("Error querying data: ", error);
        return NextResponse.json({ error: "Error querying data" });
    }
    
}