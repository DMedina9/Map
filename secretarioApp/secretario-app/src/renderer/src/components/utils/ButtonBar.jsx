import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const ButtonBar = ({ title, editandoId, onSave, onCancel, onAdd, onDelete, onImport, loading }) => {
	const theme = useTheme()
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Toolbar>
			<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
				{title}
			</Typography>
			{!editandoId ? (
				<>
					{onImport && (
						<Button sx={{ margin: 1 }}
							variant="contained"
							startIcon={<CloudUploadIcon />}
							onClick={onImport}
							loading={loading}
						>
							{!isSmallScreen && 'Importar'}
						</Button>
					)}
					<Button sx={{ margin: 1 }}
						variant="contained"
						startIcon={<AddIcon />}
						onClick={onAdd}
						loading={loading}
					>
						{!isSmallScreen && 'Agregar'}
					</Button>
				</>
			) : (
				<>
					<Button sx={{ margin: 1 }}
						variant="contained"
						startIcon={<SaveIcon />}
						onClick={onSave}
						loading={loading}
					>
						{isSmallScreen ? '' : editandoId > 0 ? 'Guardar' : 'Agregar'}
					</Button>
					{editandoId > 0 && (
						<Button sx={{ margin: 1 }}
							variant="outlined"
							startIcon={<DeleteIcon />}
							onClick={onDelete}
							loading={loading}
						>
							{!isSmallScreen && 'Eliminar'}
						</Button>
					)}
					<Button sx={{ margin: 1 }}
						variant="contained"
						startIcon={<CancelIcon />}
						onClick={onCancel}
						loading={loading}
					>
						{!isSmallScreen && 'Cancelar'}
					</Button>
				</>
			)}
		</Toolbar>
	)
}
ButtonBar.propTypes = {
	title: PropTypes.string.isRequired,
	editandoId: PropTypes.number,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onAdd: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onImport: PropTypes.func,
	loading: PropTypes.bool
}

export default ButtonBar

