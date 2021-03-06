/* eslint-disable import/no-cycle */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-cycle
// import { NotificationContext } from '../../layouts/Main/components/Topbar/Topbar';
import { NotificationContext } from '../../layouts/shared-components/Navigation';

import ShowNotification from './ShowNotification';

let maxNotifications;
let rootStyle;

const MUINotifications = props => {
	const { notify } = useContext(NotificationContext);

	const [notifications, setNotifications] = useState([]);
	const [count, setCount] = useState(0);

	useEffect(() => {
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * filter out and only keep the open notifications
	 * @method
	 * @param  {object} notification [a notification object]
	 */
	const filterOpen = notification => notification.open;

	/**
	 * perform operations like capping on the operations before doing them
	 */
	const shuffleNotifications = tempNotifications => {
		if (tempNotifications.length > maxNotifications) {
			// eslint-disable-next-line no-restricted-syntax
			for (const i in tempNotifications) {
				if (
					typeof tempNotifications[i] === 'object' &&
					(!Object.prototype.hasOwnProperty.call(tempNotifications[i], 'priority') ||
						!tempNotifications[i].priority)
				) {
					tempNotifications.splice(i, 1);
					if (tempNotifications.length === maxNotifications) {
						break;
					}
				}
			}
		}
		/**
		 * sort the priority notifications to the top
		 */
		// eslint-disable-next-line func-names
		tempNotifications.sort(function (a, b) {
			const priorityA = a.priority;
			const priorityB = b.priority;
			if (!priorityA && priorityB) {
				return 1;
			}
			if (priorityA && !priorityB) {
				return -1;
			}
			// other cases they are considered same
			return 0;
		});
		return tempNotifications;
	};

	useEffect(() => {
		if (notify && notify.payload) {
			let tempNotifications = notifications;
			notify.open = true;
			notify.count = count;

			const property = Object.assign(notify, notify.payload);
			delete property.payload;

			tempNotifications.push(property);
			// filter and keep only the open ones
			tempNotifications = tempNotifications.filter(filterOpen);

			// shuffle notifications and set actual notifications to the temp ones to update render
			// notifications = shuffleNotifications(tempNotifications);

			setNotifications(shuffleNotifications(tempNotifications));

			const countCtr = count + 1;

			// update counter
			setCount(countCtr);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notify]);

	// merge local styles and overriding styles and return it
	const getStyle = () => {
		const style = {
			position: 'fixed',
			zIndex: 1,
			minWidth: 325,
			bottom: '20px',
			right: '25px'
		};

		return Object.assign(style, rootStyle);
	};

	const removeNotification = index => {
		const pushArray = [...notifications];
		pushArray.splice(index, 1);

		// notifications.splice(index, 1);
		// Need Force Update
		setNotifications(pushArray);
	};

	// eslint-disable-next-line no-unused-vars
	const onClick = index => {
		// Need Force Update
		// console.log(`onClick CALLED FROM MATERIL UI PAGE with index ${index}`);
	};

	/**
	 * get the props we want to forward to the notification
	 */
	const getProps = state => {
		return { ...props, ...state };
	};

	return (
		<div style={getStyle()}>
			{notifications.map((notifyProps, index) => {
				return (
					<ShowNotification
						removeNotification={() => {
							removeNotification(index);
						}}
						onClick={() => {
							onClick(index);
						}}
						open
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						rootStyle
						// {...props}
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...getProps(notifyProps)}
					/>
				);
			})}
		</div>
	);
};

MUINotifications.propTypes = {
	/**
	 * Desktop device or touch device
	 */
	desktop: PropTypes.bool,
	/**
	 * maximum number of notifications to display
	 */
	maxNotifications: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	/**
	 * root component's style
	 */
	rootStyle: PropTypes.instanceOf(Object)
};

MUINotifications.defaultProps = {
	desktop: true,
	maxNotifications: Infinity,
	rootStyle: {
		bottom: 20,
		right: 25
	}
};

export default MUINotifications;

// https://puranjayjain.github.io/react-materialui-notifications/
// https://github.com/puranjayjain/react-materialui-notifications/blob/master/src/app/Main.js
// http://reactcommunity.org/react-transition-group/transition
// https://github.com/reactjs/react-transition-group/blob/master/Migration.md
