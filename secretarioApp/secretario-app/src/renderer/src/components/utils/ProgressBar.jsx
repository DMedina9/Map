import React, { useEffect, useRef } from 'react'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material.css'
import JqxProgressBar from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxprogressbar'

export default function ProgressBar({ show = true, message = '', progress = 0 }) {
	const progressRef = useRef(null)

	useEffect(() => {
		if (progressRef.current) {
			progressRef.current.val(progress)
		}
	}, [progress])

	if (!show) return null

	return (
		<div className="my-4 w-full">
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
