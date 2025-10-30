import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import UploadFile from '@mui/icons-material/UploadFile'
import AcceptIcon from '@mui/icons-material/CheckRounded'
import CloseIcon from '@mui/icons-material/CloseRounded'

export default function ButtonBar({
	type,
	editando,
	showDelete,
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
			) : editando ? (
				<>
					<JqxButton ref={saveBtn} onClick={onSave} theme="material">
						<SaveIcon /> Guardar
					</JqxButton>
					<JqxButton ref={cancelBtn} onClick={onCancel} theme="material">
						<CloseIcon /> Cancelar
					</JqxButton>
				</>
			) : (
				<>
					{onSave && (
						<JqxButton ref={saveBtn} onClick={onSave} theme="material">
							<SaveIcon /> Guardar
						</JqxButton>
					)}
					{onAdd && (
						<JqxButton ref={addBtn} onClick={onAdd} theme="material">
							<AddIcon /> Agregar
						</JqxButton>
					)}
					{showDelete && onDelete && (
						<JqxButton ref={deleteBtn} onClick={onDelete} theme="material">
							<DeleteIcon /> Eliminar
						</JqxButton>
					)}
					{onImport && (
						<JqxButton ref={importBtn} onClick={onImport} theme="material">
							<UploadFile /> Importar
						</JqxButton>
					)}
				</>
			)}
		</div>
	)
}

ButtonBar.propTypes = {
	type: PropTypes.oneOf([null, 'info', 'success', 'warning', 'error', 'confirm']),
	editando: PropTypes.bool,
	showDelete: PropTypes.bool,
	onConfirm: PropTypes.func,
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
	onAdd: PropTypes.func,
	onDelete: PropTypes.func,
	onImport: PropTypes.func
}
ButtonBar.defaultProps = {
	type: null,
	editando: false,
	showDelete: false,
	onConfirm: () => {},
	onSave: () => {},
	onCancel: () => {},
	onAdd: () => {},
	onDelete: () => {},
	onImport: () => {}
}
