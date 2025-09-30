import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logo from './../assets/logo.png'

// Componentes de ejemplo (puedes reemplazarlos por tus propios componentes)
import Publicadores from './Publicadores'
import Informes from './Informes'
import Asistencias from './Asistencias'
import Reportes from './Reportes'

const Menu = () => (
	<>
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<img src={logo} alt="Secretario Logo" className="w-14 h-14" />
				{/*<a href="#" className="text-white text-xl font-bold">
					Secretario
				</a>*/}
				<button
					id="menu-btn"
					className="block md:hidden text-white focus:outline-none"
					onClick={() => {
						const menu = document.getElementById('menu')
						menu.classList.toggle('hidden')
					}}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16m-7 6h7"
						/>
					</svg>
				</button>

				<div id="menu" className="hidden md:flex space-x-4">
					<Link to="/publicadores" className="text-white hover:text-gray-400">
						Publicadores
					</Link>
					<Link to="/informes" className="text-white hover:text-gray-400">
						Informes
					</Link>
					<Link to="/asistencias" className="text-white hover:text-gray-400">
						Asistencias
					</Link>
					<Link to="/reportes" className="text-white hover:text-gray-400">
						Reportes
					</Link>
				</div>
			</div>
		</nav>
		<Routes>
			<Route path="/publicadores" element={<Publicadores />} />
			<Route path="/informes" element={<Informes />} />
			<Route path="/asistencias" element={<Asistencias />} />
			<Route path="/reportes" element={<Reportes />} />
		</Routes>
	</>
)

export default Menu
