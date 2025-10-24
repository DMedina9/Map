import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxProgressBar from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxprogressbar'

export default function ProgressBar({ show, message, progress }) {
	const progressRef = useRef(null)

	useEffect(() => {
		if (progressRef.current) {
			progressRef.current.val(progress)
		}
	}, [progress])

	return (
		<div className="my-4 w-full" style={{ display: !message || !show ? 'none' : 'block' }}>
			<div className="text-sm text-gray-600 mb-2">{message}</div>
			<JqxProgressBar
				ref={progressRef}
				width={'100%'}
				height={25}
				theme="material"
				showText={true}
				animationDuration={300}
				value={progress}
			/>
		</div>
	)
}
ProgressBar.propTypes = {
	show: PropTypes.bool.isRequired,
	message: PropTypes.string,
	progress: PropTypes.number
}
ProgressBar.defaultProps = {
	show: false,
	message: '',
	progress: 0
}
