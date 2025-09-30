import { ipcMain } from 'electron'
import { initDb, allAsync } from './database/db.mjs'

export default function initIPC() {
	// IPC test
	ipcMain.on('ping', () => console.log('pong'))
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
}
