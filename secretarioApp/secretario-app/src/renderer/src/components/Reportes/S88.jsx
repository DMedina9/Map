// S88.jsx
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import PropTypes from 'prop-types'
import Alert from '../utils/Alert'

const fetchS88 = async (year, type) => await window.api.invoke('get-S88', [year, type])

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

export default function S88() {
	const initialYear = (new Date().getMonth() > 8 ? 1 : 0) + new Date().getFullYear()
	const [year, setYear] = useState(initialYear)
	const [congregation, setCongregation] = useState('Jardines de Andalucía')
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('success')
	const [message, setMessage] = useState('')

	useEffect(() => {
		window.api.receive('save-S-88-reply', ({ type, message }) => {
			setAlertType(type || 'success')
			setMessage(message)
			setShowAlert(true)
		})
	}, [])
	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-4 border-b">
				<h1 className="text-2xl font-bold mb-4 text-gray-800 col-span-3">
					Registro de Asistencia a las Reuniones de Congregación (S-88)
				</h1>
				<Alert
					type={alertType}
					message={message}
					show={showAlert}
					onCancel={() => {
						setMessage('')
						setShowAlert(false)
					}}
				/>
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
			<div className="flex justify-between mb-4">
				<div>
					<label className="font-semibold">Congregación: </label>
					<input
						className="border px-2 py-1 rounded"
						value={congregation}
						onChange={(e) => setCongregation(e.target.value)}
					/>
				</div>
			</div>
			<h2 className="text-xl font-bold mb-4 text-gray-800">Reunión de entre semana</h2>
			<div className="flex justify-between gap-4 m-4">
				<ReportTable year={year - 1} type="ES" />
				<ReportTable year={year} type="ES" />
			</div>
			<h2 className="text-xl font-bold mb-4 text-gray-800">Reunión del fin de semana</h2>
			<div className="flex justify-between gap-4 m-4">
				<ReportTable year={year - 1} type="FS" />
				<ReportTable year={year} type="FS" />
			</div>
			<div className="flex justify-end mt-2">
				<button
					className="bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600"
					onClick={() => window.api.send('save-S-88', year)}
				>
					Exportar a PDF
				</button>
			</div>
			<div className="mt-6 text-sm text-gray-500">
				<p>Este registro es para uso interno de la congregación.</p>
			</div>
		</div>
	)
}

function ReportTable({ year, type }) {
	const [datos, setDatos] = useState([])
	useEffect(() => {
		cargarS88(year, type)
	}, [year, type])
	const cargarS88 = async (year, type) => {
		const { success, data } = await fetchS88(year, type)
		setDatos(success ? data : [])
	}
	// Función para calcular el promedio de un arreglo
	const calcularPromedio = (item) =>
		item.num_reuniones ? item.asistencia / item.num_reuniones : 0

	// Función para calcular el promedio de los promedios
	const promedioDePromedios = (matriz) => {
		if (!Array.isArray(matriz) || matriz.length === 0) {
			return 0 // O manejar el caso según sea necesario
		}

		// Calcular el promedio de cada subarreglo
		const promedios = matriz.map((item) => {
			return calcularPromedio(item)
		})

		// Calcular el promedio de los promedios
		return promedios.reduce((a, b) => a + b, 0) / promedios.length
	}

	const average = promedioDePromedios(datos)

	return (
		<table className="w-full border-collapse">
			<thead>
				<tr className="bg-gray-200">
					<th className="border px-2 py-1">
						Año de servicio
						<br />
						{year}
					</th>
					<th className="border px-2 py-1">
						Número de
						<br />
						reuniones
					</th>
					<th className="border px-2 py-1">
						Asistencia
						<br />
						total
					</th>
					<th className="border px-2 py-1">
						Promedio de
						<br />
						asistencia
						<br />
						semanal
					</th>
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
								<td className="border px-2 py-1 text-right"></td>
							</tr>
						)
					return (
						<tr key={index} className="hover:bg-gray-50">
							<td className="border px-2 py-1 font-semibold">{month}</td>
							<td className="border px-2 py-1 text-center">
								{item.num_reuniones || ''}
							</td>
							<td className="border px-2 py-1 text-center">
								{item.asistencia || ''}
							</td>
							<td className="border px-2 py-1 text-right">
								{(item.asistencia &&
									item.num_reuniones &&
									(item.asistencia / item.num_reuniones).toFixed(2)) ||
									''}
							</td>
						</tr>
					)
				})}
				<tr className="bg-gray-100 font-bold">
					<td className="border px-2 py-1" colSpan={3}>
						Promedio de asistencia mensual
					</td>
					<td className="border px-2 py-1 text-right">{average.toFixed(2)}</td>
				</tr>
			</tbody>
		</table>
	)
}

ReportTable.propTypes = {
	year: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['ES', 'FS']).isRequired
}
