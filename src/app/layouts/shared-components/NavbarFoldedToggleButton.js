/* eslint-disable */
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '../../../@lodash';
import { setDefaultSettings } from '../../store/fuse/settingsSlice';

function NavbarFoldedToggleButton(props) {
	const dispatch = useDispatch();
	const settings = useSelector(({ fuse }) => fuse.settings.current);

	return (
		<IconButton
			// eslint-disable-next-line
			className={props.className}
			onClick={() => {
				dispatch(
					setDefaultSettings(_.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded))
				);
			}}
			color="inherit">
			{
				// eslint-disable-next-line
				{ ...props.children }
			}
		</IconButton>
	);
}

NavbarFoldedToggleButton.defaultProps = {
	children: <Icon>menu</Icon>
};

export default NavbarFoldedToggleButton;
