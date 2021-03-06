import React, { useEffect, cloneElement } from 'react';

import PropTypes from 'prop-types';

import {
	Paper,
	List,
	Divider,
	IconButton,
	Avatar,
	ListItem,
	ListItemText,
	ListItemIcon,
	Typography,
	ListItemSecondaryAction
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { CSSTransition } from 'react-transition-group';

const ShowNotification = props => {
	const {
		additionalText,
		//   additionalLines,
		autoHide,
		avatar,
		icon,
		iconBadgeColor,
		iconFillColor,
		overflowText,
		overflowContent,
		personalised,
		style,
		title,
		timestamp,
		zDepth,
		desktop,
		transitionName,
		transitionAppear,
		transitionEnter,
		transitionLeave,
		transitionEnterTimeout,
		transitionLeaveTimeout,
		removeNotification,
		onClick
	} = props;

	useEffect(() => {
		let autoHideTimeout;
		if (autoHide) {
			autoHideTimeout = setTimeout(() => {
				removeNotification();
			}, autoHide);
		}

		return () => {
			// eslint-disable-next-line no-undef
			clearTimeout(autoHideTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * merge local styles and overriding styles and return it
	 */
	const getStyle = () => {
		const localstyle = {
			display: 'block',
			textAlign: 'left',
			borderRadius: 3,
			margin: '12px auto'
		};
		// dx
		return Object.assign(localstyle, style);
	};

	/**
	 * hide notification on click of the close button
	 * cancel the settimeout function of the autohide method if the open is changed before timeout ends
	 */
	const onCloseNotification = () => {
		removeNotification();
	};

	/**
	 * generate the correct icon body on the left to display in the notification
	 */
	const getNotificationIcon = () => {
		/**
		 * only show notification icon if it is passes
		 */
		let iconEl;
		if (icon) {
			/**
			 * if personalised then render an avatar with the icon
			 */
			if (personalised) {
				const leftIconBodyStyle = {
					top: 4,
					margin: 0,
					left: 8,
					width: 'auto',
					height: 'auto'
				};
				const leftAvatarStyle = {
					textAlign: 'center'
				};
				const leftIconStyle = {
					position: 'absolute',
					padding: 4,
					left: 42,
					bottom: 18,
					borderRadius: '50%',
					backgroundColor: iconBadgeColor,
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex'
				};
				const leftIcon = cloneElement(icon, {
					color: iconFillColor,
					style: {
						width: 12,
						height: 12
					}
				});
				iconEl = (
					<div style={leftIconBodyStyle}>
						<Avatar src={avatar} size={44} style={leftAvatarStyle} />
						<div style={leftIconStyle}>{leftIcon}</div>
					</div>
				);
			} else {
				const leftIconBodyStyle = {
					height: 32,
					width: 32,
					top: 4,
					padding: 6,
					margin: 0,
					left: 8,
					borderRadius: '50%',
					backgroundColor: iconBadgeColor,
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex'
				};
				const leftIcon = cloneElement(icon, {
					color: iconFillColor,
					style: {
						margin: 0
					}
				});
				iconEl = <div style={leftIconBodyStyle}>{leftIcon}</div>;
			}
		}
		return iconEl;
	};

	const iconButtonStyle = {
		width: 36,
		height: 36,
		top: -3,
		right: 4,
		padding: 6
	};
	// const iconStyle = {
	//   height: 18,
	//   width: 18,
	// };
	// const listItemStyle = {
	//   padding: icon ? "8px 8px 0 72px" : "8px 8px 0 12px",
	// };
	const listStyle = {
		position: 'relative'
	};
	const overflowStyle = {
		padding: '12px 0 12px 72px'
	};
	const overflowContentStyle = {
		paddingLeft: 72
	};
	const secondaryTextStyle = {
		marginTop: 8,
		marginBottom: 8
	};
	const timestampStyle = {
		position: 'absolute',
		right: desktop ? 30 : 8,
		fontSize: 12,
		top: 14
	};

	/**
	 * secondary line text
	 */
	let secondaryText;
	let expandedText;
	let expandedAction;
	let desktopClose;
	let timestampEl;
	if (additionalText) {
		secondaryText = <span style={secondaryTextStyle}>{additionalText}</span>;
	}

	/**
	 * if overflow text is present then show these expanded items
	 */
	if (overflowText) {
		expandedText = (
			<span>
				<Divider variant="inset" />
				<div style={overflowStyle}>{overflowText}</div>
			</span>
		);
	} else {
		expandedText = <span />;
	}

	/**
	 * if overflow content is present then show these expanded items
	 */
	if (overflowContent) {
		expandedAction = (
			<span>
				<Divider variant="inset" />
				<div style={overflowContentStyle}>{overflowContent}</div>
			</span>
		);
	} else {
		expandedAction = <span />;
	}

	/**
	 * show icon button if on desktop
	 */
	if (desktop) {
		desktopClose = (
			// onTouchTap = { onCloseNotification }
			<IconButton style={iconButtonStyle}>
				<Close />
			</IconButton>
		);
	}

	/**
	 * show the timestamp if the string is filled
	 */
	if (timestamp) {
		timestampEl = <div style={timestampStyle}>{timestamp}</div>;
	}

	return (
		<CSSTransition
			// transitionName={props.transitionName ? props.transitionName : ""}
			classNames={transitionName || ''}
			// transitionAppear={props.transitionAppear ? props.transitionAppear : false}
			appear={transitionAppear || false}
			// transitionEnter={props.transitionEnter ? props.transitionEnter : false}
			enter={transitionEnter || false}
			// transitionLeave={props.transitionLeave ? props.transitionLeave : false}
			exit={transitionLeave || false}
			// transitionAppearTimeout={props.transitionAppearTimeout ? props.transitionAppearTimeout : 0}
			// transitionEnterTimeout={props.transitionEnterTimeout ? props.transitionEnterTimeout : 0}
			// transitionLeaveTimeout={props.transitionLeaveTimeout ? props.transitionLeaveTimeout : 0}
			timeout={{
				enter: transitionEnterTimeout || 0,
				exit: transitionLeaveTimeout || 0
			}}>
			<Paper style={getStyle()} elevation={zDepth}>
				<List style={listStyle}>
					{/* <ListItem>
            <ListItemIcon>{getNotificationIcon()}</ListItemIcon>
            <ListItemText primary={title} secondary={secondaryText} />
            <ListItemIcon>{desktopClose}</ListItemIcon>
          </ListItem> */}
					<ListItem button alignItems="flex-start" disabled={!onClick} onClick={() => onClick()}>
						<ListItemIcon>{getNotificationIcon()}</ListItemIcon>
						<ListItemText
							primary={title}
							secondary={
								<>
									<Typography
										component="span"
										variant="body2"
										style={{ display: 'block' }}
										color="textPrimary">
										{secondaryText}
									</Typography>
									{/* {" — I'll be in your neighborhood doing errands this…"} */}
								</>
							}
						/>
						<ListItemSecondaryAction
							onClick={() => {
								onCloseNotification();
							}}>
							{desktopClose}
						</ListItemSecondaryAction>
					</ListItem>
					{/* <ListItem
            primaryText={title}
            secondaryText={secondaryText}
            secondaryTextLines={additionalLines}
            leftIcon={getNotificationIcon()}
            insetChildren
            rightIconButton={desktopClose}
            innerDivStyle={listItemStyle}
            disabled={!onClick}
            // // onTouchTap={() => {
            // //   if (props.onClick) {
            // //     props.onClick();
            // //     props.removeNotification();
            // //   }
            // // }}
          /> */}
					{timestampEl}
				</List>
				{expandedAction}
				{expandedText}
			</Paper>
		</CSSTransition>
	);
};

ShowNotification.propTypes = {
	desktop: PropTypes.bool,
	transitionName: PropTypes.instanceOf(Object),
	transitionAppear: PropTypes.bool,
	transitionEnter: PropTypes.bool,
	transitionLeave: PropTypes.bool,
	transitionEnterTimeout: PropTypes.number,
	transitionLeaveTimeout: PropTypes.number,
	/**
	 * additional text for display
	 */
	additionalText: PropTypes.string,
	/**
	 * number of lines of text for additionalText
	 */
	// additionalLines: PropTypes.number,
	/**
	 * autohide timeout to determine whether to hide the notification automatically or nor
	 */
	autoHide: PropTypes.number,
	/**
	 * pass left avatar image url to be displayed in a personalised notification
	 */
	avatar: PropTypes.string,
	/**
	 * notification icon on the left
	 */
	icon: PropTypes.element,
	/*
	 * icon surrounding badge color
	 */
	iconBadgeColor: PropTypes.string,
	/**
	 * icon color
	 */
	iconFillColor: PropTypes.string,
	/**
	 * When the notification is clicked, if not passed it won't be clicakble
	 */
	onClick: PropTypes.func,
	/**
	 * open which tells whether to display the message
	 */
	// open: PropTypes.bool,
	/**
	 * additional overflow text
	 */
	overflowText: PropTypes.string,
	/**
	 * additional overflow content, like buttons
	 * TODO implement the on click dismiss action like done in card (material-ui) as actAsExpander
	 */
	overflowContent: PropTypes.element,
	/**
	 * is personalised notification or not
	 */
	personalised: PropTypes.bool,
	/**
	 * it is a priority notification
	 */
	// priority: PropTypes.bool,
	/**
	 * Injected from parent, needed to remove the notification
	 */
	removeNotification: PropTypes.func,
	/**
	 * Override the inline-styles of the root element.
	 */
	style: PropTypes.instanceOf(Object),
	/**
	 * notification title
	 */
	title: PropTypes.string,
	/**
	 * timestamp you want to display
	 */
	timestamp: PropTypes.string,
	/**
	 * This number represents the zDepth of the paper shadow covering the message.
	 */
	zDepth: PropTypes.number
};

ShowNotification.defaultProps = {
	desktop: true,
	transitionName: {
		leave: 'dummy',
		leaveActive: 'fadeOut',
		appear: 'dummy',
		appearActive: 'zoomInUp'
	},
	transitionAppear: true,
	transitionEnter: true,
	transitionLeave: true,
	transitionEnterTimeout: 0,
	transitionLeaveTimeout: 0,

	iconFillColor: 'primary', // "action","disabled","error","inherit","primary","secondary"
	zDepth: 1,
	additionalText: '',
	// additionalLines: 0,
	autoHide: 0,
	// open: false,
	avatar: '',
	icon: null,
	iconBadgeColor: '',
	overflowText: '',
	overflowContent: null, //  <button type="button" />,
	personalised: false,
	// priority: false,
	removeNotification: null,
	onClick: null,
	style: null,
	title: '',
	timestamp: ''
};

export default ShowNotification;
