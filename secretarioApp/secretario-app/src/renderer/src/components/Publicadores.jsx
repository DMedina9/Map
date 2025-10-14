import { useState, useEffect } from 'react'
import ButtonBar from './utils/ButtonBar'
import Alert from './utils/Alert'
import Loading from './utils/Loading' // Importa el componente Loading
import ProgressBar from './utils/ProgressBar'
import DataTable from "./utils/DataTable"
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

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
		setDatos([])
		await cargarPublicadores()
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
			field: 'nombre',
			headerName: 'Nombre',
			//    description: 'This column has a value getter and is not sortable.',
			sortable: true,
			flex: 1,
			minWidth: 350,
			valueGetter: (value, row) => `${row.nombre || ''} ${row.apellidos || ''}`,
		},
		{
			field: 'grupo',
			headerName: 'Grupo',
			type: 'number',
			width: 150,
		}
	];

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
					await deletePublicador(editandoId || editandoGridId)
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
				<DataTable rows={datos} columns={columns} handleEditClick={(id) => iniciarEdicion(datos.find(item => item.id == id))}
					handleDeleteClick={(id) => {
						setEditandoGridId(id)
						setAlertType("confirm")
						setMessage("¿Estás seguro de que deseas eliminar este publicador?")
						setShowAlert(true)
					}} />
			) : (
				<form id="frmEditor" onSubmit={handleSubmit} className="mb-6 space-y-4">
					<div className="p-6 bg-white rounded shadow-md w-full mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<TextField
								label="Nombre"
								name="nombre"
								required
								defaultValue={form.nombre}
								onChange={handleChange}
							/>
							<TextField
								label="Apellidos"
								name="apellidos"
								required
								defaultValue={form.apellidos}
								onChange={handleChange}
							/>
							<TextField
								name="sexo"
								select
								required
								label="Sexo"
								defaultValue={form.sexo}
								helperText="Selecciona el género"
							>
								<MenuItem value="H">Masculino</MenuItem>
								<MenuItem value="M">Femenino</MenuItem>
							</TextField>
							<TextField
								label="Fecha de nacimiento"
								name="fecha_nacimiento"
								defaultValue={form.fecha_nacimiento}
								onChange={handleChange}
								type="date"
							/>
							<TextField
								label="Grupo"
								name="grupo"
								defaultValue={form.grupo}
								onChange={handleChange}
								type="number"
							/>
							<TextField
								label="Fecha de bautismo"
								name="fecha_bautismo"
								defaultValue={form.fecha_bautismo}
								onChange={handleChange}
								type="date"
							/>
							<TextField
								name="id_privilegio"
								select
								label="Privilegio"
								defaultValue={form.id_privilegio}
							>
								<MenuItem value="1">Anciano</MenuItem>
								<MenuItem value="2">Siervo ministerial</MenuItem>
							</TextField>
							<TextField
								name="sup_grupo"
								select
								label="Sup. grupo"
								defaultValue={form.sup_grupo}
							>
								<MenuItem value="1">Superintendente</MenuItem>
								<MenuItem value="2">Auxiliar</MenuItem>
							</TextField>
							<TextField
								name="id_tipo_publicador"
								select
								label="Tipo publicador"
								defaultValue={form.id_tipo_publicador}
							>
								<MenuItem value="1">Publicador</MenuItem>
								<MenuItem value="2">Precursor regular</MenuItem>
								<MenuItem value="3">Precursor auxiliar</MenuItem>
							</TextField>
							<FormGroup>
								<FormControlLabel control={<Checkbox
									name="ungido"
									defaultChecked={form.ungido}
									onChange={handleChange}
								/>} label="Ungido" />
							</FormGroup>
							<TextField
								label="Calle"
								name="calle"
								defaultValue={form.calle}
								onChange={handleChange}
							/>
							<TextField
								label="Número"
								name="num"
								defaultValue={form.num}
								onChange={handleChange}
							/>
							<TextField
								label="Colonia"
								name="colonia"
								defaultValue={form.colonia}
								onChange={handleChange}
							/>
							<TextField
								label="Teléfono fijo"
								name="telefono_fijo"
								defaultValue={form.telefono_fijo}
								onChange={handleChange}
								type="tel"
							/>
							<TextField
								label="Teléfono móvil"
								name="telefono_movil"
								defaultValue={form.telefono_movil}
								onChange={handleChange}
								type="tel"
							/>
							<TextField
								label="Contacto de emergencia"
								name="contacto_emergencia"
								defaultValue={form.contacto_emergencia}
								onChange={handleChange}
							/>
							<TextField
								label="Tel. contacto de emergencia"
								name="tel_contacto_emergencia"
								defaultValue={form.tel_contacto_emergencia}
								onChange={handleChange}
								type="tel"
							/>
							<TextField
								label="Correo contacto de emergencia"
								name="correo_contacto_emergencia"
								defaultValue={form.correo_contacto_emergencia}
								onChange={handleChange}
								type="email"
							/>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
