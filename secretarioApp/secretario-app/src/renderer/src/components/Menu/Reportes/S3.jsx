import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

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
	const initialYear = (window.mesInforme.getMonth() > 8 ? 1 : 0) + window.mesInforme.getFullYear()
	const [year, setYear] = useState(initialYear)

	// Opciones del DropDownList
	const yearOptions = [initialYear - 1, initialYear].map((y) => ({
		label: `${y - 1} - ${y}`,
		value: y
	}))

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-4 border-b">
				<h1 className="text-2xl font-bold mb-4 text-gray-800 col-span-3">
					Informe de asistencia a las reuniones (S-3)
				</h1>
				<div>
					<label className="block font-semibold mb-1 text-gray-700">
						Año de servicio
					</label>
					<JqxDropDownList
						width={'100%'}
						height={35}
						source={yearOptions}
						displayMember="label"
						valueMember="value"
						value={year}
						onChange={(e) => setYear(e.args.item.value)}
						theme="material"
						autoDropDownHeight={true}
					/>
				</div>
			</div>

			<h2 className="text-xl font-bold mb-4 text-gray-800">Reunión de entre semana</h2>
			<ReportTable year={year} type="ES" />

			<h2 className="text-xl font-bold mb-4 text-gray-800">Reunión del fin de semana</h2>
			<ReportTable year={year} type="FS" />
		</div>
	)
}

function ReportTable({ year, type }) {
	const [datos, setDatos] = useState([])
	const gridRef = useRef(null)

	useEffect(() => {
		cargarS3(year, type)
	}, [year, type])

	const cargarS3 = async (year, type) => {
		const { success, data } = await fetchS3(year, type)
		setDatos(success ? data : [])
	}

	// Fuente de datos para el grid
	const source = {
		localdata: MONTHS.map((month, index) => {
			const item = datos.find((d) => d.id === index + 1)
			return {
				mes: month,
				semana_1: item?.semana_1 ?? '',
				semana_2: item?.semana_2 ?? '',
				semana_3: item?.semana_3 ?? '',
				semana_4: item?.semana_4 ?? '',
				semana_5: item?.semana_5 ?? ''
			}
		}),
		datatype: 'array'
	}

	const dataAdapter = new window.jqx.dataAdapter(source)

	const columns = [
		{ text: `Año de servicio (${year})`, datafield: 'mes', width: '25%', align: 'center', cellsalign: 'center' },
		{ text: 'Primera Semana', datafield: 'semana_1', width: '15%', align: 'center', cellsalign: 'center' },
		{ text: 'Segunda Semana', datafield: 'semana_2', width: '15%', align: 'center', cellsalign: 'center' },
		{ text: 'Tercera Semana', datafield: 'semana_3', width: '15%', align: 'center', cellsalign: 'center' },
		{ text: 'Cuarta Semana', datafield: 'semana_4', width: '15%', align: 'center', cellsalign: 'center' },
		{ text: 'Quinta Semana', datafield: 'semana_5', width: '15%', align: 'center', cellsalign: 'center' }
	]

	return (
		<div className="m-4">
			<JqxGrid
				ref={gridRef}
				width={'100%'}
				autoheight
				source={dataAdapter}
				columns={columns}
				theme="material"
				altrows
				columnsresize
			/>
		</div>
	)
}

ReportTable.propTypes = {
	year: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['ES', 'FS']).isRequired
}
