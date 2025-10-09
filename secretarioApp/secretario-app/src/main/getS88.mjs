import { initDb, allAsync } from './database/db.mjs';

const getS88 = async (event, [anio, type]) => {
    // Validar año
    if (!anio || isNaN(anio) || anio < 2020) {
        return { success: false, error: 'Año inválido' }
    }
    try {
        const db = await initDb()
        const rows = await allAsync(
            db,
            `select
                    (month + 3) % 12 + 1 as id,
                    month, num_reuniones, asistencia
                from (
                    SELECT
                        CASE WHEN CAST(STRFTIME('%w', fecha) AS INTEGER) IN (0,6) THEN 'FS' ELSE 'ES' END as type,
                        CAST(strftime('%m', fecha) AS INTEGER) AS month,
                        CAST(strftime('%Y', fecha) AS INTEGER) AS year,
                        COUNT(1) AS num_reuniones,
                        SUM(asistentes) AS asistencia
                    FROM Asistencias
                    where asistentes is not null
                    GROUP BY strftime('%Y-%m', fecha), CASE WHEN CAST(STRFTIME('%w', fecha) AS INTEGER) IN (0,6) THEN 'FS' ELSE 'ES' END
                ) a
                WHERE case when month > 8 then 1 else 0 end + year = ?
                and type = ?;
`,
            [anio, type]
        )
        await db.close()
        return { success: true, data: rows }
    } catch (error) {
        console.error('Database query error:', error)
        return { success: false, error: error.message }
    }
}
export default getS88;