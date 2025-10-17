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
import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'

const paginationModel = { page: 0, pageSize: 15 }

export function DataTable(props) {
	const { columns, handleEditClick, handleDeleteClick, ...other } = props
	if (columns && !columns.find((item) => item.field == 'actions'))
		columns.push({
			field: 'actions',
			type: 'actions',
			headerName: 'Acciones',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={() => handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={() => handleDeleteClick(id)}
						color="inherit"
					/>
				]
			}
		})
	return (
		<Paper sx={{ height: 400, width: '100%' }}>
			<DataGrid
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10, 15, 50, 100]}
				sx={{ border: 0 }}
				columns={columns}
				{...other}
			/>
		</Paper>
	)
}

function EditToolbar({ rowCount, setRows, setRowModesModel }) {
	const handleClick = () => {
		const id = -rowCount
		setRows((oldRows) => [...oldRows, { id, isNew: true }])
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit /*, fieldToFocus: 'name'*/ }
		}))
	}

	return (
		<Toolbar>
			<Tooltip title="Add record">
				<ToolbarButton onClick={handleClick}>
					<AddIcon fontSize="small" />
				</ToolbarButton>
			</Tooltip>
		</Toolbar>
	)
}
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'

/*export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}
*/
function ConfirmationDialogRaw(props) {
	const { onClose, value: valueProp, open, ...other } = props
	const [value, setValue] = React.useState(valueProp)

	React.useEffect(() => {
		if (!open) {
			setValue(valueProp)
		}
	}, [valueProp, open])

	const handleCancel = () => {
		onClose && onClose(null)
	}

	const handleOk = () => {
		onClose && onClose(value)
	}

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
			maxWidth="xs"
			open={open}
			{...other}
		>
			<DialogTitle>Eliminar registro</DialogTitle>
			<DialogContent dividers>
				<DialogContentText id="alert-dialog-description">
					¿Estás seguro que deseas eliminar el registro?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel}>
					Cancel
				</Button>
				<Button onClick={handleOk}>Ok</Button>
			</DialogActions>
		</Dialog>
	)
}

export function DataTableEdit(props) {
	const {
		columns,
		handleSaveClick: handleSaveClickProp,
		handleDeleteClick: handleDeleteClickProp,
		...other
	} = props
	if (columns && !columns.find((item) => item.field == 'actions'))
		columns.push({
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							key={0}
							icon={<SaveIcon />}
							label="Save"
							material={{
								sx: {
									color: 'primary.main'
								}
							}}
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							key={1}
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>
					]
				}

				return [
					<GridActionsCellItem
						key={2}
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						key={3}
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>
				]
			}
		})

	const [rows, setRows] = React.useState([])
	const [rowModesModel, setRowModesModel] = React.useState({})
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState(null)

	const handleClose = (id) => {
		setOpen(false)

		setValue(id)
		if (id) {
			handleDeleteClickProp && handleDeleteClickProp(id)
		}
	}
	const handleRowEditStop = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true
		}
	}

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
	}

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
		handleSaveClickProp && handleSaveClickProp(id)
	}

	const handleDeleteClick = (id) => () => {
		setValue(id)
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
		return updatedRow
	}

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel)
	}

	return (
		<Box
			sx={{
				height: 500,
				width: '100%',
				'& .actions': {
					color: 'text.secondary'
				},
				'& .textPrimary': {
					color: 'text.primary'
				}
			}}
		>
			<DataGrid
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				slots={{ toolbar: EditToolbar }}
				slotProps={{
					toolbar: { rowCount: rows.length, setRows, setRowModesModel }
				}}
				showToolbar
				columns={columns}
				{...other}
			/>
			<ConfirmationDialogRaw
				id="confirmation-delete-row"
				keepMounted
				open={open}
				onClose={handleClose}
				value={value}
			/>
			<Button onClick={() => console.log(rows)}>Log</Button>
		</Box>
	)
}

