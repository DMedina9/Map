import { useState, useEffect } from 'react'
import { DataTableEdit } from '../utils/DataTable'
import Alert from '../utils/Alert'
import ProgressBar from '../utils/ProgressBar'
import dayjs from 'dayjs'

// --- API invocaciones
const fetchAsistencias = async () => await window.api.invoke('get-asistencias')
const addAsistencia = async (asistencia) => await window.api.invoke('add-asistencia', asistencia)
const updateAsistencia = async (id, asistencia) =>
	await window.api.invoke('update-asistencia', { id, ...asistencia })
const deleteAsistencia = async (id) => await window.api.invoke('delete-asistencia', id)

// --- Página principal
export default function Asistencias() {
	const [datos, setDatos] = useState([])
	const [showAlert, setShowAlert] = useState(false)
	const [loading, setLoading] = useState(true)
	const [alertType, setAlertType] = useState('confirm')
	const [message, setMessage] = useState('')
	const [progress, setProgress] = useState(0)

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

	const cargarAsistencias = async () => {
		setLoading(true)
		const { success, data } = await fetchAsistencias()
		setDatos(success ? data : [])
		setLoading(false)
	}

	const handleSaveClick = async (row) => {
		console.log(row)
		if (!row) return
		row.fecha = dayjs(row.fecha).format('YYYY-MM-DD')
		const result = row.isNew ? await addAsistencia(row) : await updateAsistencia(row.id, row)

		if (result.success) {
			await cargarAsistencias()
			return datos
		} else {
			setMessage(result.error)
			setAlertType('error')
			setShowAlert(true)
		}
	}

	const columns = [
		{
			field: 'fecha',
			headerName: 'Fecha',
			sortable: true,
			minWidth: 200,
			type: 'date',
			valueGetter: (value) => (value && dayjs(value).isValid ? dayjs(value).$d : null),
			editable: true
		},
		{ field: 'tipo_asistencia', headerName: 'Tipo', width: 200, editable: false },
		{
			field: 'asistentes',
			headerName: 'Asistencia',
			type: 'number',
			width: 150,
			editable: true
		},
		{ field: 'notas', headerName: 'Notas', flex: 1, editable: true }
	]

	return (
		<div className="m-4 p-6 bg-white rounded shadow-xl w-full mx-auto">
			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onCancel={() => {
					setMessage('')
					setShowAlert(false)
					if (alertType === 'success') cargarAsistencias()
				}}
			/>
			<DataTableEdit
				rows={datos}
				columns={columns}
				loading={loading}
				handleSaveClick={handleSaveClick}
				handleDeleteClick={async (id) => {
					await deleteAsistencia(id)
					await cargarAsistencias()
				}}
				handleImportClick={() => window.api.send('upload-asistencias')}
			/>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
		</div>
	)
}
