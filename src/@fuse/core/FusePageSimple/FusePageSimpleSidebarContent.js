/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme, ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
import FuseScrollbars from '../FuseScrollbars';
import { selectContrastMainTheme } from '../../../app/store/fuse/settingsSlice';

function FusePageSimpleSidebarContent(props) {
	const theme = useTheme();
	const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

	const { classes } = props;

	return (
		<FuseScrollbars enable={props.innerScroll}>
			{props.header && (
				<ThemeProvider theme={contrastTheme}>
					<div
						className={clsx(
							classes.sidebarHeader,
							props.variant,
							props.sidebarInner && classes.sidebarHeaderInnerSidebar
						)}>
						{props.header}
					</div>
				</ThemeProvider>
			)}

			{props.content && <div className={classes.sidebarContent}>{props.content}</div>}
		</FuseScrollbars>
	);
}

export default FusePageSimpleSidebarContent;
