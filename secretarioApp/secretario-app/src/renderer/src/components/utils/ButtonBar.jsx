import PropTypes from 'prop-types'

const ButtonBar = ({ title, editandoId, onSave, onCancel, onAdd, onDelete, onImport }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-9 gap-4 p-4 mb-4 border-b">
			<div
				className={
					!editandoId ? (onImport ? 'col-span-7' : 'col-span-8') : editandoId > 0 ? 'col-span-6' : 'col-span-7'
				}
			>
				<h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
			</div>
			{!editandoId ? (
				<>
					{onImport && (<button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={onImport}
					>
						Importar
					</button>)}
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={onAdd}
					>
						Agregar
					</button>
				</>
			) : (
				<>
					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 align-middle align-self-end flex-1"
						onClick={onSave}
					>
						{editandoId > 0 ? 'Guardar' : 'Agregar'}
					</button>
					{editandoId > 0 && (
						<button
							type="button"
							onClick={onDelete}
							className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 align-middle align-self-end flex-1"
						>
							Eliminar
						</button>
					)}
					<button
						type="button"
						className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 align-middle align-self-end flex-1"
						onClick={onCancel}
					>
						Cancelar
					</button>
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
