import PropTypes from 'prop-types';

const ProgressBar = ({ show, message, progress }) => {
	if (!message || !show) return null
	return (
		<>
			<div className="flex justify-end mt-2 text-sm text-neutral-500">{message}</div>
			<div className="w-full bg-gray-200 rounded-full h-4">
				<div
					className="bg-blue-600 h-4 rounded-full"
					style={{ width: progress + '%' }}
				></div>
			</div>
		</>
	)
}

ProgressBar.propTypes = {
    show: PropTypes.bool.isRequired,
	message: PropTypes.string,
	progress: PropTypes.number
};

export default ProgressBar