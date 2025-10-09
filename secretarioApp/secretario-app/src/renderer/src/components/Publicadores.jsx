import { useState, useEffect } from 'react'
import ButtonBar from './utils/ButtonBar'
import { DataField, DataFieldSelect } from './utils/DataFields'
import Alert from './utils/Alert'
import Loading from './utils/Loading' // Importa el componente Loading
import ProgressBar from './utils/ProgressBar'

const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const addPublicador = async (publicador) => await window.api.invoke('add-publicador', publicador)
const updatePublicador = async (id, publicador) =>
	await window.api.invoke('update-publicador', { id, ...publicador })
const deletePublicador = async (id) => await window.api.invoke('delete-publicador', id)

const initialForm = {
	nombre: '',
	grupo: '',
	id_tipo_publicador: '',
	id_privilegio: '',
	sup_grupo: false
}

export default function Publicadores() {
	// Estado para los datos, filtro, edición y formulario
	const [datos, setDatos] = useState([])
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
		cargarPublicadores()
		window.api.receive('upload-publicadores-message', ({ progress, message }) => {
			setProgress(progress)
			setMessage(message)
		})
		window.api.receive('upload-publicadores-reply', ({ type, message }) => {
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
		`${item.nombre} ${item.apellidos}`.toLowerCase().includes(filtro.toLowerCase())
	)

	// Iniciar la edición de un registro
	const iniciarEdicion = (item) => {
		setEditandoId(item.id)
		setForm({ ...item })
	}
	// Cargar publicadores desde la base de datos
	const cargarPublicadores = async () => {
		setLoading(true)
		const { success, data } = await fetchPublicadores()
		setDatos(success ? data : [])
		setLoading(false)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (editandoId > 0) {
			await updatePublicador(editandoId, form)
		} else {
			await addPublicador(form)
		}
		await cargarPublicadores()
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
				title="Publicadores"
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => {
					setAlertType("confirm")
					setMessage("¿Estás seguro de que deseas eliminar este publicador?")
					setShowAlert(true)
				}}
				onImport={() => window.api.send('upload-publicadores')}
			/>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onConfirm={async () => {
					await deletePublicador(editandoId)
					await cargarPublicadores()
					cancelarEdicion()
					setMessage("")
					setShowAlert(false)
				}}
				onCancel={() => {
					setMessage("")
					setShowAlert(false)
					if (alertType == "success")
						cargarPublicadores()
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
									<th className="px-4 py-2 text-left">Nombre</th>
									<th className="px-4 py-2 text-left">Grupo</th>
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
											<td className="px-4 py-2">
												{item.nombre} {item.apellidos}
											</td>
											<td className="px-4 py-2">{item.grupo}</td>
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
											No hay publicadores registrados.
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
							<DataField
								desc="Nombre"
								name="nombre"
								form={form}
								handleChange={handleChange}
								required={true}
							/>
							<DataField
								desc="Apellidos"
								name="apellidos"
								form={form}
								handleChange={handleChange}
								required={true}
							/>
							<DataFieldSelect
								desc="Sexo"
								name="sexo"
								form={form}
								handleChange={handleChange}
								required={true}
							>
								<option value="">Selecciona</option>
								<option value="H">Masculino</option>
								<option value="M">Femenino</option>
							</DataFieldSelect>
							<DataField
								desc="Fecha de nacimiento"
								name="fecha_nacimiento"
								form={form}
								handleChange={handleChange}
								type="date"
							/>
							<DataField
								desc="Grupo"
								name="grupo"
								form={form}
								handleChange={handleChange}
								type="number"
							/>
							<DataField
								desc="Fecha de bautismo"
								name="fecha_bautismo"
								form={form}
								handleChange={handleChange}
								type="date"
							/>
							<DataFieldSelect
								desc="Privilegio"
								name="id_privilegio"
								form={form}
								handleChange={handleChange}
							>
								<option value="">Selecciona</option>
								<option value="1">Anciano</option>
								<option value="2">Siervo ministerial</option>
							</DataFieldSelect>
							<DataFieldSelect
								desc="Sup. grupo"
								name="sup_grupo"
								form={form}
								handleChange={handleChange}
							>
								<option value="">Selecciona</option>
								<option value="1">Superintendente</option>
								<option value="2">Auxiliar</option>
							</DataFieldSelect>
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
								desc="Ungido"
								name="ungido"
								form={form}
								handleChange={handleChange}
								type="checkbox"
							/>
							<DataField
								desc="Calle"
								name="calle"
								form={form}
								handleChange={handleChange}
							/>
							<DataField
								desc="Núm."
								name="num"
								form={form}
								handleChange={handleChange}
							/>
							<DataField
								desc="Colonia"
								name="colonia"
								form={form}
								handleChange={handleChange}
							/>
							<DataField
								desc="Teléfono fijo"
								name="telefono_fijo"
								form={form}
								handleChange={handleChange}
								type="tel"
							/>
							<DataField
								desc="Teléfono móvil"
								name="telefono_movil"
								form={form}
								handleChange={handleChange}
								type="tel"
							/>
							<DataField
								desc="Contacto de emergencia"
								name="contacto_emergencia"
								form={form}
								handleChange={handleChange}
							/>
							<DataField
								desc="Tel. contacto de emergencia"
								name="tel_contacto_emergencia"
								form={form}
								handleChange={handleChange}
								type="tel"
							/>
							<DataField
								desc="Correo contacto de emergencia"
								name="correo_contacto_emergencia"
								form={form}
								handleChange={handleChange}
								type="email"
							/>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
