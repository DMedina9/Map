import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow'
import ButtonBar from './ButtonBar'

export default function Alert({ type = 'info', message, show, onConfirm, onCancel }) {
	const windowRef = useRef(null)

	useEffect(() => {
		if (windowRef.current) {
			if (show) windowRef.current.open()
			else windowRef.current.close()
		}
	}, [show])

	const titleMap = {
		info: 'Información',
		success: 'Éxito',
		warning: 'Advertencia',
		error: 'Error',
		confirm: 'Confirmar acción'
	}

	const colorMap = {
		info: '#2196f3',
		success: '#4caf50',
		warning: '#ff9800',
		error: '#f44336',
		confirm: '#673ab7'
	}

	return (
		<JqxWindow
			ref={windowRef}
			theme="material"
			minWidth={400}
			minHeight={120}
			isModal={true}
			resizable={false}
			draggable={false}
			autoOpen={false}
			title={titleMap[type]}
		>
			<div className="flex flex-col justify-between h-full p-4">
				<p
					className="text-gray-700 text-center"
					style={{ color: colorMap[type], height: '60px' }}
				>
					{message}
				</p>
				<div className="mt-auto flex justify-center">
					<ButtonBar type={type} onConfirm={onConfirm} onCancel={onCancel} />
				</div>
			</div>
		</JqxWindow>
	)
}
Alert.propTypes = {
	type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'confirm']),
	message: PropTypes.string,
	show: PropTypes.bool.isRequired,
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func
}
