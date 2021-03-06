/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
// import Carousel from 'react-material-ui-carousel';
import { Paper } from '@material-ui/core';
// import Button from '@material-ui/core/Button';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	adjust: {
		// maxHeight: 'vh !important',
		// maxWidth: '70vh',
		position: 'fixed',
		// left: '0px',
		// right: '0px',
		// top: '0px',
		bottom: '76.8vh',
		height: '5vh'
		// marginTop: 'auto',
		// marginBottom: 'auto'
	},
	carousalImage: {
		width: '62.5vh',
		height: '70vh'
		// marginLeft: 'auto',
		// marginRight: 'auto',
		// marginTop: '10vh',
		// marginBottom: 'auto',
		// maxHeight: '80vh',
		// minHeight: '80vh'
	},
	closeButton: {
		position: 'fixed',
		top: '18vh',
		backgroundColor: 'white',
		right: '44.5vh'
	},
	style: {
		// backgroundColor: 'rgba(255, 255, 255, 0.1)'
	}
}));

export default function ChatPreview(props) {
	const classes = useStyles();
	const { previewFile, onClose } = props;
	return (
		<div className={classes.adjust}>
			<div
				// next={() => {
				// 	/* Do stuff */
				// }}
				// prev={() => {
				// 	/* Do other stuff */
				// }}
				autoPlay={false}
				navButtonsAlwaysVisible={false}>
				{previewFile.map((item, i) => (
					<Item key={i} item={item} />
				))}
			</div>
			<CancelPresentationIcon onClick={onClose} className={classes.closeButton} />
		</div>
	);
}

function Item(props) {
	const classes = useStyles();
	return (
		<Paper className={classes.style}>
			<img className={classes.carousalImage} src={props.item.File} />
		</Paper>
	);
}
