/* eslint-disable */
import { useTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectContrastMainTheme } from '../../../app/store/fuse/settingsSlice';

function FusePageCardedHeader(props) {
	const { type, hasParent } = props;
	const theme = useTheme();
	const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

	return (
		<div className={type && hasParent ? props.classes.headerAlternate : props.classes.header}>
			{props.header && <ThemeProvider theme={contrastTheme}>{props.header}</ThemeProvider>}
		</div>
	);
}

export default FusePageCardedHeader;
