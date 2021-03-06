/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Typography, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import moment from 'moment';
import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import { ObjecttoQueryString } from '../../helpers/utils';
import FusePageCarded from '../../../@fuse/core/FusePageCarded';
import FuseAnimate from '../../../@fuse/core/FuseAnimate';
import saga from './store/fetchSaga';
import { name, actions } from './store/fetchSlice';

const useStyles = makeStyles(theme => ({
	contactListItem: {
		borderTop: `1px solid ${theme.palette.divider}`,
		borderBottom: `1px solid ${theme.palette.divider}`,
		'&.active': {
			backgroundColor: theme.palette.background.paper
		}
	},
	unreadBadge: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	}
}));

const Notification = () => {
	useInjectSaga({ key: name, saga });
	const classes = useStyles();
	const dispatch = useDispatch();
	const {
		authSessionReducer,
		Reducer
		// user
	} = useSelector(
		reducer => ({
			authSessionReducer: reducer.auth.session,
			Reducer: reducer.notificationPermission.notifications,
			user: reducer.auth.user

			// settingReducer: settingReducer: reducer.setting.setting
		}),
		shallowEqual
	);
	// const { ParentCompany } = user.data;

	const { getSuccess, getLoading } = Reducer;

	const initParams = {
		// ParentCompany,
		limit: 10,
		pagination: 'yes'
	};

	const [count, setCount] = useState(0);
	const [data, setData] = useState([]);
	const [, setLoading] = useState(true);
	// const [noteMenu] = useState(null);

	const getData = async obj => {
		const queryParams = { ...initParams, ...obj };
		const queryStirng = ObjecttoQueryString(queryParams);

		dispatch(actions.get({ QueryParams: queryStirng }));
	};

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getLoading]);

	useEffect(() => {
		if (getSuccess) {
			setData(getSuccess.data);
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getSuccess]);

	// useEffect(() => {
	// 	if (deleteError) {
	// 		const errors = deleteError.error;
	// 		if (errors) {
	// 			if (!errors.error) {
	// 				dispatch(
	// 					showMessage({
	// 						message: errors.message,
	// 						autoHideDuration: 5000,
	// 						anchorOrigin: {
	// 							vertical: 'top',
	// 							horizontal: 'center'
	// 						},
	// 						variant: 'error'
	// 					})
	// 				);
	// 			}
	// 		}
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [deleteError]);

	// useEffect(() => {
	// 	if (deleteSuccess) {
	// 		dispatch(
	// 			showMessage({
	// 				message: 'Feedback Ticket delete successfully',
	// 				autoHideDuration: 5000,
	// 				anchorOrigin: {
	// 					vertical: 'top',
	// 					horizontal: 'center'
	// 				},
	// 				variant: 'success'
	// 			})
	// 		);
	// 		getData(filterParam);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [deleteSuccess]);

	useEffect(() => {
		if (authSessionReducer.Notification) {
			if (authSessionReducer.Notification.Count) {
				setCount(authSessionReducer.Notification.Count);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authSessionReducer.Notification]);

	const grouping = () => {
		const obj = {};

		data.slice().forEach(each => {
			if (!obj[moment(each.CreatedDate).format('DD MMM YY')]) {
				obj[moment(each.CreatedDate).format('DD MMM YY')] = [each];
			} else obj[moment(each.CreatedDate).format('DD MMM YY')].push(each);
		});
		return obj;
	};

	const groupedArray = grouping();

	return (
		<div>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					content: 'max-w-512'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<div className="flex items-center">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h5">
											Notifications
										</Typography>
									</FuseAnimate>
								</div>
							</FuseAnimate>
						</div>
					</div>
				}
				content={
					<div style={{ borderRightWidth: '0.2px', borderStyle: 'ridge' }}>
						<div className="my-32" style={{ marginLeft: '3%' }}>
							Notification List ( {count} )
						</div>
						{data &&
							Object.entries(groupedArray).map(([key, value]) => {
								return (
									<>
										<Typography
											className="flex flex-col flex-1 items-center justify-center py-8"
											style={{ backgroundColour: '#F5F5F5', fontWeight: 600 }}>
											{key === moment().format('DD MMM YY')
												? 'Today'
												: key ===
												  moment().subtract(1, 'days').calendar(null, { lastDay: 'DD MMM YY' })
												? 'Yesterday'
												: key}
										</Typography>

										<div>
											{value.map(item => {
												return (
													<ListItem
														key={item.idNotificationObject}
														button
														className={clsx(
															classes.contactListItem,
															'px-16 py-12 min-h-92'
														)}
														// onClick={() => onTicketClick()}
													>
														{/* {lastCommentBy === 'C' ? (
															<div className="relative">
																<CallMadeIcon />
															</div>
														) : (
															<div className="relative">
																<CallReceivedIcon />
															</div>
														)} */}
														<ListItemText
															classes={{
																root: 'min-w-px px-16',
																secondary: 'truncate'
															}}
															primary={
																<>
																	{item.typeModule}{' '}
																	{/* <Typography
																	component="span"
																	variant="body2"
																	className={classes.inline}
																	color="textSecondary">
																	({companyType})
																</Typography> */}
																	<Typography color="textSecondary" className="mb-2">
																		{item.Message}
																		{/* Ticket Id: {ticketId} | type: {type} */}
																	</Typography>
																</>
															}
															secondary={
																<>
																	<Typography
																		component="span"
																		variant="body2"
																		className={classes.inline}
																		color="textSecondary">
																		{/* {firstName}:{' '} */}
																		{/* {moment(item.CreatedDate).calendar(null, {
																			lastDay: '[Yesterday]',
																			sameDay: 'h:mm a',
																			lastWeek: 'DD MMM YY',
																			sameElse: 'DD MMM YY'
																		})} */}
																		{moment(item.CreatedDate).fromNow()}
																	</Typography>
																	{/* {comment} */}
																</>
															}
														/>

														<div className="flex flex-col justify-center items-end">
															<Avatar
																// className="avatar absolute ltr:left-0 rtl:right-0 m-0 -mx-32"
																style={{ marginBottom: '12px', marginRight: '24px' }}
																src={item.ProfilePic}
															/>
															<div className="flex items-center justify-center min-w-24 max-w-96 h-24 p-8 text-14 text-center">
																{item.SenderName}
															</div>
															{item.Status === 2 && (
																<div
																	className={clsx(
																		classes.unreadBadge,
																		'flex items-center justify-center min-w-24 h-24 rounded-full text-14 text-center'
																	)}>
																	.
																</div>
															)}
														</div>
													</ListItem>
												);
											})}
										</div>
									</>
								);
							})}
					</div>
				}
				innerScroll
			/>
		</div>
	);
};

export default Notification;

// Object.entries(groupedArray).map(([key, value]) => {
// 	return (
// 		<>
// 			<Typography className="flex flex-col flex-1 items-center justify-center">
// 				{/* {moment(key).calendar(null, {
// 							lastDay: '[Yesterday]',
// 							sameDay: 'h:mm a',
// 							lastWeek: 'DD MMM YY',
// 							sameElse: 'DD MMM YY'
// 						})} */}
// 				{/* {function daylog() {
// 					let ans;
// 					if (key === moment().format('DD MMM YY')) {
// 						ans = 'Today';
// 					} else if (
// 						key ===
// 						moment().subtract(1, 'days').calendar(null, { lastDay: 'DD MMM YY' })
// 					) {
// 						ans = 'Yesterday';
// 					} else {
// 						ans = key;
// 					}
// 					return ans;
// 				}} */}

// 				{key === moment().format('DD MMM YY')
// 					? 'Today'
// 					: key === moment().subtract(1, 'days').calendar(null, { lastDay: 'DD MMM YY' })
// 					? 'Yesterday'
// 					: key}
// 			</Typography>
