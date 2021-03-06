/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Grid, Paper } from '@material-ui/core';
// import blue from '@material-ui/core/colors/blue';

const styles = {
	root: {
		// color: blue[600],
		// '&$checked': {
		// 	color: blue[500]
		// }
	},
	checked: {}
};

const CheckboxItem = props => {
	const { classes, checkboxValue, checkboxLabel, checked, disabled } = props;

	const handleCheckboxChange = event => {
		const { checkboxChangeCallback } = props;
		checkboxChangeCallback(event.target.checked);
	};

	return (
		<Grid item container direction="column" sm={1}>
			<Grid item>
				<Paper variant="outlined" square elevation={0} style={{ height: '5vh', textAlign: 'center' }}>
					<FormControlLabel
						style={{ margin: 0 }}
						control={
							<Checkbox
								checked={checked}
								disabled={disabled}
								onChange={handleCheckboxChange}
								value={checkboxValue}
								classes={{
									root: classes.root,
									checked: classes.checked
								}}
							/>
						}
						label={checkboxLabel}
					/>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(CheckboxItem);

CheckboxItem.propTypes = {
	classes: PropTypes.instanceOf(Object).isRequired,
	checkboxLabel: PropTypes.string, // .isRequired,
	checkboxValue: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	disabled: PropTypes.bool,
	// eslint-disable-next-line react/no-unused-prop-types
	handleCheckboxChange: PropTypes.func
};
CheckboxItem.defaultProps = {
	handleCheckboxChange: null,
	checkboxLabel: null,
	disabled: false
};
