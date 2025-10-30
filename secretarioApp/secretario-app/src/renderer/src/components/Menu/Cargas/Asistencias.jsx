import { useState, useRef, useMemo, useCallback } from 'react'
import ButtonBar from '../../utils/ButtonBar'
import Alert from '../../utils/Alert'
import dayjs from 'dayjs'

// jqWidgets
import JqxGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

// --- API invocaciones
const fetchAsistencias = async () => await window.api.invoke('get-asistencias-from-xlsx')
const uploadAsistencias = async (asistencias) =>
	await window.api.invoke('upload-asistencias-grid', asistencias)

export default function Asistencias() {
	const [datos, setDatos] = useState([])
	const [loading, setLoading] = useState(true)
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('confirm')
	const [message, setMessage] = useState('')
	const gridRef = useRef(null)

	const corregirFechas = (asistencia) => ({
		...asistencia,
		Fecha: asistencia.Fecha ? dayjs(asistencia.Fecha).toDate() : null
	})
	const dataValueFechas = (asistencia) => ({
		...asistencia,
		Fecha: asistencia.Fecha ? dayjs(asistencia.Fecha).format('YYYY-MM-DD') : null
	})

	const dataAdapter = useMemo(() => {
		return new window.jqx.dataAdapter({
			localdata: datos,
			datatype: 'array',
			datafields: [
				{ name: 'id', type: 'string' },
				{ name: 'Fecha', type: 'date' },
				{ name: 'Tipo', type: 'string' },
				{ name: 'Asistentes', type: 'number' },
				{ name: 'Notas', type: 'string' }
			],
			id: 'id'
		})
	}, [datos])

	// --- Toolbar actions
	const agregarRegistro = () => {
		const id = Math.random().toString(36).substring(2, 9)
		const newRow = {
			id,
			Fecha: null,
			Asistentes: 0,
			Notas: ''
		}
		gridRef.current.addrow(id, newRow)
		gridRef.current.ensurerowvisible(dataAdapter.records.length - 1)
	}

	const guardarRegistros = async () => {
		const datos = dataAdapter.records
		console.log('Guardando asistencias...', datos)
		if (datos.length === 0) {
			setAlertType('info')
			setMessage('No hay asistencias para guardar.')
			setShowAlert(true)
			return
		}
		const { success, error } = await uploadAsistencias(
			datos.map((asistencia) => dataValueFechas(asistencia))
		)
		if (!success) {
			setAlertType('error')
			setMessage(error || 'Error al guardar las asistencias.')
			setShowAlert(true)
			return
		}
		setAlertType('info')
		setMessage(`Asistencias guardadas correctamente.`)
		setShowAlert(true)
		setDatos([])
	}

	const cargarAsistencias = useCallback(async () => {
		setLoading(true)
		const { success, message, data } = await fetchAsistencias()
		if (!success) {
			setAlertType('error')
			setMessage(message)
			setShowAlert(true)
		} else setDatos(data.map(corregirFechas))
		setLoading(false)
	}, [])

	const eliminarFila = () => {
		const index = gridRef.current.getselectedrowindex()
		if (index >= 0) {
			const id = gridRef.current.getrowid(index)
			gridRef.current.deleterow(id)
		} else {
			setAlertType('info')
			setMessage('Seleccione una fila para eliminar.')
			setShowAlert(true)
		}
	}

	const columnas = [
		{
			text: 'Fecha',
			datafield: 'Fecha',
			columntype: 'datetimeinput',
			cellsformat: 'dd/MM/yyyy',
			width: 150,
			editable: true
		},
		{
			text: 'Asistencia',
			datafield: 'Asistentes',
			columntype: 'numberinput',
			width: 120,
			editable: true
		},
		{
			text: 'Notas',
			datafield: 'Notas',
			editable: true
		}
	]

	return (
		<div>
			{/* Toolbar */}
			<ButtonBar
				onAdd={agregarRegistro}
				onSave={guardarRegistros}
				onDelete={eliminarFila}
				onImport={cargarAsistencias}
			/>

			<Alert
				type={alertType}
				message={message}
				show={showAlert}
				onConfirm={eliminarFila}
				onCancel={() => setShowAlert(false)}
			/>

			<JqxGrid
				ref={gridRef}
				width="100%"
				height={500}
				theme="material"
				source={dataAdapter}
				columns={columnas}
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
