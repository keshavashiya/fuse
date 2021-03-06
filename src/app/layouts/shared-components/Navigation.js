import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useInjectSaga } from 'redux-injectors'; // useInjectReducer

import { Button } from '@material-ui/core';
import { Close, Phone as PhoneIcon } from '@material-ui/icons';

import FuseNavigation from '../../../@fuse/core/FuseNavigation';
import { selectNavigation, setNewNavigation } from '../../store/fuse/navigationSlice';

import saga from '../../main/users/settings/store/saga';
import { name } from '../../main/users/settings/store/slice';

import sagaSession from '../../main/users/sessions/store/saga';
import { name as nameSession, actions as actionsSession } from '../../main/users/sessions/store/slice';

import { setSessionData } from '../../auth/store/sessionSlice';

/*  PUSH NOTIFICATION */
// eslint-disable-next-line import/no-cycle
import MUINotifications from '../../components/Firebase/MUINotifications';
import { messaging } from '../../components/Firebase/Firebase';

// Create context object
export const NotificationContext = React.createContext();

// Set up Initial State
const initialState = {
	payload: null
};

function reducerNotify(state, action) {
	switch (action.type) {
		case 'SHOW_NOTIFICATION':
			return {
				payload: action.data
			};

		default:
			return initialState;
	}
}

function Navigation(props) {
	useInjectSaga({ key: name, saga });
	useInjectSaga({ key: nameSession, saga: sagaSession });

	const dispatch = useDispatch();

	const { sessionReducer } = useSelector(
		reducer => ({
			sessionReducer: reducer.session.session
		}),
		shallowEqual
	);
	const navigation = useSelector(selectNavigation);

	useEffect(() => {
		if (navigation && navigation.length === 0) {
			dispatch(setNewNavigation());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [notify, dispatchNotify] = useReducer(reducerNotify, initialState);

	useEffect(() => {
		dispatch(actionsSession.add({ AppType: 'Browser' }));

		if (messaging) {
			messaging.onMessage(payload => {
				const { type } = payload.data;
				dispatchNotify({
					type: 'SHOW_NOTIFICATION',
					data: {
						title: payload.data.title,
						additionalText: payload.data.body,
						// icon: <MessageOutlinedIcon />,
						...(['birthday', 'anniversary'].includes(type) && {
							icon: type === 'birthday' ? <PhoneIcon /> : <PhoneIcon />
						}),
						...(['birthday', 'anniversary'].includes(type) && { iconBadgeColor: 'red' }),
						...(['birthday', 'anniversary'].includes(type) && {
							overflowText: 'dharmesh@patel.com'
						}),
						...(['birthday1', 'anniversary1'].includes(type) && {
							overflowContent: (
								<div>
									<Button
										size="medium"
										// className={classes.overflowButton}
										startIcon={<Close />}
										// onClick={() => console.log('Dismissed Clicked')}
									>
										dismisse
									</Button>
									<Button
										size="medium"
										// className={classes.overflowButton}
										startIcon={<PhoneIcon />}
										// onClick={() => console.log('answer Clicked')}
									>
										answer
									</Button>
								</div>
							)
						}),
						// overflowContent: (
						// 	<div>
						// 		<Button
						// 			size="medium"
						// 			// className={classes.overflowButton}
						// 			startIcon={<Close />}
						// 			// onClick={() => console.log('Dismissed Clicked')}
						// 		>
						// 			dismiss
						// 		</Button>
						// 		<Button
						// 			size="medium"
						// 			// className={classes.overflowButton}
						// 			startIcon={<PhoneIcon />}
						// 			// onClick={() => console.log('answer Clicked')}
						// 		>
						// 			answer
						// 		</Button>
						// 	</div>
						// ),
						timestamp: payload.data.timestamp, // '12:15',
						...(['birthday', 'anniversary'].includes(type) && { personalised: true }),
						...(['birthday', 'anniversary'].includes(type) && { avatar: payload.data.avatar }),
						// avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
						priority: true,
						zDepth: 4,
						autoHide: 5000
					}
				});
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (sessionReducer.addSuccess) {
			dispatch(setSessionData(sessionReducer.addSuccess));
			dispatch(actionsSession.addAck({ AppType: 'Browser' }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionReducer.addSuccess, sessionReducer.addError]);

	return (
		<>
			<FuseNavigation
				// eslint-disable-next-line
				className={clsx('navigation', props.className)}
				navigation={navigation}
				// eslint-disable-next-line
				layout={props.layout}
				// eslint-disable-next-line
				dense={props.dense}
				// eslint-disable-next-line
				active={props.active}
			/>
			<NotificationContext.Provider value={{ notify, dispatchNotify }}>
				<MUINotifications
					desktop
					transitionName={{
						leave: 'dummy',
						leaveActive: 'fadeOut',
						appear: 'dummy',
						appearActive: 'zoomInUp'
					}}
					transitionAppear
					transitionLeave
				/>
			</NotificationContext.Provider>
		</>
	);
}

Navigation.defaultProps = {
	layout: 'vertical',
	dense: null,
	active: null,
	className: null
};

Navigation.propTypes = {
	layout: PropTypes.string,
	dense: PropTypes.string,
	active: PropTypes.bool,
	className: PropTypes.instanceOf(Object)
};

export default React.memo(Navigation);
