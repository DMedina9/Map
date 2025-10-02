import { useState, useEffect } from 'react'
import { DataFieldSelect } from './../utils/DataFields'

const fetchS3 = async (filtro) => await window.api.invoke('get-S3', filtro)

export default function S3() {
	// Estado para los datos, filtro, edición y formulario
	const initialYear = new Date().getFullYear()
	const [datos, setDatos] = useState([])
	const [filtro, setFiltro] = useState(initialYear)

	// Carga los datos al montar el componente
	useEffect(() => {
		cargarS3(initialYear)
	}, [])

	// Maneja el cambio del filtro de busqueda
	const manejarFiltro = (e) => {
		setFiltro(e.target.value)
		cargarS3(e.target.value)
	}

	// Cargar asistencias desde la base de datos
	const cargarS3 = async (filtro) => {
		const { success, data } = await fetchS3(filtro)
		setDatos(success ? data : [])
	}

	return (
		<div className="m-4 p-6 bg-white rounded shadow-2xl w-full mx-auto">
			<div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-4 border-b">
					<h1 className="text-2xl font-bold mb-4 text-gray-800 col-span-3">
						S-3 - Asistencia a las Reuniones
					</h1>
					<DataFieldSelect
						desc="Año de servicio"
						name="anio"
						form={{ anio: filtro }}
						handleChange={manejarFiltro}
					>
						<option value="">Seleccione año</option>
						{[initialYear - 2, initialYear - 1, initialYear, initialYear + 1].map(
							(year) => (
								<option key={year} value={year}>
									{year}
								</option>
							)
						)}
					</DataFieldSelect>
				</div>
				<div className="max-h-96 overflow-y-auto rounded-lg border shadow-md">
					<table className="w-full table-auto border-collapse">
						<thead className="sticky top-0 bg-white">
							<tr className="bg-gray-100">
								<th className="px-4 py-2 text-left"></th>
								<th className="px-4 py-2 text-left" colSpan={5}>
									Reunión de entresemana
								</th>
								<th className="px-4 py-2 text-left" colSpan={5}>
									Reunión del fin de semana
								</th>
							</tr>
							<tr className="bg-gray-100">
								<th className="px-4 py-2 text-left">Mes</th>
								<th className="px-4 py-2 text-left">Primera Semana</th>
								<th className="px-4 py-2 text-left">Segunda Semana</th>
								<th className="px-4 py-2 text-left">Tercera Semana</th>
								<th className="px-4 py-2 text-left">Cuarta Semana</th>
								<th className="px-4 py-2 text-left">Quinta Semana</th>
								<th className="px-4 py-2 text-left">Primera Semana</th>
								<th className="px-4 py-2 text-left">Segunda Semana</th>
								<th className="px-4 py-2 text-left">Tercera Semana</th>
								<th className="px-4 py-2 text-left">Cuarta Semana</th>
								<th className="px-4 py-2 text-left">Quinta Semana</th>
							</tr>
						</thead>
						<tbody>
							{datos.length > 0 ? (
								datos.map((item) => (
									<tr
										key={item.id}
										className={
											'border-b' +
											(item.id % 2 === 0 ? ' bg-gray-50' : ' bg-white')
										}
									>
										<td className="px-4 py-2">{item.mes}</td>
										<td className="px-4 py-2">{item.es_semana_1}</td>
										<td className="px-4 py-2">{item.es_semana_2}</td>
										<td className="px-4 py-2">{item.es_semana_3}</td>
										<td className="px-4 py-2">{item.es_semana_4}</td>
										<td className="px-4 py-2">{item.es_semana_5}</td>
										<td className="px-4 py-2">{item.fs_semana_1}</td>
										<td className="px-4 py-2">{item.fs_semana_2}</td>
										<td className="px-4 py-2">{item.fs_semana_3}</td>
										<td className="px-4 py-2">{item.fs_semana_4}</td>
										<td className="px-4 py-2">{item.fs_semana_5}</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="11" className="text-center py-4 text-gray-500">
										No hay asistencias registradas.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
