import { useState, useEffect, useRef, useCallback } from 'react'
import { getAppSetting } from '../../utils/Settings'
import ButtonBar from '../../utils/ButtonBar'
import Alert from '../../utils/Alert'
import dayjs from 'dayjs'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

// ====================== Funciones API ======================
const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const fetchInformes = async () => await window.api.invoke('get-data-from-xlsx', 'Informes')
const uploadInformes = async (informes) => await window.api.invoke('upload-informes-grid', informes)

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
				name: 'Nombre',
				value: 'id_publicador',
				values: { source: publicadoresAdapter.records, value: 'value', name: 'label' }
			},
			{ name: 'id_publicador', type: 'number' },
			{ name: 'Mes', type: 'date' },
			{ name: 'Mes enviado', type: 'date' },
			{ name: 'Predicó en el mes', type: 'bool' },
			{ name: 'Cursos bíblicos', type: 'number' },
			{ name: 'id_tipo_publicador', type: 'number' },
			{
				name: 'Tipo Publicador',
				value: 'id_tipo_publicador',
				values: {
					source: tipoPublicadoresAdapter.records,
					value: 'value',
					name: 'label'
				}
			},
			{ name: 'Horas', type: 'number' },
			{ name: 'Notas', type: 'string' },
			{ name: 'Horas S. S. (PR)', type: 'number' }
		],
		datatype: 'array',
		localdata: datos
	}

	const columns = [
		{
			datafield: 'id_publicador',
			displayfield: 'Nombre',
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
			datafield: 'Mes',
			text: 'Mes',
			cellsformat: 'dd/MM/yyyy',
			columntype: 'datetimeinput',
			width: 120
		},
		{
			datafield: 'Mes enviado',
			text: 'Enviado',
			cellsformat: 'dd/MM/yyyy',
			columntype: 'datetimeinput',
			width: 120
		},
		{
			datafield: 'Predicó en el mes',
			text: 'Predicó',
			columntype: 'checkbox',
			width: 100
		},
		{
			datafield: 'Cursos bíblicos',
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
			displayfield: 'Tipo Publicador',
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
			datafield: 'Horas',
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
			datafield: 'Horas S. S. (PR)',
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
			datafield: 'Notas',
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

export default function Informes() {
	const [datos, setDatos] = useState([])
	const [columns, setColumns] = useState([])
	const [dataAdapter, setDataAdapter] = useState(null)
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('info')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(true)
	const myGrid = useRef(null)
	const theme = getAppSetting('theme')

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
	// --- Toolbar actions
	const agregarRegistro = () => {
		const id = Math.random().toString(36).substring(2, 9)
		const newRow = { ...initialForm }
		myGrid.current.addrow(id, newRow)
		myGrid.current.ensurerowvisible(dataAdapter.records.length - 1)
	}

	const guardarRegistros = async () => {
		const datos = dataAdapter.records
		console.log('Guardando informes...', datos)
		if (datos.length === 0) {
			setAlertType('info')
			setMessage('No hay informes para guardar.')
			setShowAlert(true)
			return
		}
		const { success, error } = await uploadInformes(
			datos.map((informe) => dataValueFechas(informe))
		)
		if (!success) {
			setAlertType('error')
			setMessage(error || 'Error al guardar los informes.')
			setShowAlert(true)
			return
		}
		setAlertType('info')
		setMessage(`Informes guardados correctamente.`)
		setShowAlert(true)
		setDatos([])
	}

	const cargarInformes = useCallback(async () => {
		setLoading(true)
		const { success, message, data } = await fetchInformes()
		if (!success) {
			setAlertType('error')
			setMessage(message)
			setShowAlert(true)
		} else setDatos(data.map(corregirFechas))
		setLoading(false)
	}, [])

	const eliminarFila = () => {
		const index = myGrid.current.getselectedrowindex()
		if (index >= 0) {
			const id = myGrid.current.getrowid(index)
			myGrid.current.deleterow(id)
		} else {
			setAlertType('info')
			setMessage('Seleccione una fila para eliminar.')
			setShowAlert(true)
		}
	}

	// ====================== Carga de datos ======================
	useEffect(() => {
		const cargarDatos = async () => {
			setLoading(true)
			const { success, data: pubs } = await fetchPublicadores()
			const listaPublicadores = success
				? pubs.map((p) => ({ value: p.id, label: `${p.nombre} ${p.apellidos}` }))
				: []
			const { dataAdapter, columns } = getSource(datos, listaPublicadores)
			setColumns(columns)
			setDataAdapter(dataAdapter)
			setLoading(false)
		}
		cargarDatos()
	}, [datos])

	// ====================== Render ======================
	//if (loading || !dataAdapter || !columns.length)
	//	return <div className="p-8 text-center">Cargando informes...</div>

	return (
		<div>
			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onConfirm={eliminarFila}
				onCancel={() => setShowAlert(false)}
			/>
			<ButtonBar
				onAdd={agregarRegistro}
				onSave={guardarRegistros}
				onDelete={eliminarFila}
				onImport={cargarInformes}
			/>

			<JqxGrid
				ref={myGrid}
				width="100%"
				height={500}
				theme={theme}
				source={dataAdapter}
				columns={columns}
				pageable={true}
				sortable={true}
				altrows={true}
				editable={true}
				ready={() => setLoading(false)}
				loading={loading}
				pagesize={10}
				pagesizeoptions={[10, 20, 50, 100]}
			/>
		</div>
	)
}
