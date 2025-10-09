import Menu from './components/Menu'
import { BrowserRouter } from 'react-router-dom'

window.mesInforme = await window.api.invoke('get-mes-informe')

function App() {
	//const ipcHandle = () => window.electron.ipcRenderer.send('ping')
	return (
		<BrowserRouter>
			<Menu />
		</BrowserRouter>
	)
}

export default App