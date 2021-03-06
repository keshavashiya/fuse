/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';

const CustomNumberFormat = props => {
	const { inputRef, onChange, prefix, decimalScale, fixedDecimalScale, thousandSeparator, ...other } = props;

	return (
		<NumberFormat
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						value: values.value
					}
				});
			}}
			// onValueChange={values => console.log(values)}
			// onChange={e => console.log(e.target.value)}
			thousandSeparator={thousandSeparator}
			// isNumericString
			// eslint-disable-next-line react/prop-types
			prefix={props.suffix ? '' : prefix}
			// decimalSeparator="."
			decimalScale={decimalScale}
			fixedDecimalScale={fixedDecimalScale}
		/>
	);
};

CustomNumberFormat.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	prefix: PropTypes.string,
	decimalScale: PropTypes.number,
	fixedDecimalScale: PropTypes.bool,
	thousandSeparator: PropTypes.bool
};

CustomNumberFormat.defaultProps = {
	prefix: '₹ ',
	decimalScale: 2,
	fixedDecimalScale: true,
	thousandSeparator: true
};

export default CustomNumberFormat;
