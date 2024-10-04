import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/db/dbconfig';
const sql = require('mssql');

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(req.url);
        
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const startTime = searchParams.get('start_time');
        const endTime = searchParams.get('end_time');

        console.log('Received parameters:', { startDate, endDate, startTime, endTime });

        // Create a date-time object, making sure the format is handled correctly
        const startDateTime = startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
        const endDateTime = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

        if (!startDateTime || !endDateTime) {
            return NextResponse.json({ error: "Invalid date or time format" }, { status: 400 });
        }

        const pool = await sql.connect(config);

        // const query = `
        //     SELECT id, htp_pad_totalizer, monfort_totalizer, goller_totalizer, jeanologia_totalizer, timestamp
        //     FROM steam_totalizers
        //     WHERE timestamp BETWEEN @startDateTime AND @endDateTime
        // `;

        const query = `
            WITH RankedTotalizers AS (
            SELECT 
                DATEPART(YEAR, timestamp) AS [Year],
                DATEPART(MONTH, timestamp) AS [Month],
                DATEPART(DAY, timestamp) AS [Day],
                DATEPART(HOUR, timestamp) AS [Hour],
                htp_pad_totalizer,
                monfort_totalizer,
                goller_totalizer,
                jeanologia_totalizer,
                timestamp,
                ROW_NUMBER() OVER (PARTITION BY DATEPART(YEAR, timestamp), 
                                           DATEPART(MONTH, timestamp), 
                                           DATEPART(DAY, timestamp), 
                                           DATEPART(HOUR, timestamp) 
                                  ORDER BY timestamp) AS rn
            FROM 
                steam_totalizers
            WHERE 
                timestamp BETWEEN @startDateTime AND @endDateTime
        )
        SELECT 
            [Year], [Month], [Day], [Hour],
            htp_pad_totalizer, monfort_totalizer, 
            goller_totalizer, jeanologia_totalizer, 
            timestamp
        FROM 
            RankedTotalizers
        WHERE 
            rn = 1
        ORDER BY 
            [Year], [Month], [Day], [Hour];
        
        `;

        const result = await pool.request()
            .input('startDateTime', sql.DateTime, startDateTime)
            .input('endDateTime', sql.DateTime, endDateTime)
            .query(query);

        return NextResponse.json({ data: result.recordset });

    } catch (error) {
        console.error("Error querying data: ", error);
        return NextResponse.json({ error: "Error querying data" }, { status: 500 });
    }
};
