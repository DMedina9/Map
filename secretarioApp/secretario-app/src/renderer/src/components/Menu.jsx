import { Routes, Route, Link } from 'react-router-dom'
//import logo from './../assets/logo.png'
import Publicadores from './Catalogos/Publicadores'
import Informes from './Catalogos/Informes'
import Asistencias from './Catalogos/Asistencias'
import S1 from './Reportes/S1'
import S3 from './Reportes/S3'
import S21 from './Reportes/S21'
import S88 from './Reportes/S88'
import ImportGrid from './Importar'
import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'

function MainMenu() {
	const [anchorEl, setAnchorEl] = useState(null)
	const [subAnchorEl, setSubAnchorEl] = useState(null)
	const [subMenuId, setSubMenuId] = useState(null)
	const handleOpenMain = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleCloseMain = () => {
		setAnchorEl(null)
		setSubAnchorEl(null) // Close sub-menu when main menu closes
	}

	const handleOpenSub = (event) => {
		setSubMenuId(event.target.ariaControlsElements[0].id)
		setSubAnchorEl(event.currentTarget)
	}

	const handleCloseSub = () => {
		setAnchorEl(null)
		setSubAnchorEl(null)
	}

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						aria-controls="main-menu"
						aria-haspopup="true"
						onClick={handleOpenMain}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						id="main-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleCloseMain}
					>
						<MenuItem onClick={handleCloseMain}>
							<Link to="/">Inicio</Link>
						</MenuItem>
						<MenuItem
							aria-controls="sub-menu-catalogos"
							aria-haspopup="true"
							onClick={handleOpenSub}
						>
							Catálogos{' '}
							<KeyboardArrowRightIcon style={{ marginLeft: 'auto', fontSize: 16 }} />
						</MenuItem>
						<Menu
							id="sub-menu-catalogos"
							anchorEl={subAnchorEl}
							keepMounted
							open={Boolean(subAnchorEl) && subMenuId == 'sub-menu-catalogos'}
							onClose={handleCloseSub}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left'
							}}
						>
							<MenuItem onClick={handleCloseMain}>
								<Link to="/catalogos/publicadores">Publicadores</Link>
							</MenuItem>
							<MenuItem onClick={handleCloseMain}>
								<Link to="/catalogos/informes">Informes</Link>
							</MenuItem>
							<MenuItem onClick={handleCloseMain}>
								{' '}
								<Link to="/catalogos/asistencias">Asistencias</Link>
							</MenuItem>
						</Menu>
						<MenuItem
							aria-controls="sub-menu-reportes"
							aria-haspopup="true"
							onClick={handleOpenSub}
						>
							Reportes{' '}
							<KeyboardArrowRightIcon style={{ marginLeft: 'auto', fontSize: 16 }} />
						</MenuItem>
						<Menu
							id="sub-menu-reportes"
							anchorEl={subAnchorEl}
							keepMounted
							open={Boolean(subAnchorEl) && subMenuId == 'sub-menu-reportes'}
							onClose={handleCloseSub}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left'
							}}
						>
							<MenuItem onClick={handleCloseMain}>
								<Link to="/reportes/S1">S-1</Link>
							</MenuItem>
							<MenuItem onClick={handleCloseMain}>
								{' '}
								<Link to="/reportes/S3">S-3</Link>
							</MenuItem>
							<MenuItem onClick={handleCloseMain}>
								<Link to="/reportes/S21">S-21</Link>
							</MenuItem>
							<MenuItem onClick={handleCloseMain}>
								<Link to="/reportes/S88">S-88</Link>
							</MenuItem>
						</Menu>
					</Menu>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Secretario de Congregación
					</Typography>
				</Toolbar>
			</AppBar>
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
		</>
	)
}

export default MainMenu
