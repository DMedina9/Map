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
const MONTH_NAMES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]
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
    const [month_name, year] = sheetName.split(' ');
    const month = new Date(year * 1, MONTH_NAMES.indexOf(month_name), 1)
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
    const dataSource = []
    try {
        // Importar informes
        const jsonInf = xlsx.utils.sheet_to_json(sheet)
        let tipo_publicador = "Precursor regular";
        for (let p of jsonInf) {
            //        console.log(p)
            if (p.Nombre === 'Nombre' || p.Nombre === 'Precursores regulares' || p.Nombre === 'Publicadores') {
                switch (p.Nombre) {
                    case "Precursores regulares":
                        tipo_publicador = "Precursor regular"
                        break;
                    case "Publicadores":
                        tipo_publicador = p[dataFields["Auxiliar"]] ? "Precursor auxiliar" : "Publicador"
                        break;
                }
                continue
            }
            let publicador = Publicadores.find(
                (pub) => pub.nombre + (pub.apellidos ? ' ' + pub.apellidos : '') == p.Nombre
            )
            dataSource.push({
                id_publicador: publicador?.id,
                nombre: p.Nombre,
                mes: month.toISOString().substring(0, 10),
                mes_enviado: month.toISOString().substring(0, 10),//mes enviado
                participo: p[dataFields.Participo] ? 1 : 0,
                cursos: p[dataFields.Cursos],
                id_tipo_publicador: tipo_publicador === 'Publicador'
                    ? 1
                    : tipo_publicador === 'Precursor regular'
                        ? 2
                        : 3,
                horas: p[dataFields.Horas],
                notas: p[dataFields.Notas],
                horas_SS: null //Horas S. S. (PR)
            })
            /*if (!publicador) continue
            let params = [
                publicador.id,
                month.toISOString().substring(0, 10),
                month.toISOString().substring(0, 10),//mes enviado
                p[dataFields.Participo] ? 1 : 0,
                p[dataFields.Cursos],
                tipo_publicador === 'Publicador'
                    ? 1
                    : tipo_publicador === 'Precursor regular'
                        ? 2
                        : 3,
                p[dataFields.Horas],
                p[dataFields.Notas],
                null //Horas S. S. (PR)
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
        */
        }
    } catch (e) {
        return { success: false, message: e.toString() }
    } finally {
        if (!initialized) await db.close()
    }
    return { success: true, dataSource }
}
const data = await insertInformesGrupo({ filePath: `C:\\Users\\DanielMedina\\OneDrive\\Congregación Jardines de Andalucía\\Secretario\\Informes por grupo\\Informes - Grupo 1.xlsx` })
console.log(data)