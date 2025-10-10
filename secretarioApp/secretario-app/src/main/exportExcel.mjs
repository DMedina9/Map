import { initDb, allAsync, runAsync } from './database/db.mjs'
import xlsx from 'xlsx'
import { insertTipoPublicador, insertPublicadores } from './importExcel.mjs'

const dataFields = {
    Nombre: 'Nombre',
    Contacto: 'Columna1',
    Participo: 'Participación en el ministerio',
    Cursos: 'Cursos bíblicos',
    Auxiliar: 'Precursor auxiliar',
    Horas: 'Horas\r\n (Si es precursor o misionero que sirve en el campo)',
    Notas: 'Notas'
}
const insertInformesGrupo = async ({ workbook, db, Privilegio, Tipo_Publicador, Publicadores, filePath, showMessage, sheetName }) => {
    if (!workbook && !filePath) return { success: false, message: 'No se proporcionó workbook ni filePath' }

    if (!workbook) {
        try {
            workbook = xlsx.readFile(filePath, { cellDates: true })
        } catch (err) {
            return { success: false, message: 'Error al leer el archivo: ' + err.message }
        }
    }
    sheetName = sheetName || 'Septiembre 2025'
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) return { success: false, message: `No se encontró la hoja "${sheetName}"` }

    const initialized = !!db
    if (!initialized) db = await initDb()

    if (!Tipo_Publicador) {
        await insertTipoPublicador(db)
        Tipo_Publicador = await allAsync(db, `select * from Tipo_Publicador`)
    }

    if (!Publicadores) {
        await insertPublicadores({ db, Privilegio, Tipo_Publicador, workbook })
        Publicadores = await allAsync(db, `select * from Publicadores`)
    }
    let count = 0
    try {
        // Importar informes
        const jsonInf = xlsx.utils.sheet_to_json(sheet)
        console.log(jsonInf)
        for (let p of jsonInf) {
//        console.log(p)
            if (p.Nombre === 'Nombre' || p.Nombre === 'Precursores regulares' ||p.Nombre === 'Publicadores') continue
            let publicador = Publicadores.find(
                (pub) => pub.nombre + (pub.apellidos ? ' ' + pub.apellidos : '') == p.Nombre
            )
            if (!publicador) continue
            /*let params = [
                publicador.id,
                p.Mes instanceof Date ? p.Mes.toISOString().substring(0, 10) : null,
                p['Mes enviado'] instanceof Date ? p['Mes enviado'].toISOString().substring(0, 10) : null,
                p['Predicó en el mes'] ? 1 : 0,
                p['Cursos bíblicos'],
                p['Tipo Publicador'] === 'Publicador'
                    ? 1
                    : p['Tipo Publicador'] === 'Precursor regular'
                        ? 2
                        : 3,
                p.Horas,
                p.Notas,
                p['Horas S. S. (PR)']
            ]
            await runAsync(
                db,
                `insert or ignore into Informes(
                    id_publicador, mes, mes_enviado, predico_en_el_mes, cursos_biblicos, id_tipo_publicador, horas, notas, horas_SS
                ) values (?,?,?,?,?,?,?,?,?)
                 ON CONFLICT(id_publicador, mes) DO UPDATE SET
                    mes_enviado = excluded.mes_enviado,
                    predico_en_el_mes = excluded.predico_en_el_mes,
                    cursos_biblicos = excluded.cursos_biblicos,
                    id_tipo_publicador = excluded.id_tipo_publicador,
                    horas = excluded.horas,
                    notas = excluded.notas,
                    horas_SS = excluded.horas_SS;`,
                params
            )
            count++;
            if (showMessage)
                showMessage({ progress: Math.round(100 * count / jsonInf.length), message: `Informe importado: ${p.Nombre} - ${p.Mes?.toISOString().substring(0, 10)}...` });
        */}
    } catch (e) {
        return { success: false, message: e.toString() }
    } finally {
        if (!initialized) await db.close()
    }
    return { success: true, message: `Informes importados: ${count}` }
}
console.log( insertInformesGrupo({filePath: `C:\\Users\\DanielMedina\\OneDrive\\Congregación Jardines de Andalucía\\Secretario\\Informes por grupo\\Informes - Grupo 1.xlsx`}) )