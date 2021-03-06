import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
// import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import NavbarMobileToggleButton from '../../shared-components/NavbarMobileToggleButton';
// import FuseShortcuts from '../../../components/@fuse/core/FuseShortcuts';
import FuseShortcuts from '../../../../@fuse/core/FuseShortcuts';
// import FuseSearch from '../../../components/@fuse/core/FuseSearch';
import { selectToolbarTheme } from '../../../store/fuse/settingsSlice';
// import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import UserSettings from '../../shared-components/UserSettings';
import UserProfile from '../../shared-components/UserProfile';
import Notifications from '../../shared-components/Notifications';

const useStyles = makeStyles(() => ({
	root: {}
}));

function ToolbarLayout1(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const classes = useStyles(props);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx(classes.root, 'flex relative z-10')}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
				elevation={2}>
				<Toolbar className="p-0" variant="dense">
					{config.navbar.display && config.navbar.position === 'left' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-48 h-48 p-0" />
						</Hidden>
					)}

					<div className="flex flex-1">
						<Hidden mdDown>
							<FuseShortcuts className="px-16" />
						</Hidden>
					</div>

					<div className="flex items-center px-16">
						{/* <LanguageSwitcher /> */}

						{/* <FuseSearch /> */}

						{/* <QuickPanelToggleButton /> */}

						<Notifications />

						<UserSettings />

						<UserProfile />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton />
						</Hidden>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout1);
