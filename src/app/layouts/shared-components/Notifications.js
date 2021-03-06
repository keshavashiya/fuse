import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Icon, Badge } from '@material-ui/core';
import { Link } from 'react-router-dom';

function Notifications() {
	const { authSessionReducer } = useSelector(
		reducer => ({
			authSessionReducer: reducer.auth.session
			// settingReducer: settingReducer: reducer.setting.setting
		}),
		shallowEqual
	);

	const [count, setCount] = useState(0);
	// const [noteMenu] = useState(null);

	useEffect(() => {
		if (authSessionReducer.Notification) {
			if (authSessionReducer.Notification.Count) {
				setCount(authSessionReducer.Notification.Count);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authSessionReducer.Notification]);

	// onClick={notificationMenuClick} >
	// const notificationMenuClick = event => {
	// 	console.log(event);
	// 	// noteMenu(event.currentTarget);
	// };

	// const notificationMenuClose = () => {
	// 	noteMenu(null);
	// };

	return (
		<>
			<Button
				component={Link}
				to="/notifications"
				// onClick={settingMenuClose}
				role="button"
				className="h-40 w-64">
				<Badge max={999} badgeContent={count} color="secondary">
					<Icon>notifications</Icon>
				</Badge>
			</Button>
		</>
	);
}

export default Notifications;

// 	invisible={false} showZero
