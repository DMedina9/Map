import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput'
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'
import Alert from '../../utils/Alert'

// --- API invocaciones
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
	const initialYear = (window.mesInforme.getMonth() > 8 ? 1 : 0) + window.mesInforme.getFullYear()
	const [year, setYear] = useState(initialYear)
	const [congregation, setCongregation] = useState('Jardines de Andalucía')
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('success')
	const [message, setMessage] = useState('')
	const yearOptions = [initialYear - 2, initialYear - 1, initialYear, initialYear + 1].map(
		(y) => ({ label: `${y - 1} - ${y}`, value: y })
	)

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

				<div className="flex flex-col">
					<JqxDropDownList
						width={180}
						height={35}
						selectedIndex={yearOptions.indexOf(year)}
						source={yearOptions}
						placeHolder="Año de servicio"
						displayMember="label"
						valueMember="value"
						theme="material"
						onSelect={(e) => setYear(e.args.item.value)}
					/>
				</div>
			</div>

			<div className="flex justify-between mb-4 items-center">
				<div>
					<label className="font-semibold mr-2">Congregación:</label>
					<JqxInput
						width={250}
						height={30}
						value={congregation}
						theme="material"
						onChange={(e) => setCongregation(e.args.value)}
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
				<JqxButton
					width={150}
					height={25}
					template="success"
					theme="material"
					onClick={() => window.api.send('save-S-88', year)}
				>
					Exportar a PDF
				</JqxButton>
			</div>

			<div className="mt-6 text-sm text-gray-500">
				<p>Este registro es para uso interno de la congregación.</p>
			</div>
		</div>
	)
}

// -------------------------------------------------------------
// Componente ReportTable
// -------------------------------------------------------------

function ReportTable({ year, type }) {
	const [datos, setDatos] = useState([])
	const gridRef = useRef(null)
	useEffect(() => {
		cargarS88(year, type)
	}, [year, type])

	const cargarS88 = async (year, type) => {
		const { success, data } = await fetchS88(year, type)
		setDatos(success ? data : [])
	}

	const calcularPromedio = (item) =>
		item.num_reuniones ? item.asistencia / item.num_reuniones : 0

	const promedioDePromedios = (matriz) => {
		if (!Array.isArray(matriz) || matriz.length === 0) return 0
		const promedios = matriz.map((item) => calcularPromedio(item))
		return promedios.reduce((a, b) => a + b, 0) / promedios.length
	}

	const average = promedioDePromedios(datos)

	const source = {
		localdata: MONTHS.map((month, i) => {
			const item = datos.find((d) => d.id === i + 1)
			return {
				mes: month,
				num_reuniones: item?.num_reuniones || '',
				asistencia: item?.asistencia || '',
				promedio:
					item?.asistencia && item?.num_reuniones
						? (item.asistencia / item.num_reuniones).toFixed(2)
						: ''
			}
		}),
		datatype: 'array'
	}

	const dataAdapter = new window.jqx.dataAdapter(source)

	const columns = [
		{ text: `Año de servicio ${year}`, datafield: 'mes', width: '35%' },
		{ text: 'Número de reuniones', datafield: 'num_reuniones', width: '20%', cellsalign: 'center' },
		{ text: 'Asistencia total', datafield: 'asistencia', width: '20%', cellsalign: 'center' },
		{ text: 'Promedio semanal', datafield: 'promedio', width: '25%', cellsalign: 'right' }
	]

	return (
		<div style={{ width: '48%' }}>
			<JqxGrid
				ref={gridRef}
				theme="material"
				width="100%"
				source={dataAdapter}
				columns={columns}
				autoheight={true}
				altrows={true}
				columnsresize={true}
				enabletooltips={true}
			/>
			<div className="mt-2 text-right font-semibold text-gray-700">
				Promedio mensual: {average.toFixed(2)}
			</div>
		</div>
	)
}

ReportTable.propTypes = {
	year: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['ES', 'FS']).isRequired
}
