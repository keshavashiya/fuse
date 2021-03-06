import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from '../../../store/withReducer';
import FuseScrollbars from '../../../../@fuse/core/FuseScrollbars';
import { toggleQuickPanel } from './store/stateSlice';
import reducer from './store';

const useStyles = makeStyles(() => ({
	root: {
		width: 280
	}
}));

function QuickPanel() {
	const dispatch = useDispatch();
	const state = useSelector(({ quickPanel }) => quickPanel.state);

	const classes = useStyles();

	return (
		<Drawer
			classes={{ paper: classes.root }}
			open={state}
			anchor="right"
			onClose={() => dispatch(toggleQuickPanel())}>
			<FuseScrollbars>
				<Typography>Quick Panel</Typography>
			</FuseScrollbars>
		</Drawer>
	);
}

export default withReducer('quickPanel', reducer)(React.memo(QuickPanel));
