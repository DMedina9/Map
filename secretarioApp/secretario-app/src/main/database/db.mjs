// database/db.js
import sqlite3 from 'sqlite3'

const initDb = async () => {
	const db = new sqlite3.Database('./secretario.db')

	// TABLA Tipo de Privilegio
	await db.exec(`
	CREATE TABLE IF NOT EXISTS Privilegio (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		descripcion TEXT UNIQUE
	);`)

	// TABLA Tipo de Publicador
	await db.exec(`
	CREATE TABLE IF NOT EXISTS Tipo_Publicador (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		descripcion TEXT UNIQUE
	);`)

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
		correo_contacto_emergencia TEXT,
		UNIQUE(nombre, apellidos)
	);`)

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
		horas_SS INTEGER,
		UNIQUE(id_publicador, mes)
	);`)

	// TABLA ASISTENCIAS
	await db.exec(`
	CREATE TABLE IF NOT EXISTS Asistencias (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		fecha TEXT UNIQUE,
		asistentes INTEGER,
		notas TEXT
	);`)

	// TABLA CONFIGURACION
	await db.exec(`
	CREATE TABLE IF NOT EXISTS Configuracion (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		clave TEXT UNIQUE,
		valor TEXT
	);`)

	return db
}
// Función para ejecutar consultas SQL y devolver resultados como una promesa
function allAsync(db, sql, params = []) {
	return new Promise((resolve, reject) => {
		db.all(sql, params, function (err, rows) {
			if (err) {
				reject(err)
			} else {
				resolve(rows)
			}
		})
	})
}
// Función para convertir métodos de sqlite3 a Promesas
function runAsync(db, sql, params = []) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) {
				reject(err)
			} else {
				resolve(this.lastID) // Obtiene el ID de la fila insertada
			}
		})
	})
}

export { initDb, allAsync, runAsync }
