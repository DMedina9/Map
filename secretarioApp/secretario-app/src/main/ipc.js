import { ipcMain } from 'electron'
import { initDb, allAsync } from './database/db.mjs'

export default function initIPC() {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('get-publicadores', async (event) => {
      try {
          const db = await initDb();
          const rows = await allAsync(db, `select
              p.*,
              case sup_grupo when 1 then 'Sup' when 2 then 'Aux' else null end as sup_grupo_desc,
              pr.descripcion as privilegio,
              tp.descripcion as tipo_publicador
            from Publicadores p
            left join Privilegio pr
              on pr.id = p.id_privilegio
            left join Tipo_Publicador tp
              on tp.id = p.id_tipo_publicador
            order by grupo, apellidos, nombre`);
          await db.close();
          return { success: true, data: rows };
      } catch (error) {
          console.error("Database query error:", error);
          return { success: false, error: error.message };
      }
  });
  ipcMain.handle('get-privilegios', async (event) => {
      try {
          const db = await initDb();
          const rows = await allAsync(db, `select * from Privilegio order by id`);
          await db.close();
          return { success: true, data: rows };
      } catch (error) {
          console.error("Database query error:", error);
          return { success: false, error: error.message };
      }
  });
  ipcMain.handle('get-tipos-publicador', async (event) => {
      try {
          const db = await initDb();
          const rows = await allAsync(db, `select * from Tipo_Publicador order by id`);
          await db.close();
          return { success: true, data: rows };
      } catch (error) {
          console.error("Database query error:", error);
          return { success: false, error: error.message };
      }
  });
  ipcMain.handle('add-publicador', async (event, publicador) => {
      try {
          const db = await initDb();
          const stmt = await db.prepare(`insert into Publicadores
              (nombre, apellidos, grupo, id_tipo_publicador, id_privilegio, sup_grupo)
              values (?, ?, ?, ?, ?, ?)`);
          const result = await stmt.run([
              publicador.nombre,
              publicador.apellidos,
              publicador.grupo,
              publicador.id_tipo_publicador,
              publicador.id_privilegio,
              publicador.sup_grupo
          ]);
          await stmt.finalize();
          await db.close();
          return { success: true, lastID: result.lastID };
      }
      catch (error) {
          console.error("Database insert error:", error);
          return { success: false, error: error.message };
      }
  });
  ipcMain.handle('update-publicador', async (event, publicador) => {
      try {
          const db = await initDb();
          const stmt = await db.prepare(`update Publicadores set
              nombre = ?,
              apellidos = ?,
              grupo = ?,
              id_tipo_publicador = ?,
              id_privilegio = ?,
              sup_grupo = ?
              where id = ?`);
          const result = await stmt.run([
              publicador.nombre,
              publicador.apellidos,
              publicador.grupo,
              publicador.id_tipo_publicador,
              publicador.id_privilegio,
              publicador.sup_grupo,
              publicador.id
          ]);
          await stmt.finalize();
          await db.close();
          return { success: true, changes: result.changes };
      }
      catch (error) {
          console.error("Database update error:", error);
          return { success: false, error: error.message };
      }
  });
  ipcMain.handle('delete-publicador', async (event, publicadorId) => {
      try {
          const db = await initDb();
          const stmt = await db.prepare(`delete from Publicadores where id = ?`);
          const result = await stmt.run([publicadorId]);
          await stmt.finalize();
          await db.close();
          return { success: true, changes: result.changes };
      }
      catch (error) {
          console.error("Database delete error:", error);
          return { success: false, error: error.message };
      }
  });
  
}