import React, { useRef, useEffect } from 'react'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

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
			width={400}
			height={200}
			isModal={true}
			resizable={false}
			draggable={false}
			autoOpen={false}
			theme="material"
			title={titleMap[type]}
		>
			<div className="flex flex-col justify-between h-full p-4">
				<p className="text-gray-700 text-center" style={{ color: colorMap[type] }}>
					{message}
				</p>
				<div className="flex justify-center gap-4 mt-4">
					{type === 'confirm' ? (
						<>
							<JqxButton onClick={onConfirm}>Aceptar</JqxButton>
							<JqxButton onClick={onCancel}>Cancelar</JqxButton>
						</>
					) : (
						<JqxButton onClick={onCancel}>Cerrar</JqxButton>
					)}
				</div>
			</div>
		</JqxWindow>
	)
}
