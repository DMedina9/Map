import { useState, useEffect } from 'react'
import ButtonBar from '../utils/ButtonBar'
import Alert from '../utils/Alert'
import Loading from '../utils/Loading' // Importa el componente Loading
import ProgressBar from '../utils/ProgressBar'
import { DataTableEdit } from '../utils/DataTable'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

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
	const [editandoGridId, setEditandoGridId] = useState(null)
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
	const handleSaveClick = (id) => {
		const row = datos.find((item) => item.id == id)
		const saveData = async () => {
			if (row.id > 0) {
				await updateAsistencia(row.id, row)
			} else {
				await addAsistencia(row)
			}
			await cargarAsistencias()
		}
		saveData()
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
			minWidth: 250,
			valueGetter: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : value)
		},
		{
			field: 'tipo_asistencia',
			headerName: 'Tipo',
			width: 200
		},
		{
			field: 'asistentes',
			headerName: 'Asistencia',
			type: 'number',
			width: 100
		},
		{
			field: 'notas',
			headerName: 'Notas',
			flex: 1
		}
	]

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<Loading loading={loading} />
			<ButtonBar
				title="Asistencias"
				loading={loading}
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => {
					setAlertType('confirm')
					setMessage('¿Estás seguro de que deseas eliminar esta asistencia?')
					setShowAlert(true)
				}}
				onImport={() => window.api.send('upload-asistencias')}
			/>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
			
			
				<DataTableEdit
					rows={datos}
					columns={columns}
					handleSaveClick={handleSaveClick}
					handleDeleteClick={(id) => {
						;(async () => {
							await deleteAsistencia(id)
							await cargarAsistencias()
						})()
					}}
				/>
			
		</div>
	)
}
