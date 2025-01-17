import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/db/dbconfig';
const sql = require('mssql');

// GET: Fetch data for a specific machine by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('machine_id', sql.VarChar, id)
            .query(`
                SELECT machine_id, machine_name, shed, category, current_amperes, frequency, 
                       kwh, power_factor, power, voltage, status
                FROM MachineData
                WHERE machine_id = @machine_id;
            `);

        await pool.close(); // Close the connection after query

        if (result.recordset.length === 0) {
            return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
        }

        return NextResponse.json({ data: result.recordset[0] });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch machine data' }, { status: 500 });
    }
}
