import { Routes, Route, Link } from 'react-router-dom'
import logo from './../assets/logo.png'
import Publicadores from './Publicadores'
import Informes from './Informes'
import Asistencias from './Asistencias'
import S1 from './Reportes/S1'
import S3 from './Reportes/S3'
import S21 from './Reportes/S21'
import S88 from './Reportes/S88'

const Menu = () => (
	<>
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<img src={logo} alt="Secretario Logo" className="w-14 h-14" />
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
					<ul className="flex space-x-4">
						<li>
							<Link to="/" className="text-white hover:text-gray-400">Inicio</Link>
						</li>
						<li>
							<Link to="/publicadores" className="text-white hover:text-gray-400">
								Publicadores
							</Link>
						</li>
						<li>
							<Link to="/informes" className="text-white hover:text-gray-400">
								Informes
							</Link>
						</li>
						<li>
							<Link to="/asistencias" className="text-white hover:text-gray-400">
								Asistencias
							</Link>
						</li>
						<li className="relative group">
							<button className="text-white hover:text-gray-400">Reportes</button>
							{/* Submenú */}
							<ul className="absolute left-0 pt-2 bg-gray-800 text-white shadow-lg rounded hidden group-hover:block w-20">
								<li>
									<Link to="/reportes/S1" className="block px-4 py-2 hover:bg-gray-200 hover:text-black">
										S-1
									</Link>
								</li>
								<li>
									<Link to="/reportes/S3" className="block px-4 py-2 hover:bg-gray-200 hover:text-black">
										S-3
									</Link>
								</li>
								<li>
									<Link to="/reportes/S21" className="block px-4 py-2 hover:bg-gray-200 hover:text-black">
										S-21
									</Link>
								</li>
								<li>
									<Link to="/reportes/S88" className="block px-4 py-2 hover:bg-gray-200 hover:text-black">
										S-88
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<Routes>
			<Route path="/" element={<Publicadores />} />
			<Route path="/publicadores" element={<Publicadores />} />
			<Route path="/informes" element={<Informes />} />
			<Route path="/asistencias" element={<Asistencias />} />
			<Route path="/reportes/S1" element={<S1 />} />
			<Route path="/reportes/S3" element={<S3 />} />
			<Route path="/reportes/S21" element={<S21 />} />
			<Route path="/reportes/S88" element={<S88 />} />
		</Routes>
	</>
)

export default Menu
