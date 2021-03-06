import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import React, { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import { useDispatch /* , useSelector */ } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../auth/store/userSlice';

function UserSettings() {
	// const signoutText = 'Are you sure?';
	const dispatch = useDispatch();
	// const user = useSelector(({ auth }) => auth.user);

	const [menu, setMenu] = useState(null);

	const profileMenuClick = event => {
		setMenu(event.currentTarget);
	};

	const profileMenuClose = () => {
		setMenu(null);
	};

	return (
		<>
			<Button className="h-40 w-64" onClick={profileMenuClick}>
				<Icon>account_circle</Icon>
			</Button>
			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={profileMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}>
				<MenuItem component={Link} to="/" role="button">
					<ListItemIcon className="min-w-40">
						<Icon>account_circle</Icon>
					</ListItemIcon>
					<ListItemText primary="User Profile" />
				</MenuItem>
				<MenuItem component={Link} to="/notificationpermission" onClick={profileMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>notifications</Icon>
					</ListItemIcon>
					<ListItemText primary="Notification" />
				</MenuItem>
				<MenuItem component={Link} to="/changepassword" onClick={profileMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>lock_open</Icon>
					</ListItemIcon>
					<ListItemText primary="Change Password" />
				</MenuItem>
				<MenuItem
					onClick={() => {
						dispatch(logoutUser());
						profileMenuClose();
					}}>
					<ListItemIcon className="min-w-40">
						<Icon>exit_to_app</Icon>
					</ListItemIcon>
					<ListItemText primary="Sign out" />
				</MenuItem>
				{/* <MenuItem component={Link} to="/" role="button">
					<ListItemIcon className="min-w-40">
						<Icon>swap_horizontal_circle</Icon>
					</ListItemIcon>
					<ListItemText primary="Sign out" />
				</MenuItem> */}
			</Popover>
		</>
	);
}

export default UserSettings;
