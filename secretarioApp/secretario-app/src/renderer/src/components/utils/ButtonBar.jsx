import { useRef, useEffect } from 'react'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

export default function ButtonBar({
	title,
	loading,
	editandoId,
	onSave,
	onCancel,
	onAdd,
	onDelete,
	onImport
}) {
	const saveBtn = useRef(null)
	const cancelBtn = useRef(null)
	const addBtn = useRef(null)
	const deleteBtn = useRef(null)
	const importBtn = useRef(null)

	useEffect(() => {
		const buttons = [
			saveBtn.current,
			cancelBtn.current,
			addBtn.current,
			deleteBtn.current,
			importBtn.current
		]
		buttons.forEach(
			(btn) => btn && btn.setOptions({ theme: 'material', width: 120, height: 125 })
		)
	}, [])

	return (
		<div className="flex flex-wrap items-center justify-between mb-4">
			<h2 className="text-xl font-semibold text-gray-700">{title}</h2>
			<div className="flex gap-2">
				{editandoId ? (
					<>
						<JqxButton ref={saveBtn} onClick={onSave}>
							💾 Guardar
						</JqxButton>
						<JqxButton ref={cancelBtn} onClick={onCancel}>
							❌ Cancelar
						</JqxButton>
					</>
				) : (
					<>
						<JqxButton ref={addBtn} onClick={onAdd}>
							➕ Agregar
						</JqxButton>
						<JqxButton ref={deleteBtn} onClick={onDelete} disabled={loading}>
							🗑️ Eliminar
						</JqxButton>
						<JqxButton ref={importBtn} onClick={onImport} disabled={loading}>
							⬆️ Importar
						</JqxButton>
					</>
				)}
			</div>
		</div>
	)
}

