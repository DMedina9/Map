import { useState, useEffect, useCallback /*, useRef*/ } from 'react'
import { DEFAULTS, themes, getAppSettings, setAppSettings } from '../../utils/Settings'

import PropTypes from 'prop-types'
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox'
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxToggleButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtogglebutton'
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput'

export default function Herramientas({ onChange }) {
	const [settings, setSettings] = useState(DEFAULTS)
	//const skipEvent = useRef(false) // 🔸 Evita bucles infinitos

	// Carga inicial desde localStorage (solo una vez)
	useEffect(() => {
		const appSettings = getAppSettings()
		if (appSettings) setSettings((prev) => ({ ...prev, ...appSettings }))
	}, [])

	const persist = useCallback(
		(next) => {
			setSettings(next)
			setAppSettings(next)
			if (typeof onChange === 'function') onChange(next)
		},
		[onChange]
	)

	// Handlers seguros: verifican si realmente cambió algo antes de persistir
	const handleToggle = (key) => (event) => {
		if (!event || !event.args) return
		const value = !!event.args.checked
		if (settings[key] === value) return // 🔸 evita cambio redundante
		persist({ ...settings, [key]: value })
	}

	const handleSelect = (key) => (event) => {
		if (!event || !event.args?.item) return
		const value = event.args.item.value
		if (settings[key] === value) return // 🔸 evita cambio redundante
		persist({ ...settings, [key]: value })
	}

	const handleReset = () => {
		persist(DEFAULTS)
	}

	const handleSave = () => {
		setAppSettings(settings)
		if (typeof onChange === 'function') onChange(settings)
	}

	return (
		<div style={{ padding: 12, maxWidth: 520 }}>
			<h3>Configuración de la aplicación</h3>

			<div style={{ marginBottom: 12 }}>
				<label style={{ display: 'block', marginBottom: 6 }}>Tema</label>
				<JqxDropDownList
					theme={settings.theme}
					width={'100%'}
					source={themes}
					displayMember={'label'}
					valueMember={'value'}
					selectedIndex={themes.findIndex((t) => t.value === settings.theme)}
					onSelect={handleSelect('theme')}
				/>
			</div>

			<div style={{ marginBottom: 12 }}>
				<label style={{ display: 'block', marginBottom: 6 }}>Idioma</label>
				<JqxInput
					theme={settings.theme}
					width={'100%'}
					value={settings.S21Folder}
					onSelect={handleSelect('S21Folder')}
				/>
			</div>

			<div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
				<div>
					<JqxCheckBox
						theme={settings.theme}
						checked={settings.mostrarTooltips}
						onChange={handleToggle('mostrarTooltips')}
					>
						Mostrar tooltips
					</JqxCheckBox>
				</div>

				<div>
					<JqxCheckBox
						theme={settings.theme}
						checked={settings.actualizacionAutomatica}
						onChange={handleToggle('actualizacionAutomatica')}
					>
						Actualización automática
					</JqxCheckBox>
				</div>

				<div>
					<JqxToggleButton
						theme={settings.theme}
						toggled={settings.modoOscuro}
						width={140}
						height={30}
						onClick={() => persist({ ...settings, modoOscuro: !settings.modoOscuro })}
					>
						{settings.modoOscuro ? 'Modo oscuro' : 'Modo claro'}
					</JqxToggleButton>
				</div>
			</div>

			<div style={{ display: 'flex', gap: 8 }}>
				<JqxButton width={100} height={32} onClick={handleSave} theme={settings.theme}>
					Guardar
				</JqxButton>
				<JqxButton width={100} height={32} onClick={handleReset} theme={settings.theme}>
					Restablecer
				</JqxButton>
			</div>
		</div>
	)
}

Herramientas.propTypes = {
	onChange: PropTypes.func
}
