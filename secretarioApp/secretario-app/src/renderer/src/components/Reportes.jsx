import { Link } from 'react-router-dom'

const Reportes = () => (
	<>
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="hidden md:flex space-x-4">
					<Link to="/reportes/S1" className="text-white hover:text-gray-400">
						S-1
					</Link>
					<Link to="/reportes/S3" className="text-white hover:text-gray-400">
						S-3
					</Link>
					<Link to="/reportes/S88" className="text-white hover:text-gray-400">
						S-88
					</Link>
				</div>
			</div>
		</nav>
	</>
)

export default Reportes
