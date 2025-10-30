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
	const data = [
		{ id: '1', text: 'Inicio', value: '/' },
		{
			id: '2',
			text: 'Catalogos'
		},
		{
			id: '3',
			text: 'Cargas'
		},
		{
			id: '4',
			text: 'Reportes'
		},
		{
			id: '21',
			text: 'Publicadores',
			parentid: '2',
			value: '/catalogos/publicadores'
		},
		{
			id: '22',
			text: 'Informes',
			parentid: '2',
			value: '/catalogos/informes'
		},
		{
			id: '23',
			parentid: '2',
			text: 'Asistencias',
			value: '/catalogos/asistencias'
		},
		{
			id: '31',
			text: 'Publicadores',
			parentid: '3',
			value: '/cargas/publicadores'
		},
		{
			id: '32',
			text: 'Informes',
			parentid: '3',
			value: '/cargas/informes'
		},
		{
			id: '33',
			text: 'Asistencias',
			parentid: '3',
			value: '/cargas/asistencias'
		},
		{
			id: '41',
			text: 'S-1',
			parentid: '4',
			value: '/reportes/S1'
		},
		{
			id: '42',
			text: 'S-3',
			parentid: '4',
			value: '/reportes/S3'
		},
		{
			id: '43',
			text: 'S-21',
			parentid: '4',
			value: '/reportes/S21'
		},
		{
			id: '44',
			text: 'S-88',
			parentid: '4',
			value: '/reportes/S88'
		}
	]
	// prepare the data
	var source = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'parentid' }, { name: 'text' }, { name: 'value' }],
		id: 'id',
		localdata: data
	}
	// create data adapter.
	const dataAdapter = new window.jqx.dataAdapter(source)
	// perform Data Binding.
	dataAdapter.dataBind()
	const records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [
		{ name: 'text', map: 'label' }
	])
	const getTitle = (option) => {
		return (
			(option.parentid
				? getTitle(data.find((item) => item.id == option.parentid)) + ' / '
				: '') + option.text
		)
	}
	const handleMenuClick = (event) => {
		const option = data.find((item) => item.id == event.args.id)
		console.log('Menu item clicked:', option)
		if (option) {
			if (option.value) {
				navigate(option.value)
				setTitle(`Secretario de Congregación — ${getTitle(option)}`)
			}
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
					source={records}
				/>
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
