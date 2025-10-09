import { useState, useEffect } from 'react'

const fetchS1 = async (month) => await window.api.invoke('get-S1', month)

if (Date.prototype.addMonths == undefined) {
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
	useEffect(() => {
		cargarDatos(month)
	}, [])
	const cargarDatos = async (month) => {
		const { success, data } = await fetchS1(month)
		setDatos(success ? data : [])
	}
	return (
		<div className="w-full m-4 mx-auto font-sans text-sm leading-relaxed bg-gray-100 rounded shadow">
			<div className="bg-black text-white text-lg font-semibold px-6 py-4 rounded-t">
				Informes de la congregación
			</div>
			<div className="bg-gray-100 text-gray-700 text-base font-normal px-6 py-2">
				PREDICACIÓN Y ASISTENCIA A LAS REUNIONES <span className="hidden">(S-1)</span>
			</div>
			<div className="bg-gray-100 text-gray-600 text-2xl font-normal px-6 py-2">
				{MONTHS[window.mesInforme.getMonth()]} de {window.mesInforme.getFullYear()}
			</div>
			<div className="px-6 py-2 italic text-gray-500">
				Introduzca el informe y haga clic en{' '}
				<button className="not-italic font-semibold"
					onClick={() => window.api.send("send-S1")}
				>Enviar</button>.
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{datos.map((sec, i) => (
					<div
						key={sec.titulo}
						className="grid grid-cols-1 gap-4 m-6 border border-gray-400"
					>
						{sec.titulo && (
							<div className="pl-2 font-semibold text-lg pt-2">{sec.titulo}</div>
						)}
						{sec.subsecciones &&
							sec.subsecciones.map((sub) => (
								<div key={sub.label} className="mb-4">
									<div className="pl-2 font-semibold">{sub.label}</div>
									{sub.descripcion && (
										<div className="text-gray-500 pl-2 py-2">
											{sub.descripcion}
										</div>
									)}
									<div className="bg-white border border-gray-400 text-center font-normal text-lg px-4 py-2 rounded w-24 mx-2 inline-block">
										{sub.valor}
									</div>
								</div>
							))}
					</div>
				))}
			</div>
		</div>
	)
}
