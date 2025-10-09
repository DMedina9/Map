import { ipcMain, dialog, shell } from 'electron'
import { initDb, allAsync } from './database/db.mjs'
import { GenerarS21, GenerarS21Totales, GenerarS88 } from './fillPDF.mjs'
import { insertAsistencias, insertInformes, insertPublicadores } from './importExcel.mjs'

import getS88 from './getS88.mjs';

export default function initIPC() {
	// IPC test
	ipcMain.on('ping', () => console.log('pong'))
	ipcMain.on('upload-informes', async (event) => {
		const mainWindow = null;
		const result = await dialog.showOpenDialog(mainWindow, {
			filters: [
				{ name: 'Microsoft Excel', extensions: ['xlsx'] }
			],
			properties: ['openFile']
		})
		if (!result.canceled) {
			const { success, message } = await insertInformes({ filePath: result.filePaths[0], showMessage: message => event.sender.send('upload-informes-message', message) });
			event.sender.send('upload-informes-reply', { type: success ? "success" : "error", message })
		}
		event.returnValue = 'canceled'
	})
	ipcMain.on('upload-asistencias', async (event) => {
		const mainWindow = null;
		const result = await dialog.showOpenDialog(mainWindow, {
			filters: [
				{ name: 'Microsoft Excel', extensions: ['xlsx'] }
			],
			properties: ['openFile']
		})
		if (!result.canceled) {
			const { success, message } = await insertAsistencias({ filePath: result.filePaths[0], showMessage: message => event.sender.send('upload-asistencias-message', message) });
			event.sender.send('upload-asistencias-reply', { type: success ? "success" : "error", message })
			return;
		}
		event.returnValue = 'canceled'
	})
	ipcMain.on('upload-publicadores', async (event) => {
		const mainWindow = null;
		const result = await dialog.showOpenDialog(mainWindow, {
			filters: [
				{ name: 'Microsoft Excel', extensions: ['xlsx'] }
			],
			properties: ['openFile']
		})
		if (!result.canceled) {
			const { success, message } = await insertPublicadores({ filePath: result.filePaths[0], showMessage: message => event.sender.send('upload-publicadores-message', message) });
			event.sender.send('upload-publicadores-reply', { type: success ? "success" : "error", message })
			return;
		}
		event.returnValue = 'canceled'
	})

	ipcMain.on('save-S-21', async (event, [year, pubId]) => {
		const mainWindow = null;
		const result = await dialog.showOpenDialog(mainWindow, {
			properties: ['openDirectory']
		})
		if (!result.canceled) {
			let r = await GenerarS21(year, pubId, result.filePaths[0], message => event.sender.send('save-S-21-message', message));
			if (!r.success) {
				event.returnValue = 'failed'
				return;
			}
			if (!pubId)
				r = await GenerarS21Totales(year, pubId, result.filePaths[0], message => event.sender.send('save-S-21-message', message));

			/*if (pubId) {
				await shell.openPath(filePaths[0]);
				event.returnValue = 'success'
			}
			else*/
			if (r.success)
				event.sender.send('save-S-21-reply', { type: "success", message: r.filePaths.length > 1 ? "Archivos generados con éxito!" : "Archivo generado con éxito!" })
			else {
				event.returnValue = 'failed'
				return;
			}
		}
		event.returnValue = 'canceled'
	})
	ipcMain.on('save-S-88', async (event, year) => {
		const mainWindow = null;
		const result = await dialog.showOpenDialog(mainWindow, {
			properties: ['openDirectory']
		})
		if (!result.canceled) {
			let r = await GenerarS88(year, result.filePaths[0], message => event.sender.send('save-S-88-message', message));

			/*if (pubId) {
				await shell.openPath(filePaths[0]);
				event.returnValue = 'success'
			}
			else*/
			if (r.success)
				event.sender.send('save-S-88-reply', { type: "success", message: "Archivo generado con éxito!" })
			else {
				event.returnValue = 'failed'
				return;
			}
		}
		event.returnValue = 'canceled'
	})

	ipcMain.handle('get-mes-informe', async (event) => {
		try {
			const db = await initDb()
			const rows = await allAsync(
				db,
				`select max(mes) as mes from Informes`
			)
			await db.close()
			const aMonth = rows[0].mes.split('-')
			const month = new Date(aMonth[0], aMonth[1] * 1 - 1, 1)
			return month
		} catch (error) {
			console.error('Database query error:', error)
			return null
		}
	})
	ipcMain.handle('get-asistencias', async (event) => {
		try {
			const db = await initDb()
			const rows = await allAsync(
				db,
				`select *, case when cast(strftime('%w', fecha) as integer) in (6,0) then 'Fin de semana' else 'Entresemana' end as tipo_asistencia from Asistencias order by fecha desc`
			)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('add-asistencia', async (event, asistencia) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(
				`insert or ignore into Asistencias (fecha, asistentes) values (?, ?)`
			)
			const result = await stmt.run([asistencia.fecha, asistencia.asistentes])
			await stmt.finalize()
			await db.close()
			return { success: true, lastID: result.lastID }
		} catch (error) {
			console.error('Database insert error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('update-asistencia', async (event, asistencia) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(
				`update Asistencias set fecha = ?, asistentes = ? where id = ?`
			)
			const result = await stmt.run([asistencia.fecha, asistencia.asistentes, asistencia.id])
			await stmt.finalize()
			await db.close()
			return { success: true, changes: result.changes }
		} catch (error) {
			console.error('Database update error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('delete-asistencia', async (event, asistenciaId) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`delete from Asistencias where id = ?`)
			const result = await stmt.run([asistenciaId])
			await stmt.finalize()
			await db.close()
			return { success: true, changes: result.changes }
		} catch (error) {
			console.error('Database delete error:', error)
			return { success: false, error: error.message }
		}
	})

	ipcMain.handle('get-publicadores', async (event) => {
		try {
			const db = await initDb()
			const rows = await allAsync(
				db,
				`select
                    p.*,
                    case sup_grupo when 1 then 'Sup' when 2 then 'Aux' else null end as sup_grupo_desc,
                    pr.descripcion as privilegio,
                    tp.descripcion as tipo_publicador
                from Publicadores p
                left join Privilegio pr
                    on pr.id = p.id_privilegio
                left join Tipo_Publicador tp
                    on tp.id = p.id_tipo_publicador
                order by grupo, apellidos, nombre`
			)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('get-informes', async (event, [anio_servicio, id_publicador, dir]) => {
		try {
			const db = await initDb()
			const rows = await allAsync(
				db,
				`select i.*,
				p.nombre || ' ' || p.apellidos as publicador,
				tp.descripcion as tipo_publicador,
				(cast(strftime('%m', mes) as integer) + 3) % 12 + 1 as iNumMes,
				case when tp.descripcion = 'Precursor regular' then max(0, min(55 - horas, ifnull(horas_SS, 0))) else null end as horas_Acred,
				case when (select sum(predico_en_el_mes) from Informes a where id_publicador = i.id_publicador and date(mes) between date(i.mes, '-6 months') and date(i.mes, '-1 months')) > 0 then 'Activo' else 'Inactivo' end as EstatusAnterior,
				case when (select sum(predico_en_el_mes) from Informes a where id_publicador = i.id_publicador and date(mes) between date(i.mes, '-5 months') and date(i.mes)) > 0 then 'Activo' else 'Inactivo' end as Estatus
			from Informes i
			left join Publicadores p
				on i.id_Publicador = p.id
			left join Tipo_Publicador tp
				on tp.id = i.id_tipo_publicador
			where 1 = 1
			${anio_servicio && `and case when cast(strftime('%m', i.mes) as integer) > 8 then 1 else 0 end + cast(strftime('%Y', i.mes) as integer) = ${anio_servicio}`}
			${id_publicador && `and p.id = ${id_publicador}`}
			order by i.mes ${(dir === undefined ? 'desc' : dir)}, p.apellidos, p.nombre`
			)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('add-informe', async (event, informe) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`insert into Informes
			  (id_publicador,
				mes,
				mes_enviado,
				predico_en_el_mes,
				cursos_biblicos,
				id_tipo_publicador,
				horas,
				notas,
				horas_SS)
			  values (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
			const result = await stmt.run([
				informe.id_publicador,
				informe.mes,
				informe.mes_enviado,
				informe.predico_en_el_mes,
				informe.cursos_biblicos,
				informe.id_tipo_publicador,
				informe.horas,
				informe.notas,
				informe.horas_SS
			])
			await stmt.finalize()
			await db.close()
			return { success: true, lastID: result.lastID }
		} catch (error) {
			console.error('Database insert error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('update-informe', async (event, informe) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`update Informes set
				id_publicador = ?,
				mes = ?,
				mes_enviado = ?,
				predico_en_el_mes = ?,
				cursos_biblicos = ?,
				id_tipo_publicador = ?,
				horas = ?,
				notas = ?,
				horas_SS = ?
			  where id = ?`)
			const result = await stmt.run([
				informe.id_publicador,
				informe.mes,
				informe.mes_enviado,
				informe.predico_en_el_mes,
				informe.cursos_biblicos,
				informe.id_tipo_publicador,
				informe.horas,
				informe.notas,
				informe.horas_SS,
				informe.id
			])
			await stmt.finalize()
			await db.close()
			return { success: true, changes: result.changes }
		} catch (error) {
			console.error('Database update error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('delete-informe', async (event, informeId) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`delete from Informes where id = ?`)
			const result = await stmt.run([informeId])
			await stmt.finalize()
			await db.close()
			return { success: true, changes: result.changes }
		} catch (error) {
			console.error('Database delete error:', error)
			return { success: false, error: error.message }
		}
	})

	ipcMain.handle('get-privilegios', async (event) => {
		try {
			const db = await initDb()
			const rows = await allAsync(db, `select * from Privilegio order by id`)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('get-tipos-publicador', async (event) => {
		try {
			const db = await initDb()
			const rows = await allAsync(db, `select * from Tipo_Publicador order by id`)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('add-publicador', async (event, publicador) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`insert into Publicadores
              (nombre,
                apellidos,
                sexo,
                fecha_nacimiento,
                fecha_bautismo,
                grupo,
                id_tipo_publicador,
                id_privilegio,
                sup_grupo,
                ungido,
                calle,
                num,
                colonia,
                telefono_fijo,
                telefono_movil,
                contacto_emergencia,
                tel_contacto_emergencia,
                correo_contacto_emergencia)
              values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
			const result = await stmt.run([
				publicador.nombre,
				publicador.apellidos,
				publicador.sexo,
				publicador.fecha_nacimiento,
				publicador.fecha_bautismo,
				publicador.grupo,
				publicador.id_tipo_publicador,
				publicador.id_privilegio,
				publicador.sup_grupo,
				publicador.ungido ? 1 : 0,
				publicador.calle,
				publicador.num,
				publicador.colonia,
				publicador.telefono_fijo,
				publicador.telefono_movil,
				publicador.contacto_emergencia,
				publicador.tel_contacto_emergencia,
				publicador.correo_contacto_emergencia
			])
			await stmt.finalize()
			await db.close()
			return { success: true, lastID: result.lastID }
		} catch (error) {
			console.error('Database insert error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('update-publicador', async (event, publicador) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`update Publicadores set
                nombre = ?,
                apellidos = ?,
                sexo = ?,
                fecha_nacimiento = ?,
                fecha_bautismo = ?,
                grupo = ?,
                id_tipo_publicador = ?,
                id_privilegio = ?,
                sup_grupo = ?,
                ungido = ?,
                calle = ?,
                num = ?,
                colonia = ?,
                telefono_fijo = ?,
                telefono_movil = ?,
                contacto_emergencia = ?,
                tel_contacto_emergencia = ?,
                correo_contacto_emergencia = ?
              where id = ?`)
			const result = await stmt.run([
				publicador.nombre,
				publicador.apellidos,
				publicador.sexo,
				publicador.fecha_nacimiento,
				publicador.fecha_bautismo,
				publicador.grupo,
				publicador.id_tipo_publicador,
				publicador.id_privilegio,
				publicador.sup_grupo,
				publicador.ungido ? 1 : 0,
				publicador.calle,
				publicador.num,
				publicador.colonia,
				publicador.telefono_fijo,
				publicador.telefono_movil,
				publicador.contacto_emergencia,
				publicador.tel_contacto_emergencia,
				publicador.correo_contacto_emergencia,
				publicador.id
			])
			await stmt.finalize()
			await db.close()
			return { success: true, changes: result.changes }
		} catch (error) {
			console.error('Database update error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('delete-publicador', async (event, publicadorId) => {
		try {
			const db = await initDb()
			const stmt = await db.prepare(`
				delete from Informes where id_publicador = ?;
                delete from Publicadores where id = ?`)
			const result = await stmt.run([publicadorId, publicadorId])
			await stmt.finalize()
			await db.close()
			return { success: true, changes: result.changes }
		} catch (error) {
			console.error('Database delete error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('get-S3', async (event, [anio, type]) => {
		// Validar año
		if (!anio || isNaN(anio) || anio < 2020) {
			return { success: false, error: 'Año inválido' }
		}
		try {
			const db = await initDb()
			const rows = await allAsync(
				db,
				`WITH weekdays AS (
					SELECT fecha, asistentes,
						CAST(STRFTIME('%Y', fecha) AS INTEGER) AS year,
						CAST(STRFTIME('%m', fecha) AS INTEGER) AS month,
						CASE WHEN CAST(STRFTIME('%w', fecha) AS INTEGER) IN (0,6) THEN 'FS' ELSE 'ES' END as type,
						CAST(cast(STRFTIME('%d', fecha) as integer) / 7.0 AS INTEGER) + (cast(STRFTIME('%d', fecha) as integer) / 7.0 > CAST(cast(STRFTIME('%d', fecha) as integer) / 7.0 AS INTEGER)) AS week_of_month
					FROM Asistencias
				),
				tb_temporal AS (
					SELECT year, month, type,
						sum(case when week_of_month = 1 then asistentes else null end) as semana_1,
						sum(case when week_of_month = 2 then asistentes else null end) as semana_2,
						sum(case when week_of_month = 3 then asistentes else null end) as semana_3,
						sum(case when week_of_month = 4 then asistentes else null end) as semana_4,
						sum(case when week_of_month = 5 then asistentes else null end) as semana_5
					FROM weekdays
					group by year, month, type
				)
				SELECT (month + 3) % 12 + 1 as id, case when month > 8 then 1 else 0 end + year as anio_servicio, * FROM tb_temporal
				where case when month > 8 then 1 else 0 end + year = ?
				and type = ?
				ORDER BY year, month`,
				[anio, type]
			)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
	ipcMain.handle('get-S88', getS88)
	ipcMain.handle('get-S1', async (event, month) => {
		// Validar mes
		if (!month || !/^\d{4}-\d{2}-\d{2}$/.test(month)) {
			return { success: false, error: 'Mes inválido' }
		}
		try {
			const db = await initDb()

			let rows = await allAsync(
				db,
				`select count(1) as activos
				from Publicadores p
				where (select sum(predico_en_el_mes)
					from Informes i
					where i.id_publicador = p.id
					and date(i.mes) between date(?, '-5 months') and date(?)) > 0
			`,
				[month, month]
			);
			const activos = rows[0]?.activos
			rows = await allAsync(
				db,
				`select
					sum(asistentes) / count(1) as asistencia_promedio
				from Asistencias
				where asistentes is not null
				and cast(STRFTIME('%w', fecha) as integer) IN (0,6)
				and strftime('%Y-%m-01', fecha) = ?
			`,
				[month]
			);
			const asistencia_promedio = rows[0]?.asistencia_promedio
			rows = await allAsync(
				db,
				`with tmpEncabezadosS1 as (
	select row_number() over (order by case id when 2 then 3 when 3 then 2 else id end) as id, titulo
	from (
		select 0 as id, '' as titulo
		union all
		select id, replace(descripcion, 'sor', 'sores') || 'es' as titulo
		from Tipo_Publicador
	) a
)
select * from tmpEncabezadosS1
order by id;`)
			const subsecciones = await allAsync(
				db,
				`select case tp.id when 2 then 3 when 3 then 2 else tp.id end + 1 as id, count(1) as cantidad, sum(horas) as horas, sum(cursos_biblicos) as cursos_biblicos
	from Informes i
	inner join Tipo_publicador tp
		on tp.id = i.id_tipo_publicador
	where i.predico_en_el_mes = 1
	and i.mes = ?
	group by tp.id
	order by case tp.id when 2 then 3 when 3 then 2 else tp.id end`,
				[month]
			)
			rows[0].subsecciones = [
				{
					label: 'Publicadores activos',
					descripcion:
						'Cuente todas las personas de la congregación que informaron alguna participación en el ministerio un mes o más durante los pasados seis meses.',
					valor: activos
				},
				{
					label: 'Promedio de asistencia a las reuniones del fin de semana',
					valor: asistencia_promedio
				}
			]
			let subseccion = subsecciones.find((value, index) => value.id == 2)
			rows[1].subsecciones = [
				{
					label: 'Cantidad de informes',
					valor: subseccion ? subseccion.cantidad : 0
				},
				{
					label: 'Cursos bíblicos',
					valor: subseccion ? subseccion.cursos_biblicos : 0
				}
			]
			subseccion = subsecciones.find((value, index) => value.id == 3)
			rows[2].subsecciones = [
				{
					label: 'Cantidad de informes',
					valor: subseccion ? subseccion.cantidad : 0
				},
				{ label: 'Horas', valor: subseccion ? subseccion.horas : 0 },
				{
					label: 'Cursos bíblicos',
					valor: subseccion ? subseccion.cursos_biblicos : 0
				}
			]
			subseccion = subsecciones.find((value, index) => value.id == 4)
			rows[3].subsecciones = [
				{
					label: 'Cantidad de informes',
					valor: subseccion ? subseccion.cantidad : 0
				},
				{ label: 'Horas', valor: subseccion ? subseccion.horas : 0 },
				{
					label: 'Cursos bíblicos',
					valor: subseccion ? subseccion.cursos_biblicos : 0
				}
			]
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
}
