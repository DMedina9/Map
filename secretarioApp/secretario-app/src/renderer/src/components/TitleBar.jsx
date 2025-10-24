import { useState } from 'react'
import './TitleBar.css'
import JqxButtonGroup from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttongroup'
import CloseIcon from '@mui/icons-material/CloseRounded'
import MinimizeIcon from '@mui/icons-material/MinimizeRounded'
import MaximizeIcon from '@mui/icons-material/WebAssetRounded'
import RestoreIcon from '@mui/icons-material/DynamicFeedRounded'

// Estilos jqWidgets
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'

const TitleBar = ({ title }) => {
	const [state, setState] = useState('normal') // 'normal', 'maximized'
	const onButtonclick = (event) => {
		const buttonId = event.args.button[0].id
		switch (buttonId) {
			case 'minimizeBtn':
				window.api.send('app:minimize')
				break
			case 'maximizeBtn':
				window.api.send('app:maximize')
				break
			case 'closeBtn':
				window.api.send('app:close')
				break
			default:
				break
		}
	}

	window.api.receive('window-state-changed', (newState) => {
		setState(newState)
	})
	return (
		<div className="titlebar">
			<div className="titlebar-draggable">
				<span>{title}</span>
			</div>
			<div className="titlebar-buttons">
				<JqxButtonGroup theme="material" template="primary" onButtonclick={onButtonclick}>
					<button id="minimizeBtn">
						<MinimizeIcon />
					</button>
					<button id="maximizeBtn">
						{state === 'normal' ? <MaximizeIcon /> : <RestoreIcon />}
					</button>
					<button id="closeBtn">
						<CloseIcon />
					</button>
				</JqxButtonGroup>
			</div>
		</div>
	)
}

export default TitleBar
