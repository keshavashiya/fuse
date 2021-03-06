import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import React, { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';

function UserSettings() {
	// const dispatch = useDispatch();

	// const theme = useTheme();
	// const { i18n } = useTranslation();
	const [menu, setMenu] = useState(null);

	const settingMenuClick = event => {
		setMenu(event.currentTarget);
	};

	const settingMenuClose = () => {
		setMenu(null);
	};

	return (
		<>
			<Button className="h-40 w-64" onClick={settingMenuClick}>
				<Icon>settings</Icon>
			</Button>

			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={settingMenuClose}
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
				<MenuItem component={Link} to="" onClick={settingMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>person_outline</Icon>
					</ListItemIcon>
					<ListItemText primary="User" />
				</MenuItem>
				{/* <MenuItem component={Link} to="" onClick={settingMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>person_pin</Icon>
					</ListItemIcon>
					<ListItemText primary="User Type" />
				</MenuItem> */}
				<MenuItem component={Link} to="/permissions" onClick={settingMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>assignment_ind</Icon>
					</ListItemIcon>
					<ListItemText primary="User Roles & Permission" />
				</MenuItem>
				{/* <MenuItem component={Link} to="" onClick={settingMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>contact_phone</Icon>
					</ListItemIcon>
					<ListItemText primary="Contact Us" />
				</MenuItem> */}
				{/* <MenuItem component={Link} to="" onClick={settingMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>email</Icon>
					</ListItemIcon>
					<ListItemText primary="Email Settings" />
				</MenuItem> */}
				{/* <MenuItem component={Link} to="" onClick={settingMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>sms</Icon>
					</ListItemIcon>
					<ListItemText primary="SMS Settings" />
				</MenuItem> */}
			</Popover>
		</>
	);
}

export default UserSettings;
