import { useState, useEffect } from 'react'
import ButtonBar from './utils/ButtonBar'
import { DataField } from './utils/DataFields'
import Alert from './utils/Alert'
import Loading from './utils/Loading' // Importa el componente Loading

const fetchAsistencias = async () => await window.api.invoke('get-asistencias')
const addAsistencia = async (asistencia) => await window.api.invoke('add-asistencia', asistencia)
const updateAsistencia = async (id, asistencia) =>
	await window.api.invoke('update-asistencia', { id, ...asistencia })
const deleteAsistencia = async (id) => await window.api.invoke('delete-asistencia', id)

const initialForm = {
	fecha: '',
	asistentes: ''
}

export default function Asistencias() {
	// Estado para los datos, filtro, edición y formulario
	const [datos, setDatos] = useState([])
	const [filtro, setFiltro] = useState('')
	const [editandoId, setEditandoId] = useState(null)
	const [form, setForm] = useState(initialForm)
	const [showAlert, setShowAlert] = useState(false)
	const [loading, setLoading] = useState(true) // Estado para loading

	// Carga los datos al montar el componente
	useEffect(() => {
		cargarAsistencias()
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
		`${item.fecha.substring(0, 10)} ${item.asistentes}`
			.toLowerCase()
			.includes(filtro.toLowerCase())
	)

	// Iniciar la edición de un registro
	const iniciarEdicion = (item) => {
		setEditandoId(item.id)
		setForm({ ...item })
	}
	// Cargar asistencias desde la base de datos
	const cargarAsistencias = async () => {
		setLoading(true)
		const { success, data } = await fetchAsistencias()
		setDatos(success ? data : [])
		setLoading(false)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (editandoId > 0) {
			await updateAsistencia(editandoId, form)
		} else {
			await addAsistencia(form)
		}
		await cargarAsistencias()
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
				title="Asistencias"
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => setShowAlert(true)}
			/>
			<Alert
				type="confirm"
				message="¿Estás seguro de que deseas eliminar esta asistencia?"
				show={showAlert}
				onConfirm={async () => {
					await deleteAsistencia(editandoId)
					await cargarAsistencias()
					cancelarEdicion()
					setShowAlert(false)
				}}
				onCancel={() => setShowAlert(false)}
			/>
			{!editandoId ? (
				<div>
					<input
						type="search"
						placeholder="Buscar por fecha/cantidad..."
						value={filtro}
						onChange={manejarFiltro}
						className="w-full px-4 py-2 my-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
					<div className="max-h-96 overflow-y-auto rounded-lg border shadow-md">
						<table className="w-full table-auto border-collapse">
							<thead className="sticky top-0 bg-white">
								<tr className="bg-gray-100">
									<th className="px-4 py-2 text-left">Fecha</th>
									<th className="px-4 py-2 text-left">Tipo</th>
									<th className="px-4 py-2 text-left">Asistencia</th>
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
												{item.fecha.substring(0, 10)}
											</td>
											<td className="px-4 py-2">{item.tipo_asistencia}</td>
											<td className="px-4 py-2">{item.asistentes}</td>
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
											No hay asistencias registradas.
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
								desc="Fecha"
								name="fecha"
								form={form}
								handleChange={handleChange}
								type="date"
							/>
							<DataField
								desc="Asistentes"
								name="asistentes"
								form={form}
								handleChange={handleChange}
								type="number"
							/>
							<DataField
								desc="Notas"
								name="notas"
								form={form}
								handleChange={handleChange}
								type="text"
							/>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
