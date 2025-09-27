import Menu from './components/Menu'
import logo from './assets/logo.png'
import { BrowserRouter } from 'react-router-dom'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <BrowserRouter>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <img src={logo} alt="Secretario Logo" className="w-32 h-32 mb-4" />
        
        <Menu className="text-3xl font-bold mb-2" />
      </div>
    </BrowserRouter>
  )
}

export default App
