import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/db/dbconfig';
const sql = require('mssql');

// GET: Fetch the list of all machines
export async function GET(req: NextRequest) {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT machine_id, machine_name, shed, category, power, status
            FROM MachineData
        `);

        await pool.close();

        return NextResponse.json({ data: result.recordset });
    } catch (error) {
        console.error('Error fetching machine list:', error);
        return NextResponse.json({ error: 'Failed to fetch machine list' }, { status: 500 });
    }
}
