/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

const useStyles = makeStyles(() => ({
	adjust: {
		// maxHeight: 'vh !important',
		// maxWidth: '70vh',
		position: 'fixed',
		// left: '0px',
		// right: '0px',
		// top: '0px',
		bottom: '76.5vh',
		height: '5.5vh'
		// marginTop: 'auto',
		// marginBottom: 'auto'
	},
	closeButton: {
		position: 'fixed',
		top: '18vh',
		backgroundColor: 'white',
		right: '36.7vh'
	},
	style: {
		// backgroundColor: 'rgba(255, 255, 255, 0.5)'
	}
}));

const ChatDocPreview = props => {
	const { mimeType, previewFile, onClose } = props;
	const classes = useStyles();
	return (
		<div id="container" className={classes.adjust}>
			<CancelPresentationIcon onClick={onClose} className={classes.closeButton} />
			{mimeType !== 'application/pdf' && mimeType !== 'image/jpeg' && (
				<iframe
					title="gview"
					src={`https://view.officeapps.live.com/op/embed.aspx?src=${previewFile}`}
					frameBorder="no"
					style={{ width: '70vh', height: '70.5vh' }}
				/>
			)}
			{mimeType === 'application/pdf' && (
				<iframe
					title="gview"
					src={[previewFile]}
					frameBorder="no"
					style={{ width: '70vh', height: '70.5vh' }}
				/>
			)}
		</div>
	);
};

export default ChatDocPreview;
