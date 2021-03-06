import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
	paper: {
		border: '2px solid #d3d3d3',
		boxShadow: 'none',
		padding: theme.spacing(1),
		marginTop: theme.spacing(1.2),
		marginBottom: theme.spacing(2)
	},
	label: {
		border: '2px solid #d3d3d3',
		left: 20,
		background: 'white',
		position: 'absolute',
		fontSize: '1.2rem',
		fontWeight: 'bold',
		borderRadius: 4,
		top: -23,
		padding: 5,
		zIndex: 10
	},
	fieldSet: {
		position: 'relative'
	}
}));

function FormGroup(props) {
	const classes = useStyles();
	const {
		// eslint-disable-next-line react/prop-types
		children,
		// eslint-disable-next-line react/prop-types
		label,
		// eslint-disable-next-line react/prop-types
		noOfItems: { found, noOfFields = 1 }
	} = props;
	return (
		<Paper
			className={classes.paper}
			style={{
				height: 62 * noOfFields + (found === false ? 22 : 8) + (found === undefined ? 14 : 8)
			}}>
			<Grid container direction="column">
				<Grid item sm={12}>
					<fieldset className={classes.fieldSet}>
						<legend className={classes.label}>{label}</legend>
						{children}
					</fieldset>
				</Grid>
			</Grid>
		</Paper>
	);
}

export default FormGroup;
