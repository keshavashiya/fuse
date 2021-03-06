/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
	adjust: {
		maxHeight: '100vh !important',
		position: 'fixed',
		left: '0px',
		right: '0px',
		top: '0px',
		bottom: '0px',
		height: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	closeButton: {
		position: 'fixed',
		bottom: '0px',
		left: '125vh'
	},
	style: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)'
	}
}));

const CustomDocPreview = props => {
	const { mimeType, previewFile, onClose } = props;
	const classes = useStyles();
	return (
		<div id="container" className={classes.adjust}>
			<Button
				variant="contained"
				color="default"
				onClick={onClose}
				className={classes.closeButton}
				startIcon={<CancelPresentationIcon />}>
				Close
			</Button>
			{mimeType !== 'application/pdf' && mimeType !== 'image/jpeg' && (
				<iframe
					title="gview"
					src={`https://view.officeapps.live.com/op/embed.aspx?src=${previewFile}`}
					frameBorder="no"
					style={{ width: '69.5%', height: '715px' }}
				/>
			)}
			{mimeType === 'application/pdf' && (
				<iframe
					title="gview"
					src={[previewFile]}
					frameBorder="no"
					style={{ width: '69.5%', height: '715px' }}
				/>
			)}
		</div>
	);
};

export default CustomDocPreview;
