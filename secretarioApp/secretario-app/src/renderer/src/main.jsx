import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// --- Renderiza la app ---
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>
)
