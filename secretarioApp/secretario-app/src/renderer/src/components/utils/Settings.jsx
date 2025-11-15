export const DEFAULTS = {
	theme: 'material',
	S21Folder: '',
	mostrarTooltips: true,
	modoOscuro: false,
	actualizacionAutomatica: true
}

export const themes = [
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
export function getAppSetting(setting) {
	const settings = getAppSettings()
	if (settings && settings[setting]) return settings[setting]
	return null
}
export function setAppSettings(next) {
	try {
		localStorage.setItem('appSettings', JSON.stringify(next))
	} catch (e) {
		console.error(e)
	}
}
