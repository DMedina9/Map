import { initDb, allAsync, runAsync } from './database/db.mjs'
import xlsx from 'xlsx'

export const importExcel = async (filePath = 'data/Publicadores_Informes.xlsx') => {
	const db = await initDb()

	// Insertar privilegios y tipos de publicador
	for (let privilegio of [{ descripcion: 'Anciano' }, { descripcion: 'Siervo ministerial' }]) {
		await runAsync(db, `INSERT OR IGNORE INTO Privilegio (descripcion) VALUES (?)`, [
			privilegio.descripcion
		])
	}
	const Privilegio = await allAsync(db, `SELECT * FROM Privilegio`)
	console.log('Importado Privilegios')

	// Insertar tipos de publicador
	for (let tipo_Publicador of [
		{ descripcion: 'Publicador' },
		{ descripcion: 'Precursor regular' },
		{ descripcion: 'Precursor auxiliar' }
	]) {
		await runAsync(db, `INSERT OR IGNORE INTO Tipo_Publicador (descripcion) VALUES (?)`, [
			tipo_Publicador.descripcion
		])
	}
	const Tipo_Publicador = await allAsync(db, `SELECT * FROM Tipo_Publicador`)
	// Mostrar los tipos de publicador importados
	console.log('Importado Tipos de Publicador')

	const workbook = xlsx.readFile(filePath, { cellDates: true })

	// Importar publicadores
	const jsonPublicadores = xlsx.utils.sheet_to_json(workbook.Sheets['Publicadores'])
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
	}

	console.log('Importado Publicadores')
	const Publicadores = await allAsync(db, `SELECT * FROM Publicadores`)

	// Importar informes
	const jsonInf = xlsx.utils.sheet_to_json(workbook.Sheets['Informes'])

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
			p.Mes instanceof Date ? p.Mes.toISOString() : null
		]
		await runAsync(
			db,
			`INSERT OR IGNORE INTO Informes(
        id_publicador, mes, mes_enviado, predico_en_el_mes, cursos_biblicos, id_tipo_publicador, horas, notas, horas_SS
      ) select ?,?,?,?,?,?,?,?,?
      where not exists (select 1 from Informes where id_publicador = ? and mes = ?)`,
			params
		)
	}
	console.log('Importado Informes')
	const jsonAsis = xlsx.utils.sheet_to_json(workbook.Sheets['Asistencias'])

	for (let p of jsonAsis) {
		if (p.Fecha === 'Total' || !p.Fecha) continue // Ignorar filas de totales o sin fecha
		let params = [p.Fecha?.toISOString().substring(0, 10), p.Asistentes, p.Notas]
		await runAsync(
			db,
			`INSERT OR IGNORE INTO Asistencias(fecha, asistentes, notas) VALUES (?,?,?)`,
			params
		)
	}
	console.log('Importado Asistencias')

	await db.close()
	return { success: true }
}
//importExcel('C:\\Users\\DanielMedina\\OneDrive\\Congregación Jardines de Andalucía\\Secretario\\Jardines de Andalucía.xlsx').catch((err) => console.error(err));
