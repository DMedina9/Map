import { useState, useEffect } from 'react'
import {
	GridRowModes,
	DataGrid,
	GridActionsCellItem,
	GridRowEditStopReasons,
	Toolbar,
	ToolbarButton
} from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import UploadIcon from '@mui/icons-material/UploadFile'
import CancelIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import dayjs from 'dayjs'

const paginationModel = { page: 0, pageSize: 15 }

export function DataTable(props) {
	const { columns, handleEditClick, handleDeleteClick, ...other } = props
	const actionColumn = {
			field: 'actions',
			type: 'actions',
			headerName: 'Acciones',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						key={0}
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={() => handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						key={1}
						icon={<DeleteIcon />}
						label="Delete"
						onClick={() => handleDeleteClick(id)}
						color="inherit"
					/>
				]
			}
		}
	return (
		<Paper sx={{ height: 400, width: '100%' }}>
			<DataGrid
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10, 15, 50, 100]}
				sx={{ border: 0 }}
				columns={[...columns, actionColumn]} // ✅ Agrega acciones al final
				{...other}
			/>
		</Paper>
	)
}

// --- Diálogo de confirmación
function ConfirmationDialogRaw({ onClose, open }) {
	const handleCancel = () => onClose(null)
	const handleOk = () => onClose(true)

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
			maxWidth="xs"
			open={open}
		>
			<DialogTitle>Eliminar registro</DialogTitle>
			<DialogContent dividers>¿Estás seguro que deseas eliminar el registro?</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel}>
					Cancelar
				</Button>
				<Button onClick={handleOk}>Aceptar</Button>
			</DialogActions>
		</Dialog>
	)
}

// --- Toolbar personalizada
function EditToolbar({ setRows, setRowModesModel, handleImportClick }) {
	const handleClick = () => {
		const id = Math.random().toString(36).substr(2, 9)
		setRows((oldRows) => [
			...oldRows,
			{ id, isNew: true, fecha: dayjs().$d, tipo_asistencia: '', asistentes: 0, notas: '' }
		])
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'fecha' }
		}))
	}

	return (
		<Toolbar>
			{handleImportClick && (
				<Tooltip title="Importar registros">
					<ToolbarButton color="primary" onClick={handleImportClick}>
						<UploadIcon />
					</ToolbarButton>
				</Tooltip>
			)}
			<Tooltip title="Agregar registro">
				<ToolbarButton color="primary" onClick={handleClick}>
					<AddIcon />
				</ToolbarButton>
			</Tooltip>
		</Toolbar>
	)
}

// --- Tabla editable genérica
export function DataTableEdit({
	columns,
	handleSaveClick: handleSaveClickProp,
	handleDeleteClick: handleDeleteClickProp,
	handleImportClick,
	rows: initialRows,
	loading
}) {
	const [rows, setRows] = useState(initialRows)
	const [rowModesModel, setRowModesModel] = useState({})
	const [open, setOpen] = useState(false)
	const [deleteId, setDeleteId] = useState(null)

	useEffect(() => {
		setRows(initialRows)
	}, [initialRows])

	const handleRowEditStop = (params, event) => {
		console.log(params, event)
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true
		}
	}

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
	}

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
	}

	const handleDeleteClick = (id) => () => {
		setDeleteId(id)
		setOpen(true)
	}

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true }
		})
		const editedRow = rows.find((row) => row.id === id)
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id))
		}
	}

	const processRowUpdate = (newRow) => {
		const updatedRow = { ...newRow, isNew: false }
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
		if (handleSaveClickProp) {
			const saveData = async () => {
				const newRows = await handleSaveClickProp(newRow)
				if (newRows) setRows(newRows)
			}
			saveData()
		}
		return updatedRow
	}

	const handleRowModesModelChange = (newModel) => {
		setRowModesModel(newModel)
	}

	const actionColumn = {
		field: 'actions',
		type: 'actions',
		headerName: 'Acciones',
		width: 120,
		getActions: ({ id }) => {
			const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
			if (isInEditMode) {
				return [
					<GridActionsCellItem
						key="save"
						icon={<SaveIcon />}
						label="Guardar"
						onClick={handleSaveClick(id)}
						color="primary"
					/>,
					<GridActionsCellItem
						key="cancel"
						icon={<CancelIcon />}
						label="Cancelar"
						onClick={handleCancelClick(id)}
						color="inherit"
					/>
				]
			}
			return [
				<GridActionsCellItem
					key="edit"
					icon={<EditIcon />}
					label="Editar"
					onClick={handleEditClick(id)}
					color="inherit"
				/>,
				<GridActionsCellItem
					key="delete"
					icon={<DeleteIcon />}
					label="Eliminar"
					onClick={handleDeleteClick(id)}
					color="error"
				/>
			]
		}
	}

	return (
		<Box sx={{ height: 500, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={[...columns, actionColumn]} // ✅ Agrega acciones al final
				loading={loading}
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				slots={{ toolbar: EditToolbar }}
				slotProps={{ toolbar: { setRows, setRowModesModel, handleImportClick } }}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10, 15, 50, 100]}
				showToolbar
			/>
			<ConfirmationDialogRaw
				open={open}
				onClose={(confirm) => {
					setOpen(false)
					if (confirm && deleteId)
						handleDeleteClickProp && handleDeleteClickProp(deleteId)
				}}
			/>
		</Box>
	)
}
