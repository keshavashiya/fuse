import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import { Typography, Switch } from '@material-ui/core';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer

import FusePageCarded from '../../../@fuse/core/FusePageCarded';
import FuseAnimate from '../../../@fuse/core/FuseAnimate';
import { showMessage } from '../../store/fuse/messageSlice';

import { messaging } from '../../components/Firebase/Firebase';

import saga from './store/saga';
import { name, actions } from './store/slice';

const INSTANCE_TOKEN = 'instanceToken';
const NOTIFICATION_SUBSCRIBED = 'NotificationSubscribed';
const NOTIFICATIONS_TOPIC = 'Notifications';

const NotificationPermission = () => {
	useInjectSaga({ key: name, saga });

	const dispatch = useDispatch();

	const { Reducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.notificationPermission.notificationPermission,
			user: reducer.auth.user
		}),
		shallowEqual
	);

	const { ParentCompany } = user.data;
	const {
		addSuccess,
		addError,
		subscribeTopicSuccess,
		subscribeTopicError,
		unSubscribeTopicSuccess,
		unSubscribeTopicError,
		deleteSuccess,
		deleteError
	} = Reducer;

	const [state, setState] = useState({
		subscriptionToggleSwitch: false,
		snackbar: false,
		snackbarMessage: ''
	});

	useEffect(() => {
		if (localStorage.getItem(NOTIFICATION_SUBSCRIBED) === 'TRUE') {
			setState({ subscriptionToggleSwitch: true });
		} else {
			setState({ subscriptionToggleSwitch: false });
		}

		return () => {
			dispatch(actions.reset());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const displayMessage = (message, variant = 'error') => {
		dispatch(
			showMessage({
				message,
				autoHideDuration: 5000,
				anchorOrigin: {
					horizontal: 'left',
					vertical: 'bottom'
				},
				variant
			})
		);
	};

	useEffect(() => {
		if (addSuccess) {
			localStorage.setItem(INSTANCE_TOKEN, addSuccess.FcmToken);

			const subscribeData = {
				FcmToken: localStorage.getItem(INSTANCE_TOKEN),
				Topic: NOTIFICATIONS_TOPIC,
				ParentCompany
			};
			dispatch(actions.subscribeTopic(subscribeData));
		} else if (addError) {
			dispatch(
				showMessage({
					message: addError.error.message,
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addSuccess, addError]);

	/* Subscribe */

	useEffect(() => {
		if (subscribeTopicSuccess) {
			localStorage.setItem(NOTIFICATION_SUBSCRIBED, 'TRUE');
			setState({ subscriptionToggleSwitch: true });
			displayMessage(<span>Notifications have been enabled for your device</span>, 'success');
		} else if (subscribeTopicError) {
			setState({ subscriptionToggleSwitch: false });
			displayMessage(<span>Unable to subscribe you to notifications</span>);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subscribeTopicSuccess, subscribeTopicError]);

	/* Un Subscribe */

	useEffect(() => {
		if (unSubscribeTopicSuccess) {
			if (localStorage.getItem(INSTANCE_TOKEN) !== null) {
				const FcmToken = localStorage.getItem(INSTANCE_TOKEN);
				dispatch(actions.delete({ FcmToken }));
			}
			localStorage.removeItem(NOTIFICATION_SUBSCRIBED);

			setState({ subscriptionToggleSwitch: false });
			displayMessage(<span>You have been unsubscribed from notifications</span>, 'success');
		} else if (unSubscribeTopicError) {
			setState({ subscriptionToggleSwitch: false });
			displayMessage(<span>Unsubscribe failed</span>);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unSubscribeTopicSuccess, unSubscribeTopicError]);

	/* Delete Token */
	useEffect(() => {
		if (deleteSuccess) {
			localStorage.removeItem(INSTANCE_TOKEN);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteSuccess, deleteError]);

	/**
	 * Subscribe app instance to notification topic if user permissions given
	 */
	const subscribeNotifications = async () => {
		try {
			/* request permission if not granted */
			if (Notification.permission !== 'granted') {
				await messaging.requestPermission();
			}
			/* get instance token if not available */
			if (localStorage.getItem(INSTANCE_TOKEN) !== null) {
				const subscribeData = {
					FcmToken: localStorage.getItem(INSTANCE_TOKEN),
					Topic: NOTIFICATIONS_TOPIC,
					ParentCompany
				};
				dispatch(actions.subscribeTopic(subscribeData));
			} else {
				const token = await messaging.getToken(); // returns the same token on every invocation until refreshed by browser
				const tokenData = {
					FcmToken: token,
					ParentCompany
				};
				dispatch(actions.add(tokenData));
			}
		} catch (err) {
			if (err && err.code && err.code === 'messaging/permission-blocked') {
				localStorage.removeItem(NOTIFICATION_SUBSCRIBED);
				localStorage.removeItem(INSTANCE_TOKEN);

				setState({
					subscriptionToggleSwitch: false
				});

				displayMessage(
					<span>
						Currently, the web site is blocked from sending notifications. Please unblock the same in your
						browser settings.
					</span>
				);
			}
		}
	};

	/**
	 * Unsubscribe app instance from notification topic
	 */
	const unsubscribeNotifications = async () => {
		const unSubscribeData = {
			FcmToken: localStorage.getItem(INSTANCE_TOKEN),
			Topic: NOTIFICATIONS_TOPIC,
			ParentCompany
		};
		dispatch(actions.unSubscribeTopic(unSubscribeData));
	};

	/**
	 * Subscribe/UnSubscribe appointment notifications
	 * @param {*} event
	 * @param {*} checked If true, the component is checked.
	 */
	const subscriptionToggle = (event, checked) => {
		if (checked) subscribeNotifications();
		else unsubscribeNotifications();
	};

	const renderSubscriptionOptions = () => {
		if (!('serviceWorker' in navigator) && !('PushManager' in window)) {
			return (
				<Typography>
					Notification feature is supported only in:
					<br />
					Chrome Desktop and Mobile (version 50+)
					<br />
					Firefox Desktop and Mobile (version 44+)
					<br />
					Opera on Mobile (version 37+)
				</Typography>
			);
		}
		return (
			<>
				<Switch
					inputProps={{ 'aria-label': 'primary checkbox' }}
					checked={state.subscriptionToggleSwitch}
					onChange={subscriptionToggle}
				/>
			</>
		);
	};

	return (
		<div>
			<FusePageCarded
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<div className="flex items-center">
									<FuseAnimate animation="transition.expandIn" delay={300}>
										<Icon className="text-32">notifications</Icon>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
											Notification Setting
										</Typography>
									</FuseAnimate>
								</div>
							</FuseAnimate>
						</div>
					</div>
				}
				content={
					<div>
						<FuseAnimate animation="transition.slideUpIn" delay={300}>
							<div className="my-32" style={{ marginLeft: '3%' }}>
								{renderSubscriptionOptions()}
							</div>
						</FuseAnimate>
					</div>
				}
				innerScroll
			/>
		</div>
	);
};

export default NotificationPermission;
