import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import Alert from '../../../utils/Alert'
import ProgressBar from '../../../utils/ProgressBar'

// Controles jqWidgets
import JqxComboBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcombobox'
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const fetchInformes = async (anio_servicio, id_publicador) =>
	await window.api.invoke('get-informes', [anio_servicio, id_publicador, ''])

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

const S21 = () => {
	const initialYear = (new Date().getMonth() > 8 ? 1 : 0) + new Date().getFullYear()
	const [pubId, setPubId] = useState(0)
	const [publicadores, setPublicadores] = useState([])
	const [informes, setInformes] = useState([])
	const [year, setYear] = useState(initialYear)
	const [pub, setPub] = useState(null)
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('success')
	const [message, setMessage] = useState('')
	const [progress, setProgress] = useState(0)
	const comboRef = useRef(null)

	useEffect(() => {
		window.api.receive('save-S-21-message', ({ progress, message }) => {
			setProgress(progress)
			setMessage(message)
		})
		window.api.receive('save-S-21-reply', ({ type, message }) => {
			setAlertType(type || 'success')
			setMessage(message)
			setShowAlert(true)
		})
		const cargarPublicadores = async () => {
			const { success, data } = await fetchPublicadores()
			setPublicadores(success ? data : [])
		}
		cargarPublicadores()
	}, [])

	useEffect(() => {
		const cargarInformes = async () => {
			if (year && pubId) {
				const { success, data } = await fetchInformes(year, pubId)
				setInformes(success ? data : [])
			} else setInformes([])
		}
		cargarInformes()
	}, [year, pubId])

	// Fuente de datos para jqxComboBox
	const source = publicadores.map((p) => ({
		id: p.id,
		label: `${p.nombre} ${p.apellidos}`
	}))

	const yearOptions = [initialYear - 1, initialYear].map((y) => ({
		label: y.toString(),
		value: y
	}))

	return (
		<div className="max-w-5xl mx-auto bg-white shadow-2xl border border-gray-300 rounded-lg p-8 mt-10">
			{/* Encabezado */}
			<div className="flex flex-col items-center mb-6">
				<h1 className="text-2xl font-bold tracking-wide mb-1 text-center">
					REGISTRO DE PUBLICADOR DE LA CONGREGACIÓN
				</h1>
			</div>

			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onCancel={() => {
					setMessage('')
					setProgress(0)
					setShowAlert(false)
				}}
			/>

			<div className="grid grid-cols-4 gap-4 mb-2 items-center">
				<div className="col-span-4 flex flex-col">
					<JqxComboBox
						ref={comboRef}
						theme="material"
						width={'100%'}
						height={30}
						placeHolder="Buscar publicador..."
						source={source}
						autoComplete
						searchMode="containsignorecase"
						selectedIndex={-1}
						valueMember="id"
						displayMember="label"
						onSelect={(e) => {
							const selected = e.args?.item
							if (selected) {
								const p = publicadores.find((x) => x.id === selected.value)
								setPub(p || null)
								setPubId(p?.id || 0)
							}
						}}
					/>
				</div>

				<DatosPublicador pub={pub} />
			</div>

			<PrivilegiosPublicador pub={pub} />

			{/* Tabla de registros mensuales */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-400 text-xs">
					<thead>
						<tr className="bg-gray-200 text-center">
							<th className="border px-2 py-1 w-40">
								Año de servicio
								<br />
								<div className="flex justify-center">
									<JqxDropDownList
										width="auto"
										height={25}
										theme="material"
										autoDropDownHeight={true}
										source={yearOptions}
										selectedIndex={yearOptions.findIndex(
											(y) => y.value === year
										)}
										onChange={(e) => setYear(e.args.item.value)}
									/>
								</div>
							</th>
							<th className="border px-2 py-1 w-20">
								Participación en el ministerio
							</th>
							<th className="border px-2 py-1 w-20">Cursos bíblicos</th>
							<th className="border px-2 py-1 w-20">Precursor auxiliar</th>
							<th className="border px-2 py-1 w-20">Horas</th>
							<th className="border px-2 py-1">Notas</th>
						</tr>
					</thead>
					<tbody>
						{MONTHS.map((month, index) => {
							const informe = informes.find((item) => item.iNumMes === index + 1)
							return (
								<tr key={index} className="text-center">
									<td className="border px-2 py-1 font-semibold text-left">
										{month}
									</td>
									<td className="border px-2 py-1">
										<JqxCheckBox
											className="flex justify-center"
											theme="material"
											checked={informe?.predico_en_el_mes == 1 || false}
											disabled
											boxSize={16}
										/>
									</td>
									<td className="border px-2 py-1">{informe?.cursos_biblicos}</td>
									<td className="border px-2 py-1">
										<JqxCheckBox
											className="flex justify-center"
											theme="material"
											checked={
												informe?.tipo_publicador === 'Precursor auxiliar'
											}
											disabled
											boxSize={16}
										/>
									</td>
									<td className="border px-2 py-1">{informe?.horas}</td>
									<td className="border px-2 py-1 text-left">{informe?.notas}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			{/* Total de horas */}
			<div className="flex justify-end mt-2">
				<span className="font-semibold">
					Total de horas: {informes.reduce((acc, r) => acc + (r.horas || 0), 0)}
				</span>
			</div>

			{/* Botones */}
			<div className="flex justify-end mt-2 gap-2">
				{year && pubId !== 0 && (
					<JqxButton
						width={150}
						height={25}
						theme="material"
						onClick={() => window.api.send('save-S-21', [year, pubId])}
					>
						Exportar a PDF
					</JqxButton>
				)}
				{year && (
					<JqxButton
						width={150}
						height={25}
						theme="material"
						onClick={() => window.api.send('save-S-21', [year, null])}
					>
						Exportar todos
					</JqxButton>
				)}
			</div>

			<ProgressBar show={!showAlert} message={message} progress={progress} />
		</div>
	)
}

function DatosPublicador({ pub }) {
	if (!pub) return null
	return (
		<>
			<div className="col-span-4 flex mb-2">
				<span className="font-semibold">Nombre:</span>
				<span className="border-b border-gray-400 px-2">
					{pub.nombre} {pub.apellidos}
				</span>
			</div>
			<div className="col-span-2 flex flex-row gap-2 items-center">
				<span className="font-semibold">Fecha de nacimiento:</span>
				<span className="border-b border-gray-400 px-2">
					{pub.fecha_nacimiento && dayjs(pub.fecha_nacimiento).format('DD/MM/YYYY')}
				</span>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox theme="material" checked={pub.sexo === 'H'} disabled />
				<label className="font-semibold">Hombre</label>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox theme="material" checked={pub.sexo === 'M'} disabled />
				<label className="font-semibold">Mujer</label>
			</div>
			<div className="col-span-2 flex flex-row gap-2 items-center">
				<span className="font-semibold">Fecha de bautismo:</span>
				<span className="border-b border-gray-400 px-2">
					{pub.fecha_bautismo && dayjs(pub.fecha_bautismo).format('DD/MM/YYYY')}
				</span>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox theme="material" checked={!pub.ungido} disabled />
				<label className="font-semibold">Otras ovejas</label>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox theme="material" checked={pub.ungido} disabled />
				<label className="font-semibold">Ungido</label>
			</div>
		</>
	)
}

DatosPublicador.propTypes = {
	pub: PropTypes.object
}

function PrivilegiosPublicador({ pub }) {
	if (!pub) return null
	return (
		<div className="grid grid-cols-5 gap-2 mb-4">
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox theme="material" checked={pub.privilegio === 'Anciano'} disabled />
				<label className="font-semibold">Anciano</label>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox
					theme="material"
					checked={pub.privilegio === 'Siervo ministerial'}
					disabled
				/>
				<label className="font-semibold">Siervo ministerial</label>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox
					theme="material"
					checked={pub.tipo_publicador === 'Precursor regular'}
					disabled
				/>
				<label className="font-semibold">Precursor regular</label>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox
					theme="material"
					checked={pub.tipo_publicador === 'Precursor especial'}
					disabled
				/>
				<label className="font-semibold">Precursor especial</label>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<JqxCheckBox
					theme="material"
					checked={pub.tipo_publicador === 'Misionero que sirve en el campo'}
					disabled
				/>
				<label className="font-semibold">Misionero que sirve en el campo</label>
			</div>
		</div>
	)
}

PrivilegiosPublicador.propTypes = {
	pub: PropTypes.object
}

export default S21
