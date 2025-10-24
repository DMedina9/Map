import { useRef, useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxMenu from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxmenu'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

import Publicadores from './Catalogos/Publicadores'
import Informes from './Catalogos/Informes'
import Asistencias from './Catalogos/Asistencias'
import S1 from './Reportes/S1'
import S3 from './Reportes/S3'
import S21 from './Reportes/S21'
import S88 from './Reportes/S88'
import ImportGrid from './Importar'

function MainMenu() {
	const menuRef = useRef(null)
	const [title, setTitle] = useState('Secretario de Congregación')
	const navigate = useNavigate()

	useEffect(() => {
		if (menuRef.current) {
			menuRef.current.setOptions({
				theme: 'material-purple',
				width: '100%',
				mode: 'horizontal',
				height: 35
			})
		}
	}, [])

	const handleMenuClick = (event) => {
		const text = event.args.textContent.trim()
		const map = {
			Inicio: '/',
			Publicadores: '/catalogos/publicadores',
			Informes: '/catalogos/informes',
			Asistencias: '/catalogos/asistencias',
			'S-1': '/reportes/S1',
			'S-3': '/reportes/S3',
			'S-21': '/reportes/S21',
			'S-88': '/reportes/S88'
		}

		if (map[text]) {
			setTitle(`Secretario de Congregación — ${text}`)
			navigate(map[text])
		}
	}

	return (
		<>
			{/* Barra superior */}
			<div className="shadow-md">
				<JqxMenu ref={menuRef} theme="material" onItemclick={handleMenuClick}>
					<ul>
						<li>Inicio</li>
						<li>
							Catálogos
							<ul>
								<li>Publicadores</li>
								<li>Informes</li>
								<li>Asistencias</li>
							</ul>
						</li>
						<li>
							Reportes
							<ul>
								<li>S-1</li>
								<li>S-3</li>
								<li>S-21</li>
								<li>S-88</li>
							</ul>
						</li>
					</ul>
				</JqxMenu>
			</div>

			{/* Título dinámico */}
			<div className="p-4 bg-blue-100 border-b border-blue-200 text-lg font-semibold text-gray-700">
				{title}
			</div>

			{/* Contenido */}
			<div className="p-4">
				<Routes>
					<Route path="/" element={<ImportGrid />} />
					<Route path="/catalogos/publicadores" element={<Publicadores />} />
					<Route path="/catalogos/informes" element={<Informes />} />
					<Route path="/catalogos/asistencias" element={<Asistencias />} />
					<Route path="/reportes/S1" element={<S1 />} />
					<Route path="/reportes/S3" element={<S3 />} />
					<Route path="/reportes/S21" element={<S21 />} />
					<Route path="/reportes/S88" element={<S88 />} />
				</Routes>
			</div>
		</>
	)
}

export default MainMenu
