import { useRef, useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import TitleBar from './TitleBar'
import JqxMenu from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxmenu'

import CargaPublicadores from './Menu/Cargas/Publicadores'
import CargaInformes from './Menu/Cargas/Informes'
import CargaAsistencias from './Menu/Cargas/Asistencias'
import Publicadores from './Menu/Catalogos/Publicadores'
import Informes from './Menu/Catalogos/Informes'
import Asistencias from './Menu/Catalogos/Asistencias'
import S1 from './Menu/Reportes/S1'
import S3 from './Menu/Reportes/S3'
import S21 from './Menu/Reportes/S21'
import S88 from './Menu/Reportes/S88'
import Portada from './Menu/Portada'

export default function MainMenu() {
	const menuRef = useRef(null)
	const navigate = useNavigate()
	const [title, setTitle] = useState('Secretario de Congregación')

	useEffect(() => {
		if (menuRef.current) {
			menuRef.current.setOptions({
				theme: 'material',
				width: '100%',
				height: 40,
				mode: 'horizontal'
			})
		}
	}, [])

	const handleMenuClick = (event) => {
		const text = event.args.textContent.trim()
		const key = event.args.attributes.value.nodeValue || key
		console.log(key)
		const map = {
			Inicio: '/',
			'Cat-Publicadores': '/catalogos/publicadores',
			'Cat-Informes': '/catalogos/informes',
			'Cat-Asistencias': '/catalogos/asistencias',
			'Carga-Publicadores': '/cargas/publicadores',
			'Carga-Informes': '/cargas/informes',
			'Carga-Asistencias': '/cargas/asistencias',
			'S-1': '/reportes/S1',
			'S-3': '/reportes/S3',
			'S-21': '/reportes/S21',
			'S-88': '/reportes/S88'
		}

		if (map[key]) {
			setTitle(`Secretario de Congregación — ${text}`)
			navigate(map[key])
		}
	}

	return (
		<>
			{/* Menú horizontal fijo arriba */}
			<div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
				<TitleBar title={title} />
				<JqxMenu
					ref={menuRef}
					theme="material"
					keyboardNavigation={true}
					onItemclick={handleMenuClick}
				>
					<ul>
						<li>Inicio</li>
						<li>
							Catálogos
							<ul>
								<li value={"Cat-Publicadores"}>Publicadores</li>
								<li value={"Cat-Informes"}>Informes</li>
								<li value={"Cat-Asistencias"}>Asistencias</li>
							</ul>
						</li>
						<li>
							Cargas
							<ul>
								<li value={"Carga-Publicadores"}>Publicadores</li>
								<li value={"Carga-Informes"}>Informes</li>
								<li value={"Carga-Asistencias"}>Asistencias</li>
							</ul>
						</li>
						<li>
							Reportes
							<ul>
								<li value={"S-1"}>S-1</li>
								<li type="separator"></li>
								<li value={"S-3"}>S-3</li>
								<li value={"S-21"}>S-21</li>
								<li value={"S-88"}>S-88</li>
							</ul>
						</li>
					</ul>
				</JqxMenu>
			</div>

			{/* Espaciado para no tapar contenido con el menú fijo */}
			<div style={{ height: 78 }} />

			{/* Contenido */}
			<div style={{ margin: '0px', overflow: 'auto', height: 'calc(100vh - 98px)' }}>
				<Routes>
					<Route path="/" element={<Portada />} />
					<Route path="/catalogos/publicadores" element={<Publicadores />} />
					<Route path="/catalogos/informes" element={<Informes />} />
					<Route path="/catalogos/asistencias" element={<Asistencias />} />
					<Route path="/cargas/publicadores" element={<CargaPublicadores />} />
					<Route path="/cargas/informes" element={<CargaInformes />} />
					<Route path="/cargas/asistencias" element={<CargaAsistencias />} />
					<Route path="/reportes/S1" element={<S1 />} />
					<Route path="/reportes/S3" element={<S3 />} />
					<Route path="/reportes/S21" element={<S21 />} />
					<Route path="/reportes/S88" element={<S88 />} />
				</Routes>
			</div>
		</>
	)
}
