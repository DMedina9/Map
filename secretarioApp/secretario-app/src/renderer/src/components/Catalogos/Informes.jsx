import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import ButtonBar from '../utils/ButtonBar'
import Alert from '../utils/Alert'
import Loading from '../utils/Loading' // Importa el componente Loading
import ProgressBar from '../utils/ProgressBar'
import { DataTable } from '../utils/DataTable'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

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
	id_tipo_publicador: '',
	participo_en_el_mes: '',
	horas: '',
	notas: ''
}
export default function Informes() {
	// Estado para los datos, filtro, edición y formulario
	const [datos, setDatos] = useState([])
	const [publicadores, setPublicadores] = useState([])
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

	// Iniciar la edición de un registro
	const iniciarEdicion = (item) => {
		setEditandoId(item.id)
		setForm({ ...item })
	}
	// Cargar informes desde la base de datos
	const cargarInformes = async (showLoading = true) => {
		if (showLoading) setLoading(true)
		const { success, data } = await fetchInformes()
		setDatos(success ? data : [])
		if (showLoading) setLoading(false)
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

	const aColumns = [
		//  { field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'publicador',
			headerName: 'Publicador',
			//    description: 'This column has a value getter and is not sortable.',
			sortable: true,
			flex: 1,
			minWidth: 350
		},
		{
			field: 'mes',
			headerName: 'Mes',
			//type: 'date',
			width: 100,
			valueGetter: (value) => value?.substring(0, 7)
		},
		{
			field: 'predico_en_el_mes',
			headerName: 'Predicó',
			type: 'boolean',
			width: 100,
			valueGetter: (value, row) => (row.predico_en_el_mes || 0) == 1
		},
		{
			field: 'Estatus',
			headerName: 'Estatus',
			width: 150
		}
	]
	const columns = [
		//	{ text: 'Unit Price', datafield: 'price', width: 90, cellsalign: 'right', cellsformat: 'c2' },
		{
			datafield: 'publicador',
			text: 'Publicador',
			//sortable: true,
			//flex: 1,
			minWidth: 350
		},
		{
			datafield: 'mes',
			text: 'Mes',
			//type: 'date',
			cellsformat: 'dd/MM/yyyy',
			width: 100,
			cellsrenderer: (row, datafield, value, defaulthtml, columnproperties, datarow) => {
				if (value) return dayjs(value).format("YYYY-MM")
			}
			//valueGetter: (value) => value?.substring(0, 7)
		},
		{
			datafield: 'predico_en_el_mes',
			text: 'Predicó',
			//type: 'bool',
			columntype: 'checkbox',
			width: 100
			//valueGetter: (value, row) => (row.predico_en_el_mes || 0) == 1
		},
		{
			datafield: 'Estatus',
			text: 'Estatus',
			width: 150
		}
	]
	const source = {
		datafields: [
			{ name: 'publicador', type: 'string' },
			{ name: 'mes', type: 'date' },
			{ name: 'predico_en_el_mes', type: 'bool' },
			//{ name: 'price', type: 'number' },
			//{ name: 'total', type: 'number' },
			{ name: 'Estatus', type: 'string' }
		],
		datatype: 'local',
		localdata: datos
	}
	const dataAdapter = new jqx.dataAdapter(source)

	const myGrid = useRef(null)
	const rendertoolbar = useCallback((toolbar) => {
		const addRowClick = () => {
			const datarow = { ...initialForm }
			myGrid.current?.addrow(null, datarow)
		}
		const addMultipleRowsClick = () => {
			myGrid.current?.beginupdate()
			for (let i = 0; i < 10; i++) {
				const datarow = { ...initialForm }
				myGrid.current?.addrow(null, datarow)
			}
			myGrid.current?.endupdate()
		}
		const deleteRowClick = () => {
			const selectedrowindex = myGrid.current?.getselectedrowindex()
			const rowscount = myGrid.current?.getdatainformation().rowscount
			if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount || 0)) {
				const id = myGrid.current?.getrowid(selectedrowindex)
				myGrid.current?.deleterow(id)
			}
		}
		const updateRowClick = () => {
			const datarow = { ...initialForm }
			const selectedrowindex = myGrid.current?.getselectedrowindex()
			const rowscount = myGrid.current?.getdatainformation().rowscount
			if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount || 0)) {
				const id = myGrid.current?.getrowid(selectedrowindex)
				myGrid.current?.updaterow(id, datarow)
				myGrid.current?.ensurerowvisible(selectedrowindex)
			}
		}
		const root = createRoot(toolbar[0]) // createRoot(container!) if you use TypeScript
		root.render(
			<div style={{ margin: '5px' }}>
				<div id="buttonContainer1" style={{ float: 'left' }}>
					<JqxButton
						theme={'material'}
						onClick={addRowClick}
						width={105}
						value={'Add New Row'}
					/>
				</div>
				<div id="buttonContainer2" style={{ float: 'left', marginLeft: '5px' }}>
					<JqxButton
						theme={'material'}
						onClick={addMultipleRowsClick}
						width={170}
						value={'Add Multiple New Rows'}
					/>
				</div>
				<div id="buttonContainer3" style={{ float: 'left', marginLeft: '5px' }}>
					<JqxButton
						theme={'material'}
						onClick={deleteRowClick}
						width={150}
						value={'Delete Selected Row'}
					/>
				</div>
				<div id="buttonContainer4" style={{ float: 'left', marginLeft: '5px' }}>
					<JqxButton
						theme={'material'}
						onClick={updateRowClick}
						width={155}
						value={'Update Selected Row'}
					/>
				</div>
			</div>
		)
	}, [])
	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<JqxGrid
				theme={'material'}
				ref={myGrid}
				width={'100%'}
				height={350}
				source={dataAdapter}
				columns={columns}
				showtoolbar={true}
				rendertoolbar={rendertoolbar}
			/>
			<Loading loading={loading} />
			<ButtonBar
				title="Informes"
				loading={loading}
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => {
					setAlertType('confirm')
					setMessage('¿Estás seguro de que deseas eliminar este informe?')
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
					await deleteInforme(editandoId || editandoGridId)
					await cargarInformes()
					cancelarEdicion()
					setMessage('')
					setShowAlert(false)
				}}
				onCancel={() => {
					setMessage('')
					setShowAlert(false)
					if (alertType == 'success') cargarInformes(true)
				}}
			/>
			{!editandoId ? (
				<DataTable
					rows={datos}
					columns={aColumns}
					handleEditClick={(id) => iniciarEdicion(datos.find((item) => item.id == id))}
					handleDeleteClick={(id) => {
						setEditandoGridId(id)
						setAlertType('confirm')
						setMessage('¿Estás seguro de que deseas eliminar este informe?')
						setShowAlert(true)
					}}
				/>
			) : (
				<form id="frmEditor" onSubmit={handleSubmit} className="mb-6 space-y-4">
					<div className="p-6 bg-white rounded shadow-md w-full mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<TextField
								label="Publicador"
								name="id_publicador"
								select
								defaultValue={form.id_publicador}
								onChange={handleChange}
								required
							>
								{publicadores.map((pub) => (
									<MenuItem key={pub.id} value={pub.id}>
										{pub.nombre} {pub.apellidos}
									</MenuItem>
								))}
							</TextField>
							<DatePicker
								label="Mes"
								name="mes"
								required
								defaultValue={dayjs(form.mes)}
								onChange={(e) =>
									handleChange({
										target: {
											name: 'mes',
											value: dayjs(e.$d).format('YYYY-MM-DD')
										}
									})
								}
							/>
							<DatePicker
								label="Enviado"
								name="mes_enviado"
								required
								defaultValue={dayjs(form.mes_enviado)}
								onChange={(e) =>
									handleChange({
										target: {
											name: 'mes_enviado',
											value: dayjs(e.$d).format('YYYY-MM-DD')
										}
									})
								}
							/>{' '}
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											name="predico_en_el_mes"
											defaultChecked={form.predico_en_el_mes}
											onChange={handleChange}
										/>
									}
									label="Predicó en el mes"
								/>
							</FormGroup>
							<TextField
								label="Cursos bíblicos"
								name="cursos_biblicos"
								defaultValue={form.cursos_biblicoss}
								onChange={handleChange}
								type="number"
							/>
							<TextField
								label="Tipo publicador"
								name="id_tipo_publicador"
								select
								defaultValue={form.id_tipo_publicador}
								onChange={handleChange}
							>
								<MenuItem value="1">Publicador</MenuItem>
								<MenuItem value="2">Precursor regular</MenuItem>
								<MenuItem value="3">Precursor auxiliar</MenuItem>
							</TextField>
							<TextField
								label="Horas"
								name="horas"
								defaultValue={form.horas}
								onChange={handleChange}
								type="number"
							/>
							<TextField
								label="Horas Servicio Sagrado"
								name="horas_SS"
								defaultValue={form.horas_SS}
								onChange={handleChange}
								type="number"
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
