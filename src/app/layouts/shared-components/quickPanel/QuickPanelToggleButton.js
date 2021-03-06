import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleQuickPanel } from './store/stateSlice';

function QuickPanelToggleButton(props) {
	const dispatch = useDispatch();

	return (
		<IconButton className="w-40 h-40" onClick={() => dispatch(toggleQuickPanel())}>
			{
				// eslint-disable-next-line
				{ ...props.children }
			}
		</IconButton>
	);
}

QuickPanelToggleButton.defaultProps = {
	children: <Icon>bookmarks</Icon>
};

QuickPanelToggleButton.propTypes = {
	children: PropTypes.instanceOf(Object)
};

export default QuickPanelToggleButton;
