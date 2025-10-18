import PropTypes from 'prop-types'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Alert as MuiAlert
} from '@mui/material'

const Alert = ({
	type = 'info', // "info", "success", "warning", "error", "confirm"
	message,
	onConfirm,
	onCancel,
	show = false
}) => {
	if (!show) return null

	const isConfirm = type === 'confirm'

	return (
		<Dialog
			open={show}
			onClose={onCancel}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth
			maxWidth="xs"
		>
			{/* Título dinámico */}
			<DialogTitle id="alert-dialog-title">
				{isConfirm
					? 'Confirmar acción'
					: type === 'error'
						? 'Error'
						: type === 'success'
							? 'Éxito'
							: type === 'warning'
								? 'Advertencia'
								: 'Mensaje'}
			</DialogTitle>

			{/* Cuerpo del mensaje */}
			<DialogContent>
				<MuiAlert severity={isConfirm ? 'info' : type} variant="outlined">
					{message}
				</MuiAlert>
			</DialogContent>

			{/* Botones */}
			<DialogActions>
				{isConfirm ? (
					<>
						<Button onClick={onCancel} color="inherit" variant="outlined">
							Cancelar
						</Button>
						<Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
							Confirmar
						</Button>
					</>
				) : (
					<Button onClick={onCancel} color="primary" variant="contained" autoFocus>
						Cerrar
					</Button>
				)}
			</DialogActions>
		</Dialog>
	)
}
Alert.propTypes = {
	type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'confirm']),
	message: PropTypes.string.isRequired,
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func,
	show: PropTypes.bool
}

export default Alert
