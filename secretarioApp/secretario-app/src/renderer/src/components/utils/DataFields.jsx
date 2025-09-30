import PropTypes from 'prop-types';

function DataField({ desc, name, form, handleChange, type, required }) {
	if (type === 'checkbox') {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
				<label className="block text-gray-700">{desc}</label>
				<input
					type="checkbox"
					name={name}
					checked={form[name] || false}
					onChange={(e) => handleChange({ target: { name, value: e.target.checked } })}
					className="h-4 w-4"
					required={required}
				/>
			</div>
		)
	}
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<label className="block text-gray-700">{desc}</label>
			<input
				type={type}
				name={name}
				value={form[name] || ''}
				onChange={handleChange}
				className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
				required={required}
			/>
		</div>
	)
}
DataField.propTypes = {
	desc: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	form: PropTypes.element.isRequired,
	handleChange: PropTypes.func.isRequired,
	type: PropTypes.string,
	required: PropTypes.bool
}
DataField.defaultProps = {
	type: 'text',
	required: false
}
function DataFieldSelect({ desc, name, form, handleChange, required, children }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<label className="block text-gray-700">{desc}</label>
			<select
				name={name}
				value={form[name] || ''}
				onChange={handleChange}
				className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
				required={required}
			>
				{children}
			</select>
		</div>
	)
}
DataFieldSelect.propTypes = {
	desc: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	form: PropTypes.element.isRequired,
	handleChange: PropTypes.func.isRequired,
	required: PropTypes.bool,
	children: PropTypes.node
}
DataFieldSelect.defaultProps = {
	required: false
}
export { DataField, DataFieldSelect }