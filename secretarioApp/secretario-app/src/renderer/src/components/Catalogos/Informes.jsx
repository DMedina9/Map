import { useState, useEffect, useRef, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import Alert from '../utils/Alert'
import ProgressBar from '../utils/ProgressBar'
import dayjs from 'dayjs'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

// ====================== Funciones API ======================
const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const fetchInformes = async () => await window.api.invoke('get-informes', ['', '', 'desc'])
const addInforme = async (informe) => await window.api.invoke('add-informe', informe)
const updateInforme = async (id, informe) =>
	await window.api.invoke('update-informe', { id, ...informe })
const deleteInforme = async (id) => await window.api.invoke('delete-informe', id)

// ====================== Adaptadores ======================
const getPublicadoresAdapter = (publicadores) => {
	const source = {
		datafields: [
			{ name: 'label', type: 'string' },
			{ name: 'value', type: 'number' }
		],
		datatype: 'array',
		localdata: publicadores
	}
	return new jqx.dataAdapter(source, { autoBind: true })
}

const getTipoPublicadoresAdapter = () => {
	const tipos = ['Publicador', 'Precursor regular', 'Precursor auxiliar'].map((label, i) => ({
		value: i + 1,
		label
	}))
	const source = {
		datafields: [
			{ name: 'label', type: 'string' },
			{ name: 'value', type: 'number' }
		],
		datatype: 'array',
		localdata: tipos
	}
	return new jqx.dataAdapter(source, { autoBind: true })
}

// ====================== Configuración de Grid ======================
const getSource = (datos, publicadores) => {
	const publicadoresAdapter = getPublicadoresAdapter(publicadores)
	const tipoPublicadoresAdapter = getTipoPublicadoresAdapter()

	const source = {
		datafields: [
			{ name: 'id', type: 'number' },
			{
				name: 'publicador',
				value: 'id_publicador',
				values: { source: publicadoresAdapter.records, value: 'value', name: 'label' }
			},
			{ name: 'id_publicador', type: 'number' },
			{ name: 'mes', type: 'date' },
			{ name: 'mes_enviado', type: 'date' },
			{ name: 'predico_en_el_mes', type: 'bool' },
			{ name: 'cursos_biblicos', type: 'number' },
			{ name: 'id_tipo_publicador', type: 'number' },
			{
				name: 'tipo_publicador',
				value: 'id_tipo_publicador',
				values: {
					source: tipoPublicadoresAdapter.records,
					value: 'value',
					name: 'label'
				}
			},
			{ name: 'horas', type: 'number' },
			{ name: 'notas', type: 'string' },
			{ name: 'horas_SS', type: 'number' }
		],
		datatype: 'local',
		localdata: datos
	}

	const columns = [
		{
			datafield: 'id_publicador',
			displayfield: 'publicador',
			text: 'Publicador',
			columntype: 'dropdownlist',
			createeditor: (row, value, editor) => {
				editor.jqxDropDownList({
					source: publicadoresAdapter,
					displayMember: 'label',
					valueMember: 'value'
				})
			},
			minWidth: 300
		},
		{
			datafield: 'mes',
			text: 'Mes',
			cellsformat: 'dd/MM/yyyy',
			columntype: 'datetimeinput',
			width: 120
		},
		{
			datafield: 'mes_enviado',
			text: 'Enviado',
			cellsformat: 'dd/MM/yyyy',
			columntype: 'datetimeinput',
			width: 120
		},
		{
			datafield: 'predico_en_el_mes',
			text: 'Predicó',
			columntype: 'checkbox',
			width: 100
		},
		{
			datafield: 'cursos_biblicos',
			text: 'Cursos bíblicos',
			columntype: 'numberinput',
			cellsalign: 'right',
			cellsformat: 'n0',
			createeditor: (row, value, editor) => {
				editor.jqxNumberInput({ decimalDigits: 0, digits: 3 })
			},
			width: 120
		},
		{
			datafield: 'id_tipo_publicador',
			displayfield: 'tipo_publicador',
			text: 'Tipo Publicador',
			columntype: 'dropdownlist',
			createeditor: (row, value, editor) => {
				editor.jqxDropDownList({
					source: tipoPublicadoresAdapter,
					displayMember: 'label',
					valueMember: 'value'
				})
			},
			width: 150
		},
		{
			datafield: 'horas',
			text: 'Horas',
			columntype: 'numberinput',
			cellsalign: 'right',
			cellsformat: 'n0',
			createeditor: (row, value, editor) => {
				editor.jqxNumberInput({ decimalDigits: 0, digits: 3 })
			},
			width: 100
		},
		{
			datafield: 'horas_SS',
			text: 'Horas SS',
			columntype: 'numberinput',
			cellsalign: 'right',
			cellsformat: 'n0',
			createeditor: (row, value, editor) => {
				editor.jqxNumberInput({ decimalDigits: 0, digits: 3 })
			},
			width: 120
		},
		{
			datafield: 'notas',
			text: 'Notas',
			minWidth: 200
		}
	]

	return { dataAdapter: new jqx.dataAdapter(source), columns }
}

// ====================== Componente ======================
const initialForm = {
	id_publicador: '',
	mes: dayjs(window.mesInforme).add(1, 'month').toDate(),
	mes_enviado: dayjs(window.mesInforme).add(1, 'month').toDate(),
	id_tipo_publicador: 1,
	tipo_publicador: 'Publicador',
	predico_en_el_mes: false,
	cursos_biblicos: '',
	horas: '',
	notas: ''
}

let root = null

export default function Informes() {
	const [columns, setColumns] = useState([])
	const [dataAdapter, setDataAdapter] = useState(null)
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('info')
	const [message, setMessage] = useState('')
	const [progress, setProgress] = useState(0)
	const [loading, setLoading] = useState(true)
	const myGrid = useRef(null)

	// ====================== Carga de datos ======================
	useEffect(() => {
		const cargarDatos = async () => {
			setLoading(true)
			const [{ success: ok1, data: infs }, { success: ok2, data: pubs }] = await Promise.all([
				fetchInformes(),
				fetchPublicadores()
			])
			const informes = ok1 ? infs.map(corregirFechas) : []
			const listaPublicadores = ok2
				? pubs.map((p) => ({ value: p.id, label: `${p.nombre} ${p.apellidos}` }))
				: []
			const { dataAdapter, columns } = getSource(informes, listaPublicadores)
			setColumns(columns)
			setDataAdapter(dataAdapter)
			setLoading(false)
		}
		cargarDatos()

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

	const corregirFechas = (informe) => ({
		...informe,
		mes: informe.mes ? dayjs(informe.mes).toDate() : null,
		mes_enviado: informe.mes_enviado ? dayjs(informe.mes_enviado).toDate() : null
	})
	const dataValueFechas = (informe) => ({
		...informe,
		mes: informe.mes ? dayjs(informe.mes).format('YYYY-MM-DD') : null,
		mes_enviado: informe.mes_enviado ? dayjs(informe.mes_enviado).format('YYYY-MM-DD') : null
	})
	// ====================== Eventos ======================
	const onCellEndEdit = useCallback(async (event) => {
		const record = myGrid.current.getrowdata(event.args.rowindex)
		const column = myGrid.current.getcolumn(event.args.datafield)
		const updated = { ...record }

		if (column.displayfield !== column.datafield) {
			updated[column.datafield] = event.args.value.value
		} else {
			updated[column.datafield] = event.args.value
		}

		if (!record.id) {
			const { success, id } = await addInforme(dataValueFechas(updated))
			if (success) {
				updated.id = id
				const rowID = myGrid.current?.getrowid(event.args.rowindex)
				myGrid.current?.updaterow(rowID, updated)
			}
		} else {
			const { success, error } = await updateInforme(record.id, dataValueFechas(updated))
			if (!success) {
				setAlertType('error')
				setMessage(`Error al actualizar informe: ${error}`)
				setShowAlert(true)
			}
		}
	}, [])
	const renderToolbar = useCallback(
		(toolbar) => {
			const addRow = () => myGrid.current?.addrow(null, { ...initialForm })
			const deleteRow = async () => {
				const index = myGrid.current?.getselectedrowindex()
				if (index >= 0) {
					//const id = myGrid.current?.getrowid(index)
					setShowAlert(false)
					setMessage('')
					await deleteInforme(myGrid.current.getrowdata(index).id)
					myGrid.current?.deleterow(index)
					setAlertType('success')
					setMessage('Fila eliminada correctamente')
					setShowAlert(true)
				}
			}
			const confirmDelete = () => {
				const index = myGrid.current?.getselectedrowindex()
				if (index >= 0) {
					setAlertType('confirm')
					setMessage('¿Eliminar fila seleccionada?')
					setShowAlert(true)
				} else {
					setAlertType('info')
					setMessage('Seleccione una fila para eliminar')
					setShowAlert(true)
				}
			}

			if (!root) root = createRoot(toolbar[0])
			root.render(
				<div
					style={{ margin: '5px', display: 'flex', flexFlow: 'row-reverse', gap: '8px' }}
				>
					<Alert
						type={alertType}
						message={message}
						show={showAlert}
						onConfirm={deleteRow}
						onCancel={() => {
							setShowAlert(false)
							setMessage('')
							if (alertType === 'success') window.location.reload()
						}}
					/>
					<JqxButton
						theme="material"
						onClick={confirmDelete}
						width={100}
						value="Eliminar"
					/>
					<JqxButton theme="material" onClick={addRow} width={100} value="Agregar" />
					<JqxButton
						theme="material"
						onClick={() => window.api.send('upload-informes')}
						width={100}
						value="Importar"
					/>
				</div>
			)
		},
		[alertType, message, showAlert]
	)

	// ====================== Render ======================
	//if (loading || !dataAdapter || !columns.length)
	//	return <div className="p-8 text-center">Cargando informes...</div>

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<JqxGrid
				ref={myGrid}
				theme="material"
				width="100%"
				height={500}
				source={dataAdapter}
				columns={columns}
				showtoolbar={true}
				rendertoolbar={renderToolbar}
				onCellendedit={onCellEndEdit}
				editable={true}
				sortable={true}
				altrows={true}
				selectionmode={'singlerow'}
				pageable={true}
				pagesize={10}
				pagesizeoptions={[10, 20, 50, 100]}
				loadingindicator={loading}
			/>
			<ProgressBar show={!showAlert} message={message} progress={progress} />
		</div>
	)
}
