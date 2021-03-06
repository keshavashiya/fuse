/* eslint-disable */
import { useTheme, ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectContrastMainTheme } from '../../../app/store/fuse/settingsSlice';
import FuseScrollbars from '../FuseScrollbars';

function FusePageCardedSidebarContent(props) {
	const theme = useTheme();
	const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

	const { classes } = props;

	return (
		<>
			{props.header && (
				<ThemeProvider theme={contrastTheme}>
					<div className={clsx(classes.sidebarHeader, props.variant)}>{props.header}</div>
				</ThemeProvider>
			)}

			{props.content && (
				<FuseScrollbars className={classes.sidebarContent} enable={props.innerScroll}>
					{props.content}
				</FuseScrollbars>
			)}
		</>
	);
}

export default FusePageCardedSidebarContent;
