import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import PropTypes from 'prop-types'
const MONTHS = [
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto'
]
const fetchS3 = async (year, type) => await window.api.invoke('get-S3', [year, type])

export default function S3() {
	// Estado para los datos, filtro, edición y formulario
	const initialYear = (new Date().getMonth() > 8 ? 1 : 0) + new Date().getFullYear()
	const [year, setYear] = useState(initialYear)

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-4 border-b">
					<h1 className="text-2xl font-bold mb-4 text-gray-800 col-span-3">
						Informe de asistencia a las reuniones (S-3)
					</h1>
					<TextField
						label="Año de servicio"
						name="year"
						select
						defaultValue={year}
						onChange={(e) => setYear(Number(e.target.value))}
					>
						{[initialYear - 2, initialYear - 1, initialYear, initialYear + 1].map(
							(year) => (
								<MenuItem key={year} value={year}>
									{year - 1} - {year}
								</MenuItem>
							)
						)}
					</TextField>
				</div>
				<h2 className="text-xl font-bold mb-4 text-gray-800">Reunión de entre semana</h2>
				<ReportTable year={year} type="ES" />
				<h2 className="text-xl font-bold mb-4 text-gray-800">Reunión del fin de semana</h2>
				<ReportTable year={year} type="FS" />
			</div>
		</div>
	)
}
function ReportTable({ year, type }) {
	const [datos, setDatos] = useState([])
	useEffect(() => {
		cargarS3(year, type)
	}, [year, type])
	const cargarS3 = async (year, type) => {
		const { success, data } = await fetchS3(year, type)
		setDatos(success ? data : [])
	}
	// Función para calcular el promedio de un arreglo
	return (
		<table className="w-full border-collapse m-4">
			<thead>
				<tr className="bg-gray-200">
					<th className="border px-2 py-1">
						Año de servicio
						<br />
						{year}
					</th>
					<th className="border px-2 py-1">Primera Semana</th>
					<th className="border px-2 py-1">Segunda Semana</th>
					<th className="border px-2 py-1">Tercera Semana</th>
					<th className="border px-2 py-1">Cuarta Semana</th>
					<th className="border px-2 py-1">Quinta Semana</th>
				</tr>
			</thead>
			<tbody>
				{MONTHS.map((month, index) => {
					const item = datos.find((item) => item.id === index + 1)
					if (!item)
						return (
							<tr key={index} className="hover:bg-gray-50">
								<td className="border px-2 py-1 font-semibold">{month}</td>
								<td className="border px-2 py-1 text-center"></td>
								<td className="border px-2 py-1 text-center"></td>
								<td className="border px-2 py-1 text-center"></td>
								<td className="border px-2 py-1 text-center"></td>
								<td className="border px-2 py-1 text-center"></td>
							</tr>
						)
					return (
						<tr key={index} className="hover:bg-gray-50">
							<td className="border px-2 py-1 font-semibold">{month}</td>
							<td className="border px-2 py-1 text-center">{item.semana_1}</td>
							<td className="border px-2 py-1 text-center">{item.semana_2}</td>
							<td className="border px-2 py-1 text-center">{item.semana_3}</td>
							<td className="border px-2 py-1 text-center">{item.semana_4}</td>
							<td className="border px-2 py-1 text-center">{item.semana_5}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

ReportTable.propTypes = {
	year: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['ES', 'FS']).isRequired
}
