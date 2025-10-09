import { initDb, allAsync, runAsync } from './database/db.mjs'
import xlsx from 'xlsx'

const insertPrivilegios = async (db) => {
	const initialized = !!db;
	if (!initialized) db = await initDb()

	// Insertar privilegios
	for (let privilegio of ['Anciano', 'Siervo ministerial']) {
		await runAsync(db, `INSERT OR IGNORE INTO Privilegio (descripcion) VALUES (?)`, [
			privilegio
		])
	}
	if (!initialized) await db.close()
	return { success: true, message: 'Importado Privilegios' }
}

const insertTipoPublicador = async (db) => {
	const initialized = !!db;
	if (!initialized) db = await initDb()

	// Insertar tipos de publicador
	for (let tipo_Publicador of ['Publicador', 'Precursor regular', 'Precursor auxiliar']) {
		await runAsync(db, `INSERT OR IGNORE INTO Tipo_Publicador (descripcion) VALUES (?)`, [
			tipo_Publicador
		])
	}
	if (!initialized) await db.close()
	return { success: true, message: 'Importado Tipos de Publicador' }
}

const insertPublicadores = async ({ workbook, db, Privilegio, Tipo_Publicador, filePath, showMessage }) => {
	if (!workbook && !filePath) return { success: false }
	if (!workbook) workbook = xlsx.readFile(filePath, { cellDates: true })

	const sheet = workbook.Sheets['Publicadores']
	if (!sheet) return { success: false }

	const initialized = !!db;
	if (!initialized) db = await initDb()

	if (!Privilegio) {
		await insertPrivilegios(db)
		Privilegio = await allAsync(db, `select * from Privilegio`)
	}

	if (!Tipo_Publicador) {
		await insertTipoPublicador(db)
		Tipo_Publicador = await allAsync(db, `select * from Tipo_Publicador`)
	}
	let count = 0;
	// Importar publicadores
	const jsonPublicadores = xlsx.utils.sheet_to_json(sheet)
	for (let p of jsonPublicadores) {
		let nombre =
			p.Nombre && p.Nombre.indexOf(',') !== -1
				? p.Nombre.substring(p.Nombre.indexOf(',') + 2)
				: p.Nombre
		let apellidos =
			p.Nombre && p.Nombre.indexOf(',') !== -1
				? p.Nombre.substring(0, p.Nombre.indexOf(','))
				: ''
		if (nombre == 'Total') continue // Ignorar filas de totales

		let tipo_publicador = Tipo_Publicador.find((tp) => tp.descripcion == p['Tipo Publicador'])
		let privilegio = Privilegio.find((pr) => pr.descripcion == p.Privilegio)
		let params = [
			nombre,
			apellidos,
			p['Fecha de nacimiento']?.toISOString().substring(0, 10),
			p['Fecha de bautismo']?.toISOString().substring(0, 10),
			p.Grupo,
			p['Sup. Grupo'] === 'Sup' ? 1 : p['Sup. Grupo'] === 'Aux' ? 2 : 0,
			p.Sexo?.substring(0, 1),
			privilegio?.id,
			tipo_publicador?.id,
			p.Ungido ? 1 : 0,
			p.Calle,
			p.Núm,
			p.Colonia,
			p['Teléfono fijo'],
			p['Teléfono móvil'],
			p['Contacto de emergencia'],
			p['Tel. Contacto de emergencia'],
			p['Correo Contacto de emergencia'],
			nombre,
			apellidos
		]
		await runAsync(
			db,
			`INSERT OR IGNORE INTO Publicadores(
            nombre, apellidos, fecha_nacimiento, fecha_bautismo,
            grupo, sup_grupo, sexo, id_privilegio, id_tipo_publicador, ungido, calle, num, colonia,
            telefono_fijo, telefono_movil, contacto_emergencia, tel_contacto_emergencia, correo_contacto_emergencia
        ) select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
        where not exists (select 1 from Publicadores where nombre = ? and apellidos = ?)`,
			params
		)
		count++;
		if (showMessage)
			showMessage({ progress: Math.round(100 * count / jsonPublicadores.length), message: `Publicador importado: ${nombre} ${apellidos}...` });
	}
	if (!initialized) await db.close()
	return { success: true, message: 'Importado Publicadores' }
}

const insertInformes = async ({ workbook, db, Privilegio, Tipo_Publicador, Publicadores, filePath, showMessage }) => {
	if (!workbook && !filePath) return { success: false }
	if (!workbook) workbook = xlsx.readFile(filePath, { cellDates: true })

	const sheet = workbook.Sheets['Informes']
	if (!sheet) return { success: false }

	const initialized = !!db;
	if (!initialized) db = await initDb()

	if (!Tipo_Publicador) {
		await insertTipoPublicador(db)
		Tipo_Publicador = await allAsync(db, `select * from Tipo_Publicador`)
	}

	if (!Publicadores) {
		await insertPublicadores({ db, Privilegio, Tipo_Publicador, workbook })
		Publicadores = await allAsync(db, `select * from Publicadores`)
	}
	let count = 0;
	// Importar informes
	const jsonInf = xlsx.utils.sheet_to_json(sheet)
	for (let p of jsonInf) {
		let publicador = Publicadores.find(
			(pub) => (pub.apellidos ? pub.apellidos + ', ' : '') + pub.nombre == p.Nombre
		)
		if (!publicador) continue
		if (p.Nombre === 'Total') continue
		let params = [
			publicador.id,
			p.Mes?.toISOString().substring(0, 10),
			p['Mes enviado']?.toISOString().substring(0, 10),
			p['Predicó en el mes'] ? 1 : 0,
			p['Cursos bíblicos'],
			p['Tipo Publicador'] === 'Publicador'
				? 1
				: p['Tipo Publicador'] === 'Precursor regular'
					? 2
					: 3,
			p.Horas,
			p.Notas,
			p['Horas S. S. (PR)'],
			publicador.id,
			p.Mes instanceof Date ? p.Mes.toISOString().substring(0, 10) : null
		]
		await runAsync(
			db,
			`INSERT OR IGNORE INTO Informes(
        id_publicador, mes, mes_enviado, predico_en_el_mes, cursos_biblicos, id_tipo_publicador, horas, notas, horas_SS
      ) select ?,?,?,?,?,?,?,?,?
      where not exists (select 1 from Informes where id_publicador = ? and mes = ?)`,
			params
		)
		count++;
		if (showMessage)
			showMessage({ progress: Math.round(100 * count / jsonInf.length), message: `Informe importado: ${p.Nombre} - ${p.Mes?.toISOString().substring(0, 10)}...` });
	}
	if (!initialized) await db.close()
	return { success: true, message: 'Importado Informes' }
}
const insertAsistencias = async ({ workbook, db, filePath, showMessage }) => {
	if (!workbook && !filePath) return { success: false }
	if (!workbook) workbook = xlsx.readFile(filePath, { cellDates: true })

	const sheet = workbook.Sheets['Asistencias']
	if (!sheet) return { success: false }

	const initialized = !!db;
	if (!initialized) db = await initDb()
let count=0;
	const jsonAsis = xlsx.utils.sheet_to_json(sheet)
	for (let p of jsonAsis) {
		if (p.Fecha === 'Total' || !p.Fecha) continue // Ignorar filas de totales o sin fecha
		await runAsync(
			db,
			`INSERT OR IGNORE INTO Asistencias(fecha, asistentes, notas) VALUES (?,?,?)`,
			[p.Fecha?.toISOString().substring(0, 10), p.Asistentes, p.Notas]
		)
		count++;
		if (showMessage)
			showMessage({ progress: Math.round(100 * count / jsonAsis.length), message: `Asistencia importada: ${p.Fecha?.toISOString().substring(0, 10)}...` });
	}
	if (!initialized) await db.close()
	return { success: true, message: 'Importado Asistencias' }
}

const importExcel = async (filePath = 'data/Publicadores_Informes.xlsx', showMessage = null) => {
	const db = await initDb()
	await insertPrivilegios(db)
	const Privilegio = await allAsync(db, `select * from Privilegio`)

	await insertTipoPublicador(db)
	const Tipo_Publicador = await allAsync(db, `select * from Tipo_Publicador`)

	const workbook = xlsx.readFile(filePath, { cellDates: true })

	await insertPublicadores({ workbook, db, Privilegio, Tipo_Publicador, showMessage })
	const Publicadores = await allAsync(db, `select * from Publicadores`)

	await insertInformes({ workbook, db, Privilegio, Tipo_Publicador, Publicadores, showMessage })
	await insertAsistencias({ workbook, db, showMessage })

	await db.close()
	return { success: true }
}
//importExcel('C:\\Users\\DanielMedina\\OneDrive\\Congregación Jardines de Andalucía\\Secretario\\Jardines de Andalucía.xlsx').catch((err) => console.error(err));
export default { insertAsistencias, insertInformes, insertPublicadores, importExcel }