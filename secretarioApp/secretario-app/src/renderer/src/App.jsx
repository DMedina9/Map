import Menu from './components/Menu'
import TitleBar from './components/TitleBar'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es-mx'
import dayjs from 'dayjs'
window.mesInforme = await window.api.invoke('get-mes-informe')
window.mesInforme = dayjs(window.mesInforme).locale('es-mx').toDate()

function App() {
	//const ipcHandle = () => window.electron.ipcRenderer.send('ping')
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
			<BrowserRouter>
				<TitleBar title="Secretario de Congregación" />
				<Menu />
			</BrowserRouter>
		</LocalizationProvider>
	)
}

export default App

