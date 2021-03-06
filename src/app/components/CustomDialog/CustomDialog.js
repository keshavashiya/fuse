/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
	Dialog,
	DialogTitle as MuiDialogTitle,
	DialogContent as MuiDialogContent,
	// DialogActions as MuiDialogActions,
	Typography,
	IconButton
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	root: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const DialogTitle = withStyles(styles)(props => {
	const { children, classes, onClose, ...other } = props;
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles(theme => ({
	root: {
		padding: theme.spacing(2)
	}
}))(MuiDialogContent);

// const DialogActions = withStyles(theme => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

const CustomDialog = props => {
	// eslint-disable-next-line no-unused-vars
	const { onDialogClose, Component, width, title, showTitle, disableEscapeKeyDown, ...rest } = props; //

	const [dialogState, setDialogState] = useState({
		open: false
	});

	useEffect(() => {
		setDialogState({ ...dialogState, open: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleDialog = open => event => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setDialogState({ ...dialogState, open });
		if (!open) {
			setTimeout(() => {
				onDialogClose();
			}, 200);
		}
	};

	//   // eslint-disable-next-line react/prop-types
	//   const { openx } = props;
	//   const [open, setOpen] = useState(openx);

	//   //   const handleClickOpen = () => {
	//   //     setOpen(true);
	//   //   };
	//   const handleClose = () => {
	//     setOpen(false);
	//   };

	return (
		<div>
			<>
				<Dialog
					onClose={toggleDialog(false)}
					open={dialogState.open}
					disableEscapeKeyDown={disableEscapeKeyDown}
					maxWidth="xl">
					{showTitle && <DialogTitle onClose={toggleDialog(false)}>{title}</DialogTitle>}
					<DialogContent dividers>
						<div>
							<Component {...rest} />
						</div>
					</DialogContent>
					{/* <DialogActions>
            <Button autoFocus onClick={toggleDialog(false)} color="primary">
              Save changes
            </Button>
          </DialogActions> */}
				</Dialog>
			</>
		</div>
	);
};

CustomDialog.propTypes = {
	Component: PropTypes.instanceOf(Object).isRequired,
	onDialogClose: PropTypes.instanceOf(Object).isRequired,
	width: PropTypes.number,
	title: PropTypes.string,
	showTitle: PropTypes.bool,
	disableEscapeKeyDown: PropTypes.bool
};

CustomDialog.defaultProps = {
	width: 40,
	title: '',
	showTitle: true,
	disableEscapeKeyDown: false
};

export default CustomDialog;
