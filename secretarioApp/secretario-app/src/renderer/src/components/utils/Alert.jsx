import PropTypes from 'prop-types'

const Alert = ({
	type = 'info', // "info", "success", "warning", "error", "confirm"
	message,
	onConfirm,
	onCancel,
	show = false
}) => {
	if (!show) return null

	const typeStyles = {
		info: 'bg-blue-100 border-blue-500 text-blue-700',
		success: 'bg-green-100 border-green-500 text-green-700',
		warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
		error: 'bg-red-100 border-red-500 text-red-700',
		confirm: 'bg-gray-100 border-gray-500 text-gray-700'
	}

	return (
		<div className={`fixed inset-0 flex items-center justify-center z-50`}>
			<div className="absolute inset-0 bg-black opacity-30"></div>
			<div
				className={`relative px-6 py-4 rounded shadow-lg border ${typeStyles[type]} min-w-[300px]`}
			>
				<span className="block mb-4">{message}</span>
				{type === 'confirm' ? (
					<div className="flex justify-end space-x-2">
						<button
							className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
							onClick={onCancel}
						>
							Cancelar
						</button>
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							onClick={onConfirm}
						>
							Confirmar
						</button>
					</div>
				) : (
					<div className="flex justify-end">
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							onClick={onCancel}
						>
							Cerrar
						</button>
					</div>
				)}
			</div>
		</div>
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
