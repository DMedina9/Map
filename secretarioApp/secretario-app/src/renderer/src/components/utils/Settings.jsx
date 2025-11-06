export const DEFAULTS = {
	tema: 'light',
	S21Folder: '',
	mostrarTooltips: true,
	modoOscuro: false,
	actualizacionAutomatica: true
}

export const temas = [
	{ label: 'Claro', value: 'light' },
	{ label: 'Oscuro', value: 'dark' },
	{ label: 'Azul', value: 'material' }
]

export function getAppSettings() {
	try {
		const raw = localStorage.getItem('appSettings')
		if (raw) {
			return JSON.parse(raw)
		}
	} catch (e) {
		console.error('Error al leer configuración local:', e)
	}
}
export function setAppSettings(next) {
	try {
		localStorage.setItem('appSettings', JSON.stringify(next))
	} catch (e) {
		console.error(e)
	}
}
