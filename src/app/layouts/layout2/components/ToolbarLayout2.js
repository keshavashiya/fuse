import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import NavbarMobileToggleButton from '../../shared-components/NavbarMobileToggleButton';
import FuseShortcuts from '../../../../@fuse/core/FuseShortcuts';
import FuseSearch from '../../../../@fuse/core/FuseSearch';
import { selectToolbarTheme } from '../../../store/fuse/settingsSlice';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';

const useStyles = makeStyles(() => ({
	root: {}
}));

function ToolbarLayout2(props) {
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
				<Toolbar className="container p-0 lg:px-24">
					{config.navbar.display && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-64 h-64 p-0" />
						</Hidden>
					)}

					<div className="flex flex-1">
						<Hidden mdDown>
							<FuseShortcuts />
						</Hidden>
					</div>

					<div className="flex items-center px-16">
						<LanguageSwitcher />

						<FuseSearch />

						<QuickPanelToggleButton />
					</div>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout2);
