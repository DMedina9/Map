import { useState, useEffect } from 'react'
import ButtonBar from './utils/ButtonBar'
import Alert from './utils/Alert'
import Loading from './utils/Loading' // Importa el componente Loading
import ProgressBar from './utils/ProgressBar'
import DataTable from "./utils/DataTable"
import TextField from '@mui/material/TextField';

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
	const [editandoId, setEditandoId] = useState(null)
	const [form, setForm] = useState(initialForm)
	const [showAlert, setShowAlert] = useState(false)
	const [loading, setLoading] = useState(true) // Estado para loading
	const [alertType, setAlertType] = useState('confirm')
	const [message, setMessage] = useState('')
	const [progress, setProgress] = useState(0)

	// Carga los datos al montar el componente
	useEffect(() => {
		cargarAsistencias()
		window.api.receive('upload-asistencias-message', ({ progress, message }) => {
			setProgress(progress)
			setMessage(message)
		})
		window.api.receive('upload-asistencias-reply', ({ type, message }) => {
			setAlertType(type || 'success')
			setMessage(message)
			setShowAlert(true)
		})
	}, [])

	// Maneja los cambios en el formulario
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

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

	const columns = [
		//  { field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'fecha',
			headerName: 'Fecha',
			//type: 'date',
			sortable: true,
			flex: 1,
			minWidth: 250,
			valueGetter: (value, row) => row.fecha?.substring(0, 10)
		},
		{
			field: 'tipo_asistencia',
			headerName: 'Tipo',
			width: 200,
		},
		{
			field: 'asistentes',
			headerName: 'Asistencia',
			type: 'number',
			width: 100
		}
	];

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<Loading loading={loading} />
			<ButtonBar
				title="Asistencias"
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => {
					setAlertType("confirm")
					setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")
					setShowAlert(true)
				}}
				onImport={() => window.api.send('upload-asistencias')}
			/>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onConfirm={async () => {
					await deleteAsistencia(editandoId)
					await cargarAsistencias()
					cancelarEdicion()
					setMessage("")
					setShowAlert(false)
				}}
				onCancel={() => {
					setMessage("")
					setShowAlert(false)
					if (alertType == "success")
						cargarAsistencias()
				}}
			/>
			{!editandoId ? (
				<DataTable rows={datos} columns={columns} handleEditClick={(id) => iniciarEdicion(datos.find(item => item.id == id))} />
			) : (
				<form id="frmEditor" onSubmit={handleSubmit} className="mb-6 space-y-4">
					<div className="p-6 bg-white rounded shadow-md w-full mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<TextField
								label="Fecha"
								name="fecha"
								required
								type="date"
								defaultValue={form.fecha}
								onChange={handleChange}
							/>
							<TextField
								label="Asistentes"
								name="asistentes"
								type="number"
								defaultValue={form.asistentes}
								onChange={handleChange}
							/>
							<TextField
								label="Notas"
								name="notas"
								multiline
								defaultValue={form.notas}
								onChange={handleChange}
							/>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
