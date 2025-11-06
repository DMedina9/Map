import { useRef } from 'react'
import { getAppSetting } from '../utils/Settings'

import JqxPanel from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox'

/*
	Componente "Portada" que muestra un resumen breve de la congregación
	usando jqWidgets (JqxPanel, JqxListBox, JqxButton).
	- Personaliza los datos de `congregacion` según la información real.
	- Requiere que jqWidgets esté instalado y configurado en el proyecto.
*/

const MONTHS = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre'
]
const Portada = () => {
	const theme = getAppSetting('theme')
	const botonRef = useRef(null)

	const congregacion = {
		nombre: 'Jardines de Andalucía-Guadalupe, N.L. (123729)',
		direccion: `Calle Jardines de la Silla #100
Colonia Las Palmas
67192 Guadalupe (Guadalupe), N.L.`,
		coordenadas: { lat: 25.645051, lon: -100.186652 },
		horarios: {
			domingo: '1:00 pm',
			martes: '7:30 pm'
		},
		miembros: 97,
		telefono: '(81) 1092-0938',
		email: 'cong412123729@jwpub.org',
		mision: 'Proclamar el Reino de Dios y hacer discípulos comprometidos con Cristo.',
		vision: 'Ser una congregación vibrante que refleje el amor de Cristo en todas sus actividades.'
	}

	const resumenItems = [
		`Dirección: ${congregacion.direccion}`,
		`Coordenadas: Lat: ${congregacion.coordenadas.lat}, Lon: ${congregacion.coordenadas.lon}`,
		`Horarios: ${congregacion.horarios.domingo} (Domingo), ${congregacion.horarios.martes} (Martes)`,
		`Miembros: ${congregacion.miembros}`,
		`Teléfono: ${congregacion.telefono}`,
		`Email: ${congregacion.email}`
	]

	const handleVerMas = () => {
		window.location.href = '/reportes/S1'
	}

	const panelStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: 20,
		padding: 20,
		boxSizing: 'border-box'
	}

	const cardStyle = {
		flex: 1,
		minWidth: 250,
		background: '#fff',
		borderRadius: 6,
		padding: 12,
		boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)'
	}

	const titleStyle = {
		margin: 0,
		marginBottom: 8,
		fontSize: 18,
		color: '#333'
	}

	const subtitleStyle = {
		margin: 0,
		marginBottom: 12,
		fontSize: 13,
		color: '#666'
	}

	return (
		<div style={{ padding: 16 }}>
			<JqxPanel width="100%" height={480} theme={theme}>
				<div style={panelStyle}>
					<div style={cardStyle}>
						<h1 style={titleStyle}>{MONTHS[window.mesInforme.getMonth()]} de {window.mesInforme.getFullYear()}</h1>
						<h2 style={titleStyle}>{theme} - {congregacion.nombre}</h2>
						<p style={subtitleStyle}>{congregacion.direccion}</p>

						<JqxListBox
							width="100%"
							height={160}
							source={resumenItems}
							theme={theme}
						/>

						<div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
							<JqxButton
								ref={botonRef}
								theme={theme}
								width={120}
								height={25}
								onClick={handleVerMas}
								template="primary"
							>
								Ver informe
							</JqxButton>

							<JqxButton
								theme={theme}
								width={120}
								height={25}
								onClick={() => window.open('/catalogos/informes', '_self')}
							>
								Informes
							</JqxButton>
						</div>
					</div>

					<div style={cardStyle}>
						<strong style={{ color: '#333' }}>Accesos rápidos</strong>
						<ul style={{ marginTop: 8, color: '#555' }}>
							<li>
								<a href="https://www.jw.org/es/" target="_blank" rel="noreferrer">
									Sitio oficial
								</a>
							</li>
							<li>
								<a
									href="https://stream.jw.org/home"
									target="_blank"
									rel="noreferrer"
								>
									JW Stream
								</a>
							</li>
							<li>
								<a href="https://hub.jw.org/" target="_blank" rel="noreferrer">
									JW Hub
								</a>
							</li>
						</ul>
					</div>
				</div>
			</JqxPanel>
		</div>
	)
}

export default Portada
