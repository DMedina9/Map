import { useState } from 'react'
import PropTypes from 'prop-types'
import './TitleBar.css'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import JqxTooltip from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip'

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
			<path fill="currentColor" d="M6 16h10V6H6v10zm2-8h6v6H8V8zm8 4h2V4H8v2h8v6z" />
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

	window.setState = setState // Expose setState to the window for IPC use
	return (
		<div className="titlebar">
			<div className="titlebar-draggable">
				<span>{title}</span>
			</div>
			<div className="titlebar-buttons">
				<JqxTooltip theme="material" position="bottom" content="Minimizar">
					{/* The minimize button with tooltip */}
					<JqxButton
						theme="material"
						template="primary"
						onClick={() => window.api.send('app:minimize')}
					>
						{icons.Minimize}
					</JqxButton>
				</JqxTooltip>
				<JqxTooltip
					theme="material"
					position="bottom"
					content={state == 'normal' ? 'Maximizar' : 'Restaurar'}
				>
					{/* The maximize/restore button with tooltip */}
					<JqxButton
						theme="material"
						template="primary"
						onClick={() => window.api.send('app:maximize')}
					>
						{state == 'normal' ? icons.Maximize : icons.Restore}
					</JqxButton>
				</JqxTooltip>
				<JqxTooltip theme="material" position="bottom" content="Cerrar">
					{/* The close button with tooltip */}
					<JqxButton
						theme="material"
						template="danger"
						onClick={() => window.api.send('app:close')}
					>
						{icons.Close}
					</JqxButton>
				</JqxTooltip>
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
