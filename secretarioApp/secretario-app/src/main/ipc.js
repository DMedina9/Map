import { ipcMain } from 'electron'
import { initDb, allAsync } from './database/db.mjs'

export default function initIPC() {
	// IPC test
	ipcMain.on('ping', () => console.log('pong'))
	ipcMain.handle('get-asistencias', async (event) => {
		try {
			const db = await initDb()
			const rows = await allAsync(db, `select *, case when cast(strftime('%w', fecha) as integer) in (6,0) then 'Fin de semana' else 'Entresemana' end as tipo_asistencia from Asistencias order by fecha desc`)
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
			const stmt = await db.prepare(`insert or ignore into Asistencias (fecha, asistentes) values (?, ?)`)
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
			const stmt = await db.prepare(`update Asistencias set fecha = ?, asistentes = ? where id = ?`)
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
	ipcMain.handle('get-informes', async (event) => {
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
			order by i.mes desc, p.apellidos, p.nombre`
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
	ipcMain.handle('get-S3', async (event, anio) => {
		console.log('Año recibido en IPC:', anio)
		// Validar año
		if (!anio || isNaN(anio) || anio < 2020) {
			return { success: false, error: 'Año inválido' }
		}
		try {
			const db = await initDb()
			const rows = await allAsync(db, `WITH weekdays AS (
					SELECT fecha, asistentes,
						CAST(STRFTIME('%Y', fecha) AS INTEGER) AS year,
						CAST(STRFTIME('%m', fecha) AS INTEGER) AS month,
						CAST(STRFTIME('%w', fecha) AS INTEGER) AS day_of_week,
						CASE STRFTIME('%m', fecha)
							WHEN '01' THEN 'Enero'
							WHEN '02' THEN 'Febrero'
							WHEN '03' THEN 'Marzo'
							WHEN '04' THEN 'Abril'
							WHEN '05' THEN 'Mayo'
							WHEN '06' THEN 'Junio'
							WHEN '07' THEN 'Julio'
							WHEN '08' THEN 'Agosto'
							WHEN '09' THEN 'Septiembre'
							WHEN '10' THEN 'Octubre'
							WHEN '11' THEN 'Noviembre'
							WHEN '12' THEN 'Diciembre'
						END AS month_name
					FROM Asistencias
					WHERE CAST(STRFTIME('%w', fecha) AS INTEGER) NOT IN (0,6)
				),
				weekdays_numbered AS (
					SELECT *, cast(STRFTIME('%W', fecha) as integer) - cast(STRFTIME('%W', date(STRFTIME('%Y-%m-01', fecha))) as integer) + 1 AS week_of_month
					FROM weekdays
				),
				weekends AS (
					SELECT fecha, asistentes,
						CAST(STRFTIME('%Y', fecha) AS INTEGER) AS year,
						CAST(STRFTIME('%m', fecha) AS INTEGER) AS month,
						CAST(STRFTIME('%w', fecha) AS INTEGER) AS day_of_week,
						CASE STRFTIME('%m', fecha)
							WHEN '01' THEN 'Enero'
							WHEN '02' THEN 'Febrero'
							WHEN '03' THEN 'Marzo'
							WHEN '04' THEN 'Abril'
							WHEN '05' THEN 'Mayo'
							WHEN '06' THEN 'Junio'
							WHEN '07' THEN 'Julio'
							WHEN '08' THEN 'Agosto'
							WHEN '09' THEN 'Septiembre'
							WHEN '10' THEN 'Octubre'
							WHEN '11' THEN 'Noviembre'
							WHEN '12' THEN 'Diciembre'
						END AS month_name
					FROM Asistencias
					WHERE CAST(STRFTIME('%w', fecha) AS INTEGER) IN (0,6)
				),
				weekends_numbered AS (
					SELECT *, cast(STRFTIME('%W', fecha) as integer) - cast(STRFTIME('%W', date(STRFTIME('%Y-%m-01', fecha))) as integer) + 1 AS week_of_month
					FROM weekends
				),
				tb_temporal AS (
					SELECT es.year, es.month, es.month_name || ' ' || es.year as mes,
						sum(case when es.week_of_month = 1 then es.asistentes else null end) as es_semana_1,
						sum(case when es.week_of_month = 2 then es.asistentes else null end) as es_semana_2,
						sum(case when es.week_of_month = 3 then es.asistentes else null end) as es_semana_3,
						sum(case when es.week_of_month = 4 then es.asistentes else null end) as es_semana_4,
						sum(case when es.week_of_month = 5 then es.asistentes else null end) as es_semana_5,
						sum(case when fs.week_of_month = 1 then fs.asistentes else null end) as fs_semana_1,
						sum(case when fs.week_of_month = 2 then fs.asistentes else null end) as fs_semana_2,
						sum(case when fs.week_of_month = 3 then fs.asistentes else null end) as fs_semana_3,
						sum(case when fs.week_of_month = 4 then fs.asistentes else null end) as fs_semana_4,
						sum(case when fs.week_of_month = 5 then fs.asistentes else null end) as fs_semana_5
					FROM weekdays_numbered es
					inner join weekends_numbered fs
						on es.year = fs.year
						and es.month = fs.month
						and es.week_of_month = fs.week_of_month
					group by es.year, es.month
				)
				SELECT row_number() over(order by year, month) as id, case when month > 8 then 1 else 0 end + year as anio_servicio, * FROM tb_temporal
				where case when month > 8 then 1 else 0 end + year = ${anio}
				ORDER BY year, month`)
			await db.close()
			return { success: true, data: rows }
		} catch (error) {
			console.error('Database query error:', error)
			return { success: false, error: error.message }
		}
	})
}
