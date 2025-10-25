import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'secretario.db')

export default function resetDb() {
	// 1. Verificar si el archivo existe
	if (fs.existsSync(dbPath)) {
		console.log('Eliminando la base de datos existente...')
		// 2. Eliminar el archivo
		fs.unlinkSync(dbPath)
		console.log('Base de datos eliminada.')
	} else {
		console.log('No se encontró una base de datos existente. No es necesario eliminar nada.')
	}
}
