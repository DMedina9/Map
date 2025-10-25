import { useEffect, useState } from 'react'
import Alert from './../../utils/Alert'
import PropTypes from 'prop-types'
import ProgressBar from '../../utils/ProgressBar'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import dayjs from 'dayjs'

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
		// Cargar publicadores desde la base de datos
		const cargarPublicadores = async () => {
			const { success, data } = await fetchPublicadores()
			setPublicadores(success ? data : [])
		}
		cargarPublicadores()
	}, [])

	useEffect(() => {
		// Cargar informes desde la base de datos
		const cargarInformes = async () => {
			if (year && pubId) {
				const { success, data } = await fetchInformes(year, pubId)
				setInformes(success ? data : [])
			} else setInformes([])
		}
		cargarInformes()
	}, [year, pubId])

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
			<div className="grid grid-cols-4 gap-4 mb-2">
				<Autocomplete
					className="col-span-4 flex flex-row gap-4 items-center relative"
					options={publicadores}
					getOptionLabel={(option) => `${option.nombre} ${option.apellidos}`}
					id="id_publicador"
					openOnFocus
					value={pub}
					onChange={(e, pub) => {
						setPub(pub)
						setPubId(pub.id || null)
					}}
					renderInput={(params) => (
						<TextField {...params} label="Nombre:" variant="standard" />
					)}
				/>
				<DatosPublicador pubId={pubId} publicadores={publicadores} />
			</div>

			{/* Privilegios */}
			<PrivilegiosPublicador pubId={pubId} publicadores={publicadores} />

			{/* Tabla de registros mensuales */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-400 text-xs">
					<thead>
						<tr className="bg-gray-200 text-center">
							<th className="border px-2 py-1 w-40">
								Año de servicio
								<br />
								<select
									onChange={(e) => setYear(Number(e.target.value))}
									value={year}
								>
									{[
										initialYear - 2,
										initialYear - 1,
										initialYear,
										initialYear + 1
									].map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
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
										<input
											type="checkbox"
											checked={informe && informe.predico_en_el_mes}
											readOnly
										/>
									</td>
									<td className="border px-2 py-1">
										{informe && informe.cursos_biblicos}
									</td>
									<td className="border px-2 py-1">
										<input
											type="checkbox"
											checked={
												informe &&
												informe.tipo_publicador === 'Precursor auxiliar'
											}
											readOnly
										/>
									</td>
									<td className="border px-2 py-1">{informe && informe.horas}</td>
									<td className="border px-2 py-1 text-left">
										{informe && informe.notas}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			{/* Total de horas */}
			<div className="flex justify-end mt-2">
				<span className="font-semibold">
					Total de horas: {informes.reduce((acc, r) => acc + r.horas, 0)}
				</span>
			</div>
			<div className="flex justify-end mt-2">
				{year && pubId != 0 && (
					<button
						className="bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600"
						onClick={() => window.api.send('save-S-21', [year, pubId])}
					>
						Exportar a PDF
					</button>
				)}
				{year && (
					<button
						className="bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600"
						onClick={() => window.api.send('save-S-21', [year, null])}
					>
						Exportar todos
					</button>
				)}
			</div>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
		</div>
	)
}

function DatosPublicador({ pubId, publicadores }) {
	const pub = publicadores.find((item) => item.id === pubId)
	if (pub)
		return (
			<>
				<div className="col-span-2 flex flex-row gap-2 items-center">
					<span className="font-semibold">Fecha de nacimiento:</span>
					<span className="border-b border-gray-400 px-2">
						{pub.fecha_nacimiento && dayjs(pub.fecha_nacimiento).format('DD/MM/YYYY')}
					</span>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.sexo == 'H'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Hombre</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.sexo == 'M'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Mujer</label>
				</div>
				<div className="col-span-2 flex flex-row gap-2 items-center">
					<span className="font-semibold">Fecha de bautismo:</span>
					<span className="border-b border-gray-400 px-2">
						{pub.fecha_bautismo && dayjs(pub.fecha_bautismo).format('DD/MM/YYYY')}
					</span>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={!pub.ungido}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Otras ovejas</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.ungido}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Ungido</label>
				</div>
			</>
		)
}

DatosPublicador.propTypes = {
	pubId: PropTypes.number.isRequired,
	publicadores: PropTypes.array.isRequired
}

function PrivilegiosPublicador({ pubId, publicadores }) {
	const pub = publicadores.find((item) => item.id === pubId)
	if (pub)
		return (
			<div className="grid grid-cols-5 gap-2 mb-4">
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.privilegio === 'Anciano'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Anciano</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.privilegio === 'Siervo ministerial'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Siervo ministerial</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.tipo_publicador === 'Precursor regular'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Precursor regular</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.tipo_publicador === 'Precursor especial'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Precursor especial</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input
						type="checkbox"
						checked={pub.tipo_publicador === 'Misionero que sirve en el campo'}
						readOnly
						className="accent-blue-600"
					/>
					<label className="font-semibold">Misionero que sirve en el campo</label>
				</div>
			</div>
		)
}

PrivilegiosPublicador.propTypes = {
	pubId: PropTypes.number.isRequired,
	publicadores: PropTypes.array.isRequired
}

export default S21
