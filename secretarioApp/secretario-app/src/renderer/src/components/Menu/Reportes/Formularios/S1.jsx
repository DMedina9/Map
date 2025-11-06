import { useState, useEffect, useRef } from 'react'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxExpander from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxexpander'
import JqxPanel from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel'

const fetchS1 = async (month) => await window.api.invoke('get-S1', month)

if (Date.prototype.addMonths === undefined) {
	Date.prototype.addMonths = function (months) {
		this.setMonth(this.getMonth() + months)
		return this
	}
}

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

export default function S1() {
	const month =
		window.mesInforme.getFullYear() +
		'-' +
		(window.mesInforme.getMonth() + 1).toString().padStart(2, '0') +
		'-01'
	const [datos, setDatos] = useState([])
	const panelRef = useRef(null)

	useEffect(() => {
		cargarDatos(month)
	}, [month])

	const cargarDatos = async (month) => {
		const { success, data } = await fetchS1(month)
		setDatos(success ? data : [])
	}

	return (
		<div className="w-full m-4 mx-auto font-sans text-sm leading-relaxed bg-gray-100 rounded shadow">
			<JqxExpander width="100%" showArrow={false} toggleMode="none" theme="material">
				{/* Header */}
				<div className="bg-black text-white text-lg font-semibold px-6 py-4 rounded-t">
					Informes de la congregación
				</div>

				{/* Contenido */}
				<div className="p-4">
					<div className="text-gray-700 text-base font-normal py-2">
						PREDICACIÓN Y ASISTENCIA A LAS REUNIONES <span className="hidden">(S-1)</span>
					</div>
					<div className="text-gray-600 text-2xl font-normal py-2">
						{MONTHS[window.mesInforme.getMonth()]} de {window.mesInforme.getFullYear()}
					</div>
					<div className="italic text-gray-500 py-2 flex items-center gap-2">
						Introduzca el informe y haga clic en{' '}
						<JqxButton
							theme="material"
							width={100}
							height={28}
							onClick={() => window.api.send('send-S1')}
						>
							Enviar
						</JqxButton>
						.
					</div>

					<JqxPanel
						ref={panelRef}
						width="100%"
						height={600}
						autoUpdate="true"
						theme="material"
						className="mt-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
							{datos.map((sec) => (
								<div
									key={sec.titulo}
									className="grid grid-cols-1 gap-4 border border-gray-400 rounded bg-white"
								>
									{sec.titulo && (
										<div className="pl-2 font-semibold text-lg pt-2">
											{sec.titulo}
										</div>
									)}
									{sec.subsecciones &&
										sec.subsecciones.map((sub, index) => (
											<div key={index} className="mb-4 px-2">
												<div className="font-semibold">{sub.label}</div>
												{sub.descripcion && (
													<div className="text-gray-500 py-2">{sub.descripcion}</div>
												)}
												{/* En lugar de JqxInput */}
												<div
													className="jqx-widget jqx-input jqx-widget-content jqx-input-content jqx-widget-material border border-gray-300 rounded text-center text-lg py-1 w-24 mx-2 bg-gray-50 select-none"
													style={{ userSelect: 'none' }}
												>
													{sub.valor || 0}
												</div>
											</div>
										))}
								</div>
							))}
						</div>
					</JqxPanel>
				</div>
			</JqxExpander>
		</div>
	)
}
