import { useState } from 'react'
import PropTypes from 'prop-types'
import './TitleBar.css'
import JqxButtonGroup from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttongroup'

const icons = {
	Minimize: (
		<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
			<path fill="currentColor" d="M6 19h12v-2H6v2z" />
		</svg>
	),
	Maximize: (
		<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
			<path fill="currentColor" d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
		</svg>
	),
	Restore: (
		<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
			<path fill="currentColor" d="M6 6h10v2H8v8H6V6zm2-2h10v10h-2V8H8V4z" />
		</svg>
	),
	Close: (
		<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L10.59 13.4l-6.3 6.3-1.42-1.42L9.17 12 2.88 5.71l1.42-1.42 6.3 6.3 6.3-6.3 1.42 1.42z"
			/>
		</svg>
	)
}

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
		console.log('Window state changed to:', newState)
		setState(newState)
	})
	return (
		<div className="titlebar">
			<div className="titlebar-draggable">
				<span>{title}</span>
			</div>
			<div className="titlebar-buttons">
				<JqxButtonGroup theme="material" template="primary" onButtonclick={onButtonclick}>
					<button id="minimizeBtn">{icons.Minimize}</button>
					<button id="maximizeBtn">
						{state == 'normal' ? icons.Maximize : icons.Restore}
					</button>
					<button id="closeBtn">{icons.Close}</button>
				</JqxButtonGroup>
			</div>
		</div>
	)
}
TitleBar.propTypes = {
	title: PropTypes.string.isRequired
}
TitleBar.defaultProps = {
	title: 'Secretario de Congregación'
}
export default TitleBar
