import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'
const ButtonBar = ({ title, editandoId, onSave, onCancel, onAdd, onDelete, onImport }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-9 gap-4 p-4 mb-4 border-b">
			<div
				className={
					!editandoId
						? onImport
							? 'col-span-7'
							: 'col-span-8'
						: editandoId > 0
							? 'col-span-6'
							: 'col-span-7'
				}
			>
				<h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
			</div>
			{!editandoId ? (
				<>
					{onImport && (
						<Button
							variant="contained"
							startIcon={<CloudUploadIcon />}
							onClick={onImport}
						>
							Importar
						</Button>
					)}
					<Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
						Agregar
					</Button>
				</>
			) : (
				<>
					<Button
						variant="contained"
						startIcon={<SaveIcon />}
						onClick={onSave}
					>
						{editandoId > 0 ? 'Guardar' : 'Agregar'}
					</Button>
					{editandoId > 0 && (
						<Button
							variant="outlined"
							startIcon={<DeleteIcon />}
							onClick={onDelete}
						>
							Eliminar
						</Button>
					)}
					<Button
						variant="contained"
						startIcon={<CancelIcon />}
						onClick={onCancel}
					>
						Cancelar
					</Button>
				</>
			)}
		</div>
	)
}
ButtonBar.propTypes = {
	title: PropTypes.string.isRequired,
	editandoId: PropTypes.number,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onAdd: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onImport: PropTypes.func
}

export default ButtonBar
