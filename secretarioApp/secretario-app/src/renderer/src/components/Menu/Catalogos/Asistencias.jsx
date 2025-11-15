import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { getAppSetting } from '../../utils/Settings'
import ButtonBar from '../../utils/ButtonBar'
import Alert from '../../utils/Alert'
import dayjs from 'dayjs'

// jqWidgets
import JqxGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

// --- API invocaciones
const fetchAsistencias = async () => await window.api.invoke('get-asistencias')
const addAsistencia = async (asistencia) => await window.api.invoke('add-asistencia', asistencia)
const updateAsistencia = async (id, asistencia) =>
	await window.api.invoke('update-asistencia', { id, ...asistencia })
const deleteAsistencia = async (id) => await window.api.invoke('delete-asistencia', id)

export default function Asistencias() {
	const [datos, setDatos] = useState([])
	const [loading, setLoading] = useState(true)
	const [showAlert, setShowAlert] = useState(false)
	const [alertType, setAlertType] = useState('confirm')
	const [message, setMessage] = useState('')
	const [showDelete, setShowDelete] = useState(false)
	const gridRef = useRef(null)
	const theme = getAppSetting('theme')

	const cargarAsistencias = useCallback(async () => {
		setLoading(true)
		const { success, data } = await fetchAsistencias()
		setDatos(success ? data.map(corregirFechas) : [])
		setLoading(false)
	}, [])

	useEffect(() => {
		cargarAsistencias()
	}, [cargarAsistencias])
	const corregirFechas = (asistencia) => ({
		...asistencia,
		fecha: asistencia.fecha ? dayjs(asistencia.fecha).toDate() : null
	})
	const dataValueFechas = (asistencia) => ({
		...asistencia,
		fecha: asistencia.fecha ? dayjs(asistencia.fecha).format('YYYY-MM-DD') : null
	})

	const guardarFila = useCallback(async (rowIndex, row) => {
		if (row.isNew) {
			const { success, id } = await addAsistencia(dataValueFechas(row))
			if (success) {
				row.id = id
				row.isNew = false
				const rowID = gridRef.current?.getrowid(rowIndex)
				gridRef.current?.updaterow(rowID, row)
			}
		} else {
			const { success, error } = await updateAsistencia(row.id, dataValueFechas(row))
			if (!success) {
				setAlertType('error')
				setMessage(`Error al actualizar asistencia: ${error}`)
				setShowAlert(true)
			}
		}
	}, [])

	const dataAdapter = useMemo(() => {
		return new window.jqx.dataAdapter({
			localdata: datos,
			datatype: 'array',
			datafields: [
				{ name: 'id', type: 'string' },
				{ name: 'fecha', type: 'date' },
				{ name: 'tipo_asistencia', type: 'string' },
				{ name: 'asistentes', type: 'number' },
				{ name: 'notas', type: 'string' }
			],
			id: 'id',
			updaterow: async (rowid, rowdata, commit) => {
				// that function is called after each edit.
				const rowindex = gridRef.current.getrowboundindexbyid(rowid)
				await guardarFila(rowindex, rowdata)
				// synchronize with the server - send update command
				// call commit with parameter true if the synchronization with the server is successful
				// and with parameter false if the synchronization failder.
				commit(true)
			},
			deleterow: async (rowid, commit) => {
				// synchronize with the server - send delete command
				// call commit with parameter true if the synchronization with the server was successful
				// and with parameter false if the synchronization has failed.
				const rowindex = gridRef.current.getrowboundindexbyid(rowid)
				const id = gridRef.current.getrowdata(rowindex).id
				const { success, error } = await deleteAsistencia(id)
				if (!success) {
					setAlertType('error')
					setMessage(`Error al eliminar registro: ${error}`)
					setShowAlert(true)
					commit(false)
					return
				}
				setAlertType('success')
				setMessage('Registro eliminado correctamente')
				setShowAlert(true)

				commit(true)
			}
		})
	}, [datos, guardarFila])

	// --- Toolbar actions
	const agregarRegistro = () => {
		const id = Math.random().toString(36).substring(2, 9)
		const newRow = {
			id,
			fecha: new Date(),
			tipo_asistencia: '',
			asistentes: 0,
			notas: '',
			isNew: true
		}
		gridRef.current.addrow(id, newRow)
		gridRef.current.ensurerowvisible(dataAdapter.records.length - 1)
	}

	const confirmarEliminar = () => {
		const index = gridRef.current.getselectedrowindex()
		if (index >= 0) {
			setAlertType('confirm')
			setMessage('¿Deseas eliminar este registro?')
			setShowAlert(true)
		} else {
			setAlertType('info')
			setMessage('Seleccione una fila para eliminar.')
			setShowAlert(true)
		}
	}

	const eliminarFila = async () => {
		const index = gridRef.current.getselectedrowindex()
		if (index >= 0) gridRef.current.deleterow(gridRef.current.getrowid(index))
	}

	const columnas = [
		{
			text: 'Fecha',
			datafield: 'fecha',
			columntype: 'datetimeinput',
			cellsformat: 'dd/MM/yyyy',
			width: 150,
			editable: true
		},
		{
			text: 'Tipo',
			datafield: 'tipo_asistencia',
			width: 200,
			editable: false
		},
		{
			text: 'Asistencia',
			datafield: 'asistentes',
			columntype: 'numberinput',
			width: 120,
			editable: true
		},
		{
			text: 'Notas',
			datafield: 'notas',
			editable: true
		}
	]

	return (
		<div>
			{/* Toolbar */}
			<ButtonBar
				onAdd={agregarRegistro}
				showDelete={showDelete}
				onDelete={confirmarEliminar}
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
				theme={theme}
				source={dataAdapter}
				columns={columnas}
				pageable={true}
				sortable={true}
				altrows={true}
				editable={true}
				editmode="selectedrow"
				selectionmode="singlerow"
				ready={() => setLoading(false)}
				loading={loading}
				pagesize={10}
				pagesizeoptions={[10, 20, 50, 100]}
				onRowselect={() => setShowDelete(true)}
			/>
		</div>
	)
}
