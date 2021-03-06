/* eslint-disable */
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { useDispatch } from 'react-redux';
import { navbarToggleMobile } from '../../store/fuse/navbarSlice';

function NavbarMobileToggleButton(props) {
	const dispatch = useDispatch();

	return (
		<IconButton
			// eslint-disable-next-line
			className={props.className}
			onClick={() => dispatch(navbarToggleMobile())}
			color="inherit"
			disableRipple>
			{props.children}
		</IconButton>
	);
}

NavbarMobileToggleButton.defaultProps = {
	children: <Icon>menu</Icon>
};

export default NavbarMobileToggleButton;
