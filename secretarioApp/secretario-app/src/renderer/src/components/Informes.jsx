import { useState, useEffect } from 'react'
import ButtonBar from './utils/ButtonBar'
import { DataField, DataFieldSelect } from './utils/DataFields'
import Alert from './utils/Alert'
import Loading from './utils/Loading' // Importa el componente Loading
import ProgressBar from './utils/ProgressBar'

const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const fetchInformes = async () => await window.api.invoke('get-informes', ['', '', ''])
const addInforme = async (informe) => await window.api.invoke('add-informe', informe)
const updateInforme = async (id, informe) =>
	await window.api.invoke('update-informe', { id, ...informe })
const deleteInforme = async (id) => await window.api.invoke('delete-informe', id)

const initialForm = {
	id_publicador: '',
	mes: '',
	mes_enviado: '',
	participo_en_el_mes: '',
	horas: '',
	notas: ''
}

export default function Informes() {
	// Estado para los datos, filtro, edición y formulario
	const [datos, setDatos] = useState([])
	const [publicadores, setPublicadores] = useState([])
	const [filtro, setFiltro] = useState('')
	const [editandoId, setEditandoId] = useState(null)
	const [form, setForm] = useState(initialForm)
	const [showAlert, setShowAlert] = useState(false)
	const [loading, setLoading] = useState(true) // Estado para loading
	const [alertType, setAlertType] = useState('confirm')
	const [message, setMessage] = useState('')
	const [progress, setProgress] = useState(0)

	// Carga los datos al montar el componente
	useEffect(() => {
		const cargarTodo = async () => {
			setLoading(true)
			await cargarInformes(false)
			await cargarPublicadores()
			setLoading(false)
		}
		cargarTodo()
		window.api.receive('upload-informes-message', ({ progress, message }) => {
			setProgress(progress)
			setMessage(message)
		})
		window.api.receive('upload-informes-reply', ({ type, message }) => {
			setAlertType(type || 'success')
			setMessage(message)
			setShowAlert(true)
		})
	}, [])
	// Maneja los cambios en el formulario
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	// Maneja el cambio del filtro de busqueda
	const manejarFiltro = (e) => {
		setFiltro(e.target.value)
	}

	// Filtra los datos para mostrar
	const datosFiltrados = datos.filter((item) =>
		`${item.publicador} ${item.mes.substring(0, 7)} ${item.Estatus}`
			.toLowerCase()
			.includes(filtro.toLowerCase())
	)

	// Iniciar la edición de un registro
	const iniciarEdicion = (item) => {
		setEditandoId(item.id)
		setForm({ ...item })
	}
	// Cargar informes desde la base de datos
	const cargarInformes = async (showLoading = true) => {
		if (showLoading)
			setLoading(true)
		const { success, data } = await fetchInformes()
		setDatos(success ? data : [])
		if (showLoading)
			setLoading(false)
	}
	// Cargar publicadores desde la base de datos
	const cargarPublicadores = async () => {
		const { success, data } = await fetchPublicadores()
		setPublicadores(success ? data : [])
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (editandoId > 0) {
			await updateInforme(editandoId, form)
		} else {
			await addInforme(form)
		}
		await cargarInformes()
		cancelarEdicion()
	}
	// Cancela la edición
	const cancelarEdicion = () => {
		setEditandoId(null)
		setForm(initialForm)
	}

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<Loading loading={loading} />
			<ButtonBar
				title="Informes"
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => {
					setAlertType("confirm")
					setMessage("¿Estás seguro de que deseas eliminar este informe?")
					setShowAlert(true)
				}}
				onImport={() => window.api.send('upload-informes')}
			/>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onConfirm={async () => {
					await deleteInforme(editandoId)
					await cargarInformes()
					cancelarEdicion()
					setMessage("")
					setShowAlert(false)
				}}
				onCancel={() => {
					setMessage("")
					setShowAlert(false)
					if (alertType == "success")
						cargarInformes(true)
				}}
			/>
			{!editandoId ? (
				<div>
					<input
						type="search"
						placeholder="Buscar por nombre..."
						value={filtro}
						onChange={manejarFiltro}
						className="w-full px-4 py-2 my-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
					<div className="max-h-96 overflow-y-auto rounded-lg border shadow-md">
						<table className="w-full table-auto border-collapse">
							<thead className="sticky top-0 bg-white">
								<tr className="bg-gray-100">
									<th className="px-4 py-2 text-left">Publicador</th>
									<th className="px-4 py-2 text-left">Mes</th>
									<th className="px-4 py-2 text-left">Predicó</th>
									<th className="px-4 py-2 text-left">Estatus</th>
									<th className="px-4 py-2 text-left">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{datosFiltrados.length > 0 ? (
									datosFiltrados.map((item) => (
										<tr
											key={item.id}
											className={
												'border-b' +
												(item.id === editandoId
													? ' bg-blue-400 text-white'
													: '')
											}
										>
											<td className="px-4 py-2">{item.publicador}</td>
											<td className="px-4 py-2">
												{item.mes.substring(0, 7)}
											</td>
											<td className="px-4 py-2">
												{item.predico_en_el_mes ? 'Sí' : 'No'}
											</td>
											<td className="px-4 py-2">{item.Estatus}</td>
											<td className="px-4 py-2 space-x-2">
												<button
													className="bg-green-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
													onClick={() => iniciarEdicion(item)}
												>
													Editar
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="3" className="text-center py-4 text-gray-500">
											No hay informes registrados.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<form id="frmEditor" onSubmit={handleSubmit} className="mb-6 space-y-4">
					<div className="p-6 bg-white rounded shadow-md w-full mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<DataFieldSelect
								desc="Publicador"
								name="id_publicador"
								form={form}
								handleChange={handleChange}
								required={true}
							>
								<option value="">Selecciona</option>
								{publicadores.map((pub) => (
									<option key={pub.id} value={pub.id}>
										{pub.nombre} {pub.apellidos}
									</option>
								))}
							</DataFieldSelect>
							<DataField
								desc="Mes"
								name="mes"
								form={form}
								handleChange={handleChange}
								type="date"
							/>
							<DataField
								desc="Enviado"
								name="mes_enviado"
								form={form}
								handleChange={handleChange}
								type="date"
							/>
							<DataField
								desc="Predicó en el mes"
								name="predico_en_el_mes"
								form={form}
								handleChange={handleChange}
								type="checkbox"
							/>
							<DataField
								desc="Cursos bíblicos"
								name="cursos_biblicos"
								form={form}
								handleChange={handleChange}
								type="number"
							/>
							<DataFieldSelect
								desc="Tipo publicador"
								name="id_tipo_publicador"
								form={form}
								handleChange={handleChange}
							>
								<option value="">Selecciona</option>
								<option value="1">Publicador</option>
								<option value="2">Precursor regular</option>
								<option value="3">Precursor auxiliar</option>
							</DataFieldSelect>
							<DataField
								desc="Horas"
								name="horas"
								form={form}
								handleChange={handleChange}
								type="number"
							/>
							<DataField
								desc="Horas Servicio Sagrado"
								name="horas_SS"
								form={form}
								handleChange={handleChange}
								type="number"
							/>
							<DataField
								desc="Notas"
								name="notas"
								form={form}
								handleChange={handleChange}
							/>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
