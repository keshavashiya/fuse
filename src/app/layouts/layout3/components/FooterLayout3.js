import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectFooterTheme } from '../../../store/fuse/settingsSlice';

function FooterLayout3() {
	const footerTheme = useSelector(selectFooterTheme);

	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className="relative z-10"
				color="default"
				style={{ backgroundColor: footerTheme.palette.background.default }}>
				<Toolbar className="flex items-center container py-0 px-16 lg:px-24">
					<Typography>Footer</Typography>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(FooterLayout3);
