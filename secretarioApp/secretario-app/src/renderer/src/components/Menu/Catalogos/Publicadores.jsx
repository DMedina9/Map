import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import ButtonBar from '../../utils/ButtonBar'
import Alert from '../../utils/Alert'
import ProgressBar from '../../utils/ProgressBar'
import dayjs from 'dayjs'

// Estilos jqWidgets
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'

// Componentes jqWidgets
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput'
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput'
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow'
import JqxNumberInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxnumberinput'
import JqxMaskedInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxmaskedinput'

// Backend API (Electron preload)
const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const addPublicador = async (publicador) => await window.api.invoke('add-publicador', publicador)
const updatePublicador = async (id, publicador) =>
	await window.api.invoke('update-publicador', { id, ...publicador })
const deletePublicador = async (id) => await window.api.invoke('delete-publicador', id)

const initialForm = {
	nombre: '',
	apellidos: '',
	sexo: null,
	ungido: false,
	fecha_nacimiento: null,
	fecha_bautismo: null,
	grupo: '',
	id_tipo_publicador: '',
	id_privilegio: '',
	sup_grupo: null,
	calle: '',
	num: '',
	colonia: '',
	telefono_fijo: '',
	telefono_movil: '',
	contacto_emergencia: '',
	tel_contacto_emergencia: '',
	correo_contacto_emergencia: ''
}

export default function Publicadores() {
	const [datos, setDatos] = useState([])
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState(0)
	const [message, setMessage] = useState('')
	const [alertType, setAlertType] = useState('info')
	const [showAlert, setShowAlert] = useState(false)
	const editrow = useRef(-1)
	const gridRef = useRef(null)
	const myWindow = useRef(null)

	// Refs de formulario
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

	const refs = useMemo(
		() => ({
			nombre,
			apellidos,
			sexo,
			ungido,
			fecha_nacimiento,
			fecha_bautismo,
			grupo,
			id_tipo_publicador,
			id_privilegio,
			sup_grupo,
			calle,
			num,
			colonia,
			telefono_fijo,
			telefono_movil,
			contacto_emergencia,
			tel_contacto_emergencia,
			correo_contacto_emergencia
		}),
		[]
	)

	useEffect(() => {
		setLoading(true)
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
		const { success, data } = await fetchPublicadores()
		setDatos(success ? data : [])
	}

	const dataAdapter = useMemo(() => {
		return new window.jqx.dataAdapter({
			localdata: datos,
			datatype: 'array'
		})
	}, [datos])

	const iniciarEdicion = (rowIndex) => {
		editrow.current = rowIndex
		const record = rowIndex < 0 ? { ...initialForm } : gridRef.current.getrowdata(rowIndex)

		for (const key in refs) {
			if (refs[key].current) {
				if (refs[key].current.val) refs[key].current.val(record[key] || '')
				if (refs[key].current.setDate && record[key]) refs[key].current.setDate(record[key])
			}
		}
		myWindow.current.open()
	}

	const saveBtn = useCallback(async () => {
		const row = {}
		for (const key in refs) {
			if (refs[key].current && refs[key].current.val) row[key] = refs[key].current.val()
		}
		row.ungido = refs.ungido.current?.val() ? 1 : 0
		row.fecha_nacimiento = dayjs(refs.fecha_nacimiento.current?.val(), 'DD/MM/YYYY').format(
			'YYYY-MM-DD'
		)
		row.fecha_bautismo = dayjs(refs.fecha_bautismo.current?.val(), 'DD/MM/YYYY').format(
			'YYYY-MM-DD'
		)

		if (editrow.current >= 0) {
			const id = gridRef.current.getrowdata(editrow.current).id
			await updatePublicador(id, row)
			gridRef.current.updaterow(id, row)
		} else {
			await addPublicador(row)
			await cargarPublicadores()
		}
		myWindow.current.hide()
	}, [refs])

	const cancelBtn = () => myWindow.current.hide()

	const confirmDelete = () => {
		const index = gridRef.current.getselectedrowindex()
		if (index >= 0) {
			setAlertType('confirm')
			setMessage('¿Deseas eliminar este publicador?')
			setShowAlert(true)
		} else {
			setAlertType('info')
			setMessage('Seleccione una fila para eliminar.')
			setShowAlert(true)
		}
	}

	const deleteRow = async () => {
		const index = gridRef.current.getselectedrowindex()
		if (index >= 0) {
			const id = gridRef.current.getrowdata(index).id
			await deletePublicador(id)
			gridRef.current.deleterow(index)
			setAlertType('success')
			setMessage('Registro eliminado correctamente')
			setShowAlert(true)
		}
	}

	const columns = [
		{ text: 'Grupo', datafield: 'grupo', width: 80 },
		{ text: 'Nombre', datafield: 'nombre' },
		{ text: 'Apellidos', datafield: 'apellidos' },
		{ text: 'Tipo publicador', datafield: 'tipo_publicador' },
		{ text: 'Privilegio', datafield: 'privilegio' }
	]

	return (
		<div>
			<ButtonBar
				onAdd={() => iniciarEdicion(-1)}
				onDelete={confirmDelete}
				onImport={() => window.api.send('upload-publicadores')}
			/>

			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onConfirm={deleteRow}
				onCancel={() => {
					setMessage('')
					setShowAlert(false)
				}}
			/>

			<JqxGrid
				ref={gridRef}
				theme="material"
				width="100%"
				height={500}
				source={dataAdapter}
				columns={columns}
				ready={() => setLoading(false)}
				loading={loading}
				pageable={true}
				sortable={true}
				altrows={true}
				pagesize={10}
				pagesizeoptions={[10, 20, 50, 100]}
				onRowdoubleclick={(e) => iniciarEdicion(e.args.rowindex)}
			/>

			<ProgressBar show={!showAlert} message={message} progress={progress} />

			<JqxWindow
				ref={myWindow}
				theme="material"
				width="75%"
				height={480}
				resizable={false}
				autoOpen={false}
			>
				<div>Editar Publicador</div>
				<div className="flex flex-col justify-between h-full p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<label>Nombre:</label>
						<JqxInput ref={refs.nombre} theme="material" width="100%" />
						<label>Apellidos:</label>
						<JqxInput ref={refs.apellidos} theme="material" width="100%" />
						<label>Sexo:</label>
						<JqxDropDownList
							ref={refs.sexo}
							theme="material"
							width="100%"
							source={[
								{ value: 'H', label: 'Masculino' },
								{ value: 'M', label: 'Femenino' }
							]}
						/>
						<label>Fecha nacimiento:</label>
						<JqxDateTimeInput
							ref={refs.fecha_nacimiento}
							theme="material"
							width="100%"
						/>
						<label>Grupo:</label>
						<JqxNumberInput
							ref={refs.grupo}
							theme="material"
							width="100%"
							digits={1}
							decimalDigits={0}
						/>
						<label>Fecha bautismo:</label>
						<JqxDateTimeInput ref={refs.fecha_bautismo} theme="material" width="100%" />
						<label>Privilegio:</label>
						<JqxDropDownList
							ref={refs.id_privilegio}
							theme="material"
							width="100%"
							source={[
								{ value: 1, label: 'Anciano' },
								{ value: 2, label: 'Siervo ministerial' }
							]}
						/>
						<label>Tipo publicador:</label>
						<JqxDropDownList
							ref={refs.id_tipo_publicador}
							theme="material"
							width="100%"
							source={[
								{ value: 1, label: 'Publicador' },
								{ value: 2, label: 'Precursor regular' },
								{ value: 3, label: 'Precursor auxiliar' }
							]}
						/>
						<label>Ungido:</label>
						<JqxCheckBox ref={refs.ungido} theme="material" />
						<label>Calle:</label>
						<JqxInput ref={refs.calle} theme="material" width="100%" />
						<label>Número:</label>
						<JqxInput ref={refs.num} theme="material" width="100%" />
						<label>Colonia:</label>
						<JqxInput ref={refs.colonia} theme="material" width="100%" />
						<label>Teléfono fijo:</label>
						<JqxMaskedInput
							ref={refs.telefono_fijo}
							theme="material"
							mask="(##) #### ####"
							width="100%"
						/>
						<label>Teléfono móvil:</label>
						<JqxMaskedInput
							ref={refs.telefono_movil}
							theme="material"
							mask="(##) #### ####"
							width="100%"
						/>
						<label>Contacto emergencia:</label>
						<JqxInput ref={refs.contacto_emergencia} theme="material" width="100%" />
						<label>Teléfono contacto emergencia:</label>
						<JqxMaskedInput
							ref={refs.tel_contacto_emergencia}
							theme="material"
							mask="(##) #### ####"
							width="100%"
						/>
						<label>Correo contacto emergencia:</label>
						<JqxInput
							ref={refs.correo_contacto_emergencia}
							theme="material"
							width="100%"
						/>
						<label>Superintendente grupo:</label>
						<JqxDropDownList
							ref={refs.sup_grupo}
							theme="material"
							width="100%"
							source={[
								{ value: 1, label: 'Superintendente' },
								{ value: 2, label: 'Auxiliar' }
							]}
						/>
					</div>

					<div className="mt-auto flex justify-center gap-2">
						<ButtonBar editando={true} onSave={saveBtn} onCancel={cancelBtn} />
					</div>
				</div>
			</JqxWindow>
		</div>
	)
}
