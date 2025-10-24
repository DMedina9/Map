import { useRef, useEffect } from 'react'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import UploadFile from '@mui/icons-material/UploadFile'
import AcceptIcon from '@mui/icons-material/CheckRounded'
import CloseIcon from '@mui/icons-material/CloseRounded'

export default function ButtonBar({
	title,
	type,
	loading,
	editandoId,
	onConfirm,
	onSave,
	onCancel,
	onAdd,
	onDelete,
	onImport
}) {
	const acceptBtn = useRef(null)
	const cancelConfBtn = useRef(null)
	const closeBtn = useRef(null)
	const saveBtn = useRef(null)
	const cancelBtn = useRef(null)
	const addBtn = useRef(null)
	const deleteBtn = useRef(null)
	const importBtn = useRef(null)

	useEffect(() => {
		const buttons = [
			acceptBtn.current,
			cancelConfBtn.current,
			closeBtn.current,
			saveBtn.current,
			cancelBtn.current,
			addBtn.current,
			deleteBtn.current,
			importBtn.current
		]
		buttons.forEach(
			(btn) =>
				btn &&
				btn.setOptions({
					theme: 'material',
					width: 120,
					height: 25
				})
		)
	}, [])

	return (
		<div className="flex items-end mb-4 gap-2">
			{type ? (
				type === 'confirm' ? (
					<>
						<JqxButton ref={cancelConfBtn} theme="material" onClick={onCancel}>
							<CloseIcon /> Cancelar
						</JqxButton>
						<JqxButton ref={acceptBtn} theme="material" onClick={onConfirm}>
							<AcceptIcon />
							Aceptar
						</JqxButton>
					</>
				) : (
					<JqxButton ref={closeBtn} theme="material" onClick={onCancel}>
						<CloseIcon />
						Cerrar
					</JqxButton>
				)
			) : editandoId ? (
				<>
					<JqxButton ref={saveBtn} onClick={onSave}>
						<SaveIcon /> Guardar
					</JqxButton>
					<JqxButton ref={cancelBtn} onClick={onCancel}>
						<CloseIcon /> Cancelar
					</JqxButton>
				</>
			) : (
				<>
					<JqxButton ref={addBtn} onClick={onAdd}>
						<AddIcon /> Agregar
					</JqxButton>
					<JqxButton ref={deleteBtn} onClick={onDelete} disabled={loading}>
						<DeleteIcon /> Eliminar
					</JqxButton>
					<JqxButton ref={importBtn} onClick={onImport} disabled={loading}>
						<UploadFile /> Importar
					</JqxButton>
				</>
			)}
		</div>
	)
}

