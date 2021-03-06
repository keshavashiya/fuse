/* eslint-disable */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import { Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

import FuseAnimate from '../../../@fuse/core/FuseAnimate';
import FusePageCarded from '../../../@fuse/core/FusePageCarded';

const useStyles = makeStyles(theme => ({
	drawerCss: {
		// backgroundColor: '#EEF2F4'
	},
	list: {
		width: '100%'
	},
	root: {
		// flex: 1,
		display: 'flex',
		// backgroundColor: '#EEF2F4',
		backgroundColor: theme.palette.background.default,
		minHeight: theme.spacing(8),
		textAlign: 'center',
		position: '-webkit-sticky' /* Safari */,
		// eslint-disable-next-line no-dupe-keys
		position: 'sticky',
		top: 0,
		zIndex: 500
		// justifyContent: "space-around",
	},
	title: {
		// paddingLeft: theme.spacing(1),
		paddingTop: theme.spacing(0.5)
		// verticalAlign: "middle",
		// display: "inline-block",
	},
	drawerPaper: {
		width: props => `${props.width}%`,
		minWidth: '170px',
		// backgroundColor: '#EEF2F4'
		backgroundColor: theme.palette.background.default
	}
}));

const CustomDrawer = props => {
	const { onDrawerClose, component: Component, width, title, disableEscapeKeyDown, ...rest } = props;

	const classes = useStyles(props);
	const theme = useTheme();
	const [drawerState, setDrawerState] = React.useState({
		right: false
	});

	useEffect(() => {
		setDrawerState({ ...drawerState, right: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleDrawer = (side, open) => event => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setDrawerState({ ...drawerState, [side]: open });
		if (!open) {
			setTimeout(() => {
				onDrawerClose();
			}, 200);
		}
	};

	return (
		<div>
			<SwipeableDrawer
				variant="temporary"
				anchor="right"
				open={drawerState.right}
				onClose={toggleDrawer('right', false)}
				onOpen={toggleDrawer('right', true)}
				disableEscapeKeyDown={disableEscapeKeyDown}
				classes={{
					paper: classes.drawerPaper
				}}
				ModalProps={{
					keepMounted: true // Better open performance on mobile.
				}}>
				<FusePageCarded
					// classes={{
					// 	toolbar: 'p-0',
					// 	header: 'sm:h-72 sm:min-h-72'
					// }}
					header={
						<div className="flex flex-1 w-full items-center justify-between">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									// component={Link}
									role="button"
									// to="/apps/e-commerce/products"
									onClick={toggleDrawer('right', false)}
									color="inherit">
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									{/* <span className="mx-4">Add Schemes</span> */}
									<Typography
										className="hidden sm:flex mx-0 sm:mx-12"
										component={'span'}
										variant="h6">
										{title}
									</Typography>
								</Typography>
							</FuseAnimate>
						</div>
					}
					content={
						<div className={classes.list} role="presentation">
							<Component closeDrawer={toggleDrawer('right', false)} {...rest} width={width} />
						</div>
					}
				/>
			</SwipeableDrawer>
		</div>
	);
};

CustomDrawer.propTypes = {
	component: PropTypes.instanceOf(Object).isRequired,
	onDrawerClose: PropTypes.instanceOf(Object).isRequired,
	width: PropTypes.number,
	title: PropTypes.string,
	disableEscapeKeyDown: PropTypes.bool
};

CustomDrawer.defaultProps = {
	width: 30,
	title: '',
	disableEscapeKeyDown: false
};

export default CustomDrawer;
