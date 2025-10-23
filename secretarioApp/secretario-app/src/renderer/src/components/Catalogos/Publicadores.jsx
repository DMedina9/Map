import { useState, useEffect, useRef, useCallback } from 'react'
import ButtonBar from '../utils/ButtonBar'
import Alert from '../utils/Alert'
import Loading from '../utils/Loading'
import ProgressBar from '../utils/ProgressBar'
import dayjs from 'dayjs'

// Importar jqWidgets
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput'
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput'
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxNumberInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxnumberinput'
import JqxMaskedInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxmaskedinput'

// Funciones para interactuar con el backend
const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const addPublicador = async (publicador) => await window.api.invoke('add-publicador', publicador)
const updatePublicador = async (id, publicador) =>
	await window.api.invoke('update-publicador', { id, ...publicador })
const deletePublicador = async (id) => await window.api.invoke('delete-publicador', id)

const initialForm = {
	nombre: '',
	apellidos: '',
	grupo: '',
	id_tipo_publicador: '',
	id_privilegio: '',
	sup_grupo: null,
	fecha_nacimiento: null,
	fecha_bautismo: null,
	sexo: '',
	ungido: false
}

export default function Publicadores() {
	const [datos, setDatos] = useState([])
	const [editandoId, setEditandoId] = useState(null)
	const [editandoGridId, setEditandoGridId] = useState(null)
	const [form, setForm] = useState(initialForm)
	const [showAlert, setShowAlert] = useState(false)
	const [loading, setLoading] = useState(true)
	const [alertType, setAlertType] = useState('confirm')
	const [message, setMessage] = useState('')
	const [progress, setProgress] = useState(0)
	const nombre = useRef(null)
	const apellidos = useRef(null)
	const sexo = useRef(null)
	const ungido = useRef(null)
	const fecha_nacimiento = useRef(null)
	const fecha_bautismo = useRef(null)
	const grupo = useRef(null)
	const id_tipo_publicador = useRef(null)
	const id_privilegio = useRef(null)
	const sup_grupo = useRef(null)
	const calle = useRef(null)
	const num = useRef(null)
	const colonia = useRef(null)
	const telefono_fijo = useRef(null)
	const telefono_movil = useRef(null)
	const contacto_emergencia = useRef(null)
	const tel_contacto_emergencia = useRef(null)
	const correo_contacto_emergencia = useRef(null)

	const editrow = useRef(-1)
	const gridRef = useRef(null)
	const myWindow = useRef(null)
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

	const cargarPublicadores = async () => {
		setLoading(true)
		const { success, data } = await fetchPublicadores()
		setDatos(success ? data : [])
		setLoading(false)
	}

	const handleChange = (name, value) => {
		setForm({ ...form, [name]: value })
	}

	const iniciarEdicion = (item) => {
		setEditandoId(item.id)
		setForm({ ...item })
	}

	const cancelarEdicion = () => {
		setEditandoId(null)
		setForm(initialForm)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (editandoId > 0) await updatePublicador(editandoId, form)
		else await addPublicador(form)

		await cargarPublicadores()
		cancelarEdicion()
	}
	const saveBtn = useCallback(async () => {
		console.log('Guardando...', {nombre: nombre.current?.getOptions('value'),
			apellidos: apellidos.current?.getOptions('value'),
			sexo: sexo.current?.getOptions('value'),
			ungido: ungido.current?.getOptions('value') ? 1 : 0,
			fecha_nacimiento: dayjs(fecha_nacimiento.current?.val()).format('YYYY-MM-DD'),
			fecha_bautismo: dayjs(fecha_bautismo.current?.val()).format('YYYY-MM-DD'),
			grupo: grupo.current?.val(),
			id_tipo_publicador: id_tipo_publicador.current?.val(),
			id_privilegio: id_privilegio.current?.val(),
			sup_grupo: sup_grupo.current?.val(),
			calle: calle.current?.val(),
			num: num.current?.val(),
			colonia: colonia.current?.val(),
			telefono_fijo: telefono_fijo.current?.val(),
			telefono_movil: telefono_movil.current?.val(),
			contacto_emergencia: contacto_emergencia.current?.val(),
			tel_contacto_emergencia: tel_contacto_emergencia.current?.val(),
			correo_contacto_emergencia: correo_contacto_emergencia.current?.val()})
		const row = {
			nombre: nombre.current?.getOptions('value'),
			apellidos: apellidos.current?.getOptions('value'),
			sexo: sexo.current?.getOptions('value'),
			ungido: ungido.current?.getOptions('value') ? 1 : 0,
			fecha_nacimiento: dayjs(fecha_nacimiento.current?.val()).format('YYYY-MM-DD'),
			fecha_bautismo: dayjs(fecha_bautismo.current?.val()).format('YYYY-MM-DD'),
			grupo: grupo.current?.val(),
			id_tipo_publicador: id_tipo_publicador.current?.val(),
			id_privilegio: id_privilegio.current?.val(),
			sup_grupo: sup_grupo.current?.val(),
			calle: calle.current?.val(),
			num: num.current?.val(),
			colonia: colonia.current?.val(),
			telefono_fijo: telefono_fijo.current?.val(),
			telefono_movil: telefono_movil.current?.val(),
			contacto_emergencia: contacto_emergencia.current?.val(),
			tel_contacto_emergencia: tel_contacto_emergencia.current?.val(),
			correo_contacto_emergencia: correo_contacto_emergencia.current?.val()
		}
		if (editrow.current >= 0) {
			const id = gridRef.current?.getrowdata(editrow.current).id
			await updatePublicador(id, row)
			const rowID = gridRef.current?.getrowid(editrow.current)
			gridRef.current?.updaterow(rowID, row)
		} else {
			await addPublicador(row)
			await cargarPublicadores()
		}
		myWindow.current?.hide()
	}, [])
	const cancelBtn = useCallback(() => {
		myWindow.current?.hide()
	}, [])
	const columns = [
		{ text: 'Nombre', datafield: 'nombre' },
		{ text: 'Grupo', datafield: 'grupo' },
		{ text: 'Sexo', datafield: 'sexo' },
		{
			buttonclick: (row) => {
				editrow.current = row
				const dataRecord = gridRef.current?.getrowdata(editrow.current)
				nombre.current?.val(dataRecord.nombre)
				apellidos.current?.val(dataRecord.apellidos)
				sexo.current?.val(dataRecord.sexo)
				ungido.current?.val(dataRecord.ungido === 1)
				fecha_nacimiento.current?.setDate(dataRecord.fecha_nacimiento)
				fecha_bautismo.current?.setDate(dataRecord.fecha_bautismo)
				grupo.current?.val(dataRecord.grupo)
				id_tipo_publicador.current?.val(dataRecord.id_tipo_publicador)
				id_privilegio.current?.val(dataRecord.id_privilegio)
				sup_grupo.current?.val(dataRecord.sup_grupo)
				calle.current?.val(dataRecord.calle)
				num.current?.val(dataRecord.num)
				colonia.current?.val(dataRecord.colonia)
				telefono_fijo.current?.val(dataRecord.telefono_fijo)
				telefono_movil.current?.val(dataRecord.telefono_movil)
				contacto_emergencia.current?.val(dataRecord.contacto_emergencia)
				tel_contacto_emergencia.current?.val(dataRecord.tel_contacto_emergencia)
				correo_contacto_emergencia.current?.val(dataRecord.correo_contacto_emergencia)
				myWindow.current?.open()
			},
			cellsrenderer: () => {
				return 'Editar'
			},
			columntype: 'button',
			datafield: 'Edit',
			text: 'Editar',
			width: 70
		}
	]

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<Loading loading={loading} />
			<ButtonBar
				title="Publicadores"
				loading={loading}
				editandoId={editandoId}
				onSave={() => document.getElementById('frmEditor').requestSubmit()}
				onCancel={cancelarEdicion}
				onAdd={() => iniciarEdicion({ ...initialForm, id: -1 })}
				onDelete={() => {
					setAlertType('confirm')
					setMessage('¿Estás seguro de que deseas eliminar este publicador?')
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
					setMessage('')
					setShowAlert(false)
				}}
				onCancel={() => {
					setMessage('')
					setShowAlert(false)
					if (alertType === 'success') cargarPublicadores()
				}}
			/>

			<JqxGrid
				ref={gridRef}
				theme="material"
				width="100%"
				height={500}
				autoheight={true}
				columns={columns}
				source={new window.jqx.dataAdapter({ localdata: datos, datatype: 'array' })}
				pageable={true}
				sortable={true}
				onRowdoubleclick={(e) => iniciarEdicion(e.args.row.bounddata)}
				altrows={true}
				pagesize={10}
				pagesizeoptions={[10, 20, 50, 100]}
				loadingindicator={loading}
			/>
			<JqxWindow
				theme="material"
				ref={myWindow}
				width="75%"
				height={450}
				resizable={false}
				isModal={false}
				autoOpen={false}
				modalOpacity={'0.01'}
			>
				<div>Editar</div>
				<div style={{ overflow: 'hidden' }}>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<label>Nombre:</label>
						<JqxInput ref={nombre} theme="material" width="100%" />

						<label>Apellidos:</label>
						<JqxInput ref={apellidos} theme="material" width="100%" />

						<label>Sexo:</label>
						<JqxDropDownList
							ref={sexo}
							theme="material"
							width="100%"
							source={[
								{ value: 'H', label: 'Masculino' },
								{ value: 'M', label: 'Femenino' }
							]}
						/>

						<label>Fecha de nacimiento:</label>
						<JqxDateTimeInput ref={fecha_nacimiento} theme="material" width="100%" />

						<label>Grupo:</label>
						<JqxNumberInput
							ref={grupo}
							theme="material"
							width="100%"
							digits={1}
							decimalDigits={0}
							inputMode="simple"
							spinButtons={true}
						/>

						<label>Fecha de bautismo:</label>
						<JqxDateTimeInput ref={fecha_bautismo} theme="material" width="100%" />

						<label>Privilegio:</label>
						<JqxDropDownList
							ref={id_privilegio}
							theme="material"
							width="100%"
							source={[
								{ value: 1, label: 'Anciano' },
								{ value: 2, label: 'Siervo ministerial' }
							]}
						/>

						<label>Tipo publicador:</label>
						<JqxDropDownList
							ref={id_tipo_publicador}
							theme="material"
							width="100%"
							source={[
								{ value: 1, label: 'Publicador' },
								{ value: 2, label: 'Precursor regular' },
								{ value: 3, label: 'Precursor auxiliar' }
							]}
						/>

						<label>Ungido:</label>
						<JqxCheckBox ref={ungido} theme="material"></JqxCheckBox>

						<label>Calle:</label>
						<JqxInput ref={calle} theme="material" width="100%" />

						<label>Número:</label>
						<JqxInput ref={num} theme="material" width="100%" />

						<label>Colonia:</label>
						<JqxInput ref={colonia} theme="material" width="100%" />

						<label>Teléfono fijo:</label>
						<JqxMaskedInput
							ref={telefono_fijo}
							theme="material"
							mask="(##) #### ####"
							width="100%"
						/>
						<label>Teléfono móvil:</label>
						<JqxMaskedInput
							ref={telefono_movil}
							theme="material"
							mask="(##) #### ####"
							width="100%"
						/>
						<label>Contacto de emergencia:</label>
						<JqxInput ref={contacto_emergencia} theme="material" width="100%" />
						<label>Teléfono de contacto de emergencia:</label>
						<JqxMaskedInput
							ref={tel_contacto_emergencia}
							theme="material"
							mask="(##) #### ####"
							width="100%"
						/>
						<label>Correo de contacto de emergencia:</label>
						<JqxInput ref={correo_contacto_emergencia} theme="material" width="100%" />
						<label>Superintendente de grupo:</label>
						<JqxDropDownList
							ref={sup_grupo}
							theme="material"
							width="100%"
							source={[
								{ value: 1, label: 'Superintendente' },
								{ value: 2, label: 'Auxiliar' }
							]}
						/>
					</div>
					<div>
						<JqxButton
							theme={'material'}
							style={{ display: 'inline-block', marginRight: '5px' }}
							onClick={saveBtn}
							width={50}
						>
							Save
						</JqxButton>
						<JqxButton
							theme={'material'}
							style={{ display: 'inline-block', marginRight: '5px' }}
							onClick={cancelBtn}
							width={50}
						>
							Cancel
						</JqxButton>
					</div>
				</div>
			</JqxWindow>
		</div>
	)
}
