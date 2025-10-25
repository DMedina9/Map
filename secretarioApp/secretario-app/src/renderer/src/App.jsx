import Menu from './components/Menu'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es-mx'
import dayjs from 'dayjs'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'

window.mesInforme = await window.api.invoke('get-mes-informe')
window.mesInforme = dayjs(window.mesInforme).locale('es-mx').toDate()

function App() {
	//const ipcHandle = () => window.electron.ipcRenderer.send('ping')
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
			<BrowserRouter>
				<Menu />
			</BrowserRouter>
		</LocalizationProvider>
	)
}

export default App
