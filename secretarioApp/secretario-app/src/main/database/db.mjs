// database/db.js
import sqlite3 from 'sqlite3';

const initDb = async () => {
  const db = new sqlite3.Database('./secretario.db');

  // TABLA Tipo de Privilegio
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Privilegio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT UNIQUE
    );
  `);

  // TABLA Tipo de Publicador
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Tipo_Publicador (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT UNIQUE
    );
  `);

  // TABLA PUBLICADORES
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Publicadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      apellidos TEXT,
      fecha_nacimiento TEXT,
      fecha_bautismo TEXT,
      grupo INTEGER,
      sup_grupo INTEGER,
      sexo TEXT,
      id_privilegio INTEGER,
      id_tipo_publicador INTEGER,
      ungido INTEGER,
      calle TEXT,
      num TEXT,
      colonia TEXT,
      telefono_fijo INTEGER,
      telefono_movil INTEGER,
      contacto_emergencia TEXT,
      tel_contacto_emergencia INTEGER,
      correo_contacto_emergencia TEXT
    );
  `);

  // TABLA INFORMES
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Informes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_publicador INTEGER,
      mes TEXT,
      mes_enviado TEXT,
      predico_en_el_mes INTEGER,
      cursos_biblicos INTEGER,
      id_tipo_publicador INTEGER,
      horas INTEGER,
      notas TEXT,
      horas_SS INTEGER
    );
  `);

  // TABLA ASISTENCIAS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Asistencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT,
      asistentes INTEGER
    );
  `);

/*
  // TABLA INFORME_CONGREGACION_S1
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Informe_Congregacion_S1 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mes TEXT,
      publicadores_activos INTEGER,
      promedio_asistencia REAL,
      cantidad_informes_publicadores INTEGER,
      publicaciones_impresas_electronicas INTEGER,
      presentaciones_videos INTEGER,
      horas INTEGER,
      revisitas INTEGER,
      cursos_biblicos INTEGER,
      tipo_publicador TEXT
    );
  `);

  // TABLA REGISTRO_ASISTENCIA_S88
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Registro_Asistencia_S88 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT,
      mes TEXT,
      reunion_tipo TEXT,
      semana1 INTEGER,
      semana2 INTEGER,
      semana3 INTEGER,
      semana4 INTEGER,
      semana5 INTEGER,
      numero_reuniones INTEGER,
      asistencia_total INTEGER,
      promedio_asistencia_semanal REAL
    );
  `);

  // TABLA ASISTENCIAS_S3
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Asistencias_S3 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mes TEXT,
      reunion_entresemana_sem1 INTEGER,
      reunion_entresemana_sem2 INTEGER,
      reunion_entresemana_sem3 INTEGER,
      reunion_entresemana_sem4 INTEGER,
      reunion_entresemana_sem5 INTEGER,
      reunion_findesemana_sem1 INTEGER,
      reunion_findesemana_sem2 INTEGER,
      reunion_findesemana_sem3 INTEGER,
      reunion_findesemana_sem4 INTEGER,
      reunion_findesemana_sem5 INTEGER
    );
  `);
*/
  return db;
};
// Función para ejecutar consultas SQL y devolver resultados como una promesa
function allAsync (db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
// Función para convertir métodos de sqlite3 a Promesas
function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // Obtiene el ID de la fila insertada
      }
    });
  });
}

export { initDb, allAsync, runAsync };