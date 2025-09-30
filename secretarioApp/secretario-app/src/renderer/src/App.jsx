import Menu from './components/Menu'

import { BrowserRouter } from 'react-router-dom'

function App() {
	//const ipcHandle = () => window.electron.ipcRenderer.send('ping')
	return (
		<BrowserRouter>
				<Menu />
		</BrowserRouter>
	)
}

export default App