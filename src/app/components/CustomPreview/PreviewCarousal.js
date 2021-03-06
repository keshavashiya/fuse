/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	adjust: {
		maxHeight: '100vh !important',
		maxWidth: '142vh',
		position: 'fixed',
		backgroundColor: '#282828',
		left: '0px',
		right: '0px',
		top: '0px',
		bottom: '0px',
		height: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	carousalImage: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '10vh',
		marginBottom: 'auto',
		maxHeight: '80vh',
		minHeight: '80vh'
	},
	closeButton: {
		position: 'fixed',
		bottom: '0px',
		left: '125vh'
	},
	style: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)'
	}
}));

export default function PreviewCarousal(props) {
	const classes = useStyles();
	const { previewFile, onClose } = props;
	return (
		<div className={classes.adjust}>
			<Carousel
				next={() => {
					/* Do stuff */
				}}
				prev={() => {
					/* Do other stuff */
				}}
				autoPlay={false}
				navButtonsAlwaysVisible={true}>
				{previewFile.map((item, i) => (
					<Item key={i} item={item} />
				))}
			</Carousel>
			<Button
				variant="contained"
				color="default"
				onClick={onClose}
				className={classes.closeButton}
				startIcon={<CancelPresentationIcon />}>
				Close
			</Button>
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
