// --- Carga dinámica del tema jqWidgets según la configuración ---
import { getAppSetting } from '../components/utils/Settings'

// --- Estilos base de jqWidgets ---
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'

// Obtiene el tema guardado (por ejemplo: 'light', 'dark', 'material', etc.)
const theme = getAppSetting('theme')

// Intenta importar el tema correspondiente en tiempo de ejecución
try {
	await import(`./${theme}`)
	console.log(`Tema jqWidgets cargado: ${theme}`)
} catch (err) {
	console.warn(`⚠️ No se encontró el tema jqx.${theme}.css, usando base.`, err)
}
