import { useState, useEffect } from 'react'

// Asume que tienes una función para interactuar con SQLite vía IPC/Electron
// Ejemplo: window.api.invoke(channel, args)
const fetchPublicadores = async () => await window.api.invoke('get-publicadores')

const addPublicador = async (publicador) => await window.api.invoke('add-publicador', publicador)

const updatePublicador = async (id, publicador) =>
	await window.api.invoke('update-publicador', { id, ...publicador })

const deletePublicador = async (id) => await window.api.invoke('delete-publicador', id)

const initialForm = { nombre: '', grupo: '', telefono: '' }

export default function Publicadores() {
	const [publicadores, setPublicadores] = useState([])
	const [form, setForm] = useState(initialForm)
	const [editingId, setEditingId] = useState(null)

	useEffect(() => {
		cargarPublicadores()
	}, [])

	const cargarPublicadores = async () => {
		const { success, data } = await fetchPublicadores()
		setPublicadores(success ? data : [])
	}

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (editingId) {
			await updatePublicador(editingId, form)
		} else {
			await addPublicador(form)
		}
		setForm(initialForm)
		setEditingId(null)
		cargarPublicadores()
	}

	const handleEdit = (pub) => {
		setForm({ ...pub })
		setEditingId(pub.id)
	}

	const handleDelete = async (id) => {
		await deletePublicador(id)
		cargarPublicadores()
	}

	return (
		<div className="p-6 bg-white rounded shadow-md w-full max-w-6xl mx-auto">
			<h2 className="text-2xl font-bold mb-4 text-gray-800">Publicadores</h2>
			<form onSubmit={handleSubmit} className="mb-6 space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextDataField desc="Nombre" name="nombre" form={form} handleChange={handleChange} required={true} />
					<TextDataField desc="Apellidos" name="apellidos" form={form} handleChange={handleChange} required={true} />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Sexo</label>
						<select
							name="sexo"
							value={form.sexo || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
							required
						>
							<option value="">Selecciona</option>
							<option value="H">Masculino</option>
							<option value="M">Femenino</option>
						</select>
					</div>
					<TextDataField desc="Fecha de nacimiento" name="fecha_nacimiento" form={form} handleChange={handleChange} type="date" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Grupo</label>
						<input
							type="number"
							name="grupo"
							value={form.grupo || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
					<TextDataField desc="Fecha de bautismo" name="fecha_bautismo" form={form} handleChange={handleChange} type="date" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Privilegio</label>
						<select
							name="id_privilegio"
							value={form.id_privilegio || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						>
							<option value="">Selecciona</option>
							<option value="1">Anciano</option>
							<option value="2">Siervo ministerial</option>
						</select>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Sup. grupo</label>
						<select
							name="sup_grupo"
							value={form.sup_grupo || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						>
							<option value="">Selecciona</option>
							<option value="1">Superintendente</option>
							<option value="2">Auxiliar</option>
						</select>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Tipo publicador</label>
						<select
							name="id_tipo_publicador"
							value={form.id_tipo_publicador || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						>
							<option value="">Selecciona</option>
							<option value="1">Publicador</option>
							<option value="2">Precursor regular</option>
							<option value="3">Precursor auxiliar</option>
						</select>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
						<label className="block text-gray-700">Ungido</label>
						<input
							type="checkbox"
							name="ungido"
							value={form.ungido}
							onChange={handleChange}
							className="h-4 w-4"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextDataField desc="Calle" name="calle" form={form} handleChange={handleChange} />
					<TextDataField desc="Núm." name="num" form={form} handleChange={handleChange} />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextDataField desc="Colonia" name="colonia" form={form} handleChange={handleChange} />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Teléfono fijo</label>
						<input
							type="tel"
							name="telefono_fijo"
							value={form.telefono_fijo || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Teléfono móvil</label>
						<input
							type="tel"
							name="telefono_movil"
							value={form.telefono_movil || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Contacto de emergencia</label>
						<input
							type="text"
							name="contacto_emergencia"
							value={form.contacto_emergencia || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Tel. contacto de emergencia</label>
						<input
							type="tel"
							name="tel_contacto_emergencia"
							value={form.tel_contacto_emergencia || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block text-gray-700">Correo contacto de emergencia</label>
						<input
							type="email"
							name="correo_contacto_emergencia"
							value={form.correo_contacto_emergencia || ''}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
				</div>
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					{editingId ? 'Actualizar' : 'Agregar'}
				</button>
				{editingId && (
					<button
						type="button"
						className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
						onClick={() => {
							setForm(initialForm)
							setEditingId(null)
						}}
					>
						Cancelar
					</button>
				)}
			</form>
			<table className="w-full table-auto border-collapse">
				<thead>
					<tr className="bg-gray-100">
						<th className="px-4 py-2 text-left">Nombre</th>
						<th className="px-4 py-2 text-left">Grupo</th>
						<th className="px-4 py-2 text-left">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{publicadores.map((pub) => (
						<tr key={pub.id} className="border-b">
							<td className="px-4 py-2">
								{pub.nombre} {pub.apellidos}
							</td>
							<td className="px-4 py-2">{pub.grupo}</td>
							<td className="px-4 py-2 space-x-2">
								<button
									className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
									onClick={() => handleEdit(pub)}
								>
									Editar
								</button>
								<button
									className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
									onClick={() => handleDelete(pub.id)}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
					{publicadores.length === 0 && (
						<tr>
							<td colSpan="4" className="text-center py-4 text-gray-500">
								No hay publicadores registrados.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
function TextDataField(props) {
	let { desc, name, form, handleChange, type, required } = props;
	type = type || 'text';
	required = required || false;
	const value = form[name] || '';
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<label className="block text-gray-700">{desc}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={handleChange}
				className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
				required={required}
			/>
		</div>
	)
}