/* eslint-disable  react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Typography,
	Divider,
	Grid,
	Icon,
	Button,
	TextField,
	FormControlLabel,
	FormGroup,
	Checkbox,
	List,
	ListItem,
	ListSubheader
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useInjectSaga } from 'redux-injectors'; // useInjectReducer

import validate from 'validate.js';

import FusePageCarded from '../../../../../@fuse/core/FusePageCarded';
import FuseAnimate from '../../../../../@fuse/core/FuseAnimate';

import history from '../../../../../history';

import { showMessage } from '../../../../store/fuse/messageSlice';
import { ObjecttoQueryString } from '../../../../helpers/utils';

import saga from '../store/saga';
import { name as namePermission, actions as actionsPermission } from '../store/slice';

import sagaRoles from '../store/userRolesSaga';
import { name as nameRoles, actions as actionsRoles } from '../store/userRolesSlice';

const schema = {
	Name: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 40
		}
	},
	Permissions: []
};

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		maxWidth: 772,
		paddingBottom: '0px',
		borderStyle: 'solid',
		borderWidth: '1.5px',
		borderRadius: '3px',
		width: '102.5%',
		borderColor: '#C0C0C0'
	},
	demo: {
		// backgroundColor: '#f8f8ff',
		marginTop: '1.6rem',
		// borderStyle: 'double',
		// borderWidth: '1px',
		// borderRadius: '10px',
		paddingLeft: '4px',
		paddingRight: '24px'
	},
	title: {
		margin: theme.spacing(4, 0, 2)
	},
	division: {
		width: '100%'
	},
	margin: {
		marginTop: '16px',
		marginBottom: '16px'
	},
	grid: {
		// marginLeft: '193px',
		alignItems: 'baseline',
		borderWidth: '0.2px',
		borderStyle: 'double',
		borderColor: '#C0C0C0'
	},
	fullDivider: {
		marginLeft: '201px',
		width: '1.5px'
	},
	full: {
		fontWeight: '700',
		textAlign: 'center',
		color: '#696969'
	},
	addDivider: {
		marginLeft: '3px'
	},
	add: {
		paddingLeft: '18px',
		fontWeight: '700',
		color: '#696969'
	},
	deleteDivider: {
		marginLeft: '3px'
	},
	delete: {
		fontWeight: '700',
		paddingLeft: '13px',
		color: '#696969'
	},
	editDivider: {
		marginLeft: '2.5px'
	},
	edit: {
		fontWeight: '700',
		paddingLeft: '20px',
		color: '#696969'
	},
	readDivider: {
		marginLeft: '2.5px'
	},
	read: {
		fontWeight: '700',
		paddingLeft: '16px',
		color: '#696969'
	},
	endDivider: {
		marginLeft: '2.5px'
	},
	header: {
		fontSize: 'medium',
		backgroundColor: '#F5F5F5'
	},
	column: {
		display: 'flex',
		flexDirection: 'column',
		borderWidth: '0.2px',
		borderStyle: 'double',
		borderColor: '#C0C0C0'
	}
}));

const filterParam = {};

const AddPermission = props => {
	useInjectSaga({ key: namePermission, saga });
	useInjectSaga({ key: nameRoles, saga: sagaRoles });

	const theme = useTheme();
	const dispatch = useDispatch();
	const { rolesReducer, permissionsReducer, user } = useSelector(
		reducer => ({
			permissionsReducer: reducer.permissions.permissions,
			rolesReducer: reducer.permissions.roles,
			user: reducer.auth.user
		}),
		shallowEqual
	);

	const { ParentCompany } = user.data;
	// eslint-disable-next-line
	const { edit, selectedData, view } = props.location;

	const { addSuccess, editSuccess, getOneSuccess } = rolesReducer; // loading addError editError

	const { getSuccess, getLoading, deleteSuccess, deleteError } = permissionsReducer;

	const initParams = {
		ParentCompany,
		limit: 500
	};
	const InitialValue = {
		isValid: false,
		values: {
			ParentCompany,
			Permissions: []
		},
		touched: {},
		errors: {}
	};

	const classes = useStyles();

	const [formState, setFormState] = useState(InitialValue);
	// const [checkState, setCheckState] = useState(false);
	const [getOne, setGetOne] = useState(null); // ({ Pemissions: [] });
	const [data, setData] = useState([]);
	const [, setLoading] = useState(true);
	// const [mode, setMode] = useState(false);

	// const [selectedDealer, setSelectedDealer] = useState(null);

	useEffect(() => {
		if (edit) {
			dispatch(actionsRoles.getOne(selectedData));
		}

		return () => {
			dispatch(actionsRoles.reset());
			setFormState(InitialValue);
			setGetOne(null);
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (editSuccess) {
			history.push('/permissions');
		}
		// eslint-disable-next-line
	}, [editSuccess]);

	useEffect(() => {
		if (addSuccess) {
			history.push('/permissions');
		}
		// eslint-disable-next-line
	}, [addSuccess]);

	useEffect(() => {
		if (getOneSuccess) {
			setGetOne(getOneSuccess.Permissions);

			setFormState({
				isValid: false,
				values: getOneSuccess,
				touched: {},
				errors: {}
			});
		}
	}, [getOneSuccess]);

	const getData = async obj => {
		const queryParams = { ...initParams, ...obj };
		const queryStirng = ObjecttoQueryString(queryParams);

		dispatch(actionsPermission.get({ QueryParams: queryStirng }));
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

	useEffect(() => {
		if (deleteError) {
			const errors = deleteError.error;
			if (errors) {
				if (!errors.error) {
					dispatch(
						showMessage({
							message: errors.message,
							autoHideDuration: 5000,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'center'
							},
							variant: 'error'
						})
					);
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteError]);

	useEffect(() => {
		if (deleteSuccess) {
			dispatch(
				showMessage({
					message: 'Feedback Ticket delete successfully',
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);
			getData(filterParam);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteSuccess]);

	const handleCheckboxChange = (event, value) => {
		if (edit) {
			const newArray = [...getOne];
			const obj = { Action: 'Edit' };
			if (event.target.checked) {
				if (value.idPermission) {
					obj.idPermission = value.idPermission;
				}

				if (value.Permission) {
					obj.Permission = value.Permission;
				}

				if (value.Resource) {
					obj.Resource = value.Resource;
				}

				if (value.ResourceAction) {
					obj.ResourceAction = value.ResourceAction;
				}

				newArray.push(obj);
			} else {
				newArray.pop(obj);
			}
			setGetOne(newArray);
		}
		const Permissions = [...formState.values.Permissions];

		const obj = { Action: 'Add' };
		if (event.target.checked) {
			if (value.idPermission) {
				obj.idPermission = value.idPermission;
			}

			if (value.Permission) {
				obj.Permission = value.Permission;
			}

			if (value.Resource) {
				obj.Resource = value.Resource;
			}

			if (value.ResourceAction) {
				obj.ResourceAction = value.ResourceAction;
			}

			Permissions.push(obj);

			for (let i = 0; i < Permissions.length; i += 1) {
				if (Permissions[i].ResourceAction !== 'Read' && event.target.checked === true) {
					for (let j = 0; j < data.length; j += 1) {
						if (data[j].Resource === Permissions[i].Resource) {
							if (data[j].ResourceAction === 'Read') {
								Permissions.push(data[j]);
							}
							// console.log(148, data[j].ResourceAction);
						}
					}
				}
			}
		} else {
			for (let i = 0; i < Permissions.length; i += 1) {
				if (Permissions[i].ResourceAction !== 'Read' && event.target.checked === true) {
					for (let j = 0; j < data.length; j += 1) {
						if (data[j].Resource === Permissions[i].Resource) {
							if (data[j].ResourceAction === 'Read') {
								Permissions.pop(data[j]);
							}
							// console.log(148, data[j].ResourceAction);
						}
					}
				}
			}
			Permissions.pop(obj);
		}

		// console.log(147, Permissions);

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				Permissions
			}
		}));
	};

	const handleFullAccess = (event, value) => {
		if (edit) {
			const newArray = [...getOne];
			if (event.target.checked) {
				for (let i = 0; i < data.length; i += 1) {
					if (value === data[i].Resource) {
						newArray.push({ ...data[i], Action: 'Edit' });
					}
				}
			} else {
				for (let i = 0; i < data.length; i += 1) {
					if (value === data[i].Resource) {
						newArray.pop(data[i]);
					}
				}
			}

			setGetOne(newArray);
		}

		const Permissions = [...formState.values.Permissions];

		if (event.target.checked) {
			for (let i = 0; i < data.length; i += 1) {
				if (value === data[i].Resource) {
					Permissions.push({ ...data[i], Action: 'Add' });
				}
			}
		} else {
			for (let i = 0; i < data.length; i += 1) {
				if (value === data[i].Resource) {
					Permissions.pop(data[i]);
				}
			}
		}

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				Permissions
			}
		}));
	};

	const handleChange = event => {
		event.persist();

		setFormState(value => ({
			...value,
			values: {
				...formState.values,
				[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
			},
			touched: {
				...formState.touched,
				[event.target.name]: true
			}
		}));
	};

	const handleSubmit = event => {
		event.preventDefault();

		const errors = validate(formState.values, schema);

		setFormState(frmState => ({
			...frmState,
			isValid: !errors,
			errors: errors || {}
		}));
		if (errors) return;
		if (!edit) {
			dispatch(actionsRoles.add(formState.values));
		} else {
			dispatch(actionsRoles.edit(formState.values));
		}
	};

	const hasError = field => !!formState.errors[field];

	const groupResource = arr => {
		const obj = {};
		data.forEach(each => {
			if (!arr.includes(each.Resource)) {
				return;
			}
			if (!obj[each.Resource]) {
				obj[each.Resource] = [each];
			} else obj[each.Resource].push(each);
		});
		return obj;
	};

	const crmResourceMap = groupResource([
		'Area',
		'City',
		'Company',
		'Company Brand',
		'Company Sub Type',
		'Contact',
		'Contact Type',
		'Company Sister Concern',
		'State',
		'User Company'
	]);

	const userResourceMap = groupResource(['User']);

	const productResourceMap = groupResource([
		'Pricelist',
		'Product Brand Map',
		'Product Brand',
		'Product Category',
		'Product',
		'Product Sub Category',
		'Product Thickness',
		'Item',
		'Product UOM'
	]);

	const promotionResourceMap = groupResource(['News Article', 'Scheme', 'Slider']);

	const othersResourceMap = groupResource(['Employee Hierarchy', 'Event Contact', 'Event', 'Roles']);

	const feedbackResourceMap = groupResource(['Ticket', 'Ticket Type']);

	const columnGroup = [
		{ title: 'CRM', resourceMap: crmResourceMap },
		{ title: 'User Management', resourceMap: userResourceMap },
		{ title: 'Products', resourceMap: productResourceMap },
		{ title: 'Promotions', resourceMap: promotionResourceMap },
		{ title: 'Others', resourceMap: othersResourceMap },
		{ title: 'Feedback', resourceMap: feedbackResourceMap }
	];

	const handleCheck = value => {
		let response = false;
		if (getOne) {
			for (let i = 0; i < getOne.length; i += 1) {
				if (getOne[i].idPermission === value.idPermission) {
					response = true;
				}
			}
		} else if (formState.values.Permissions) {
			for (let i = 0; i < formState.values.Permissions.length; i += 1) {
				if (formState.values.Permissions[i].idPermission === value.idPermission) {
					response = true;
				}
			}
		}
		return response;
	};

	return (
		<div>
			<FusePageCarded
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/permissions"
									color="inherit">
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									{/* <span className="mx-4">Item</span> */}
									<FuseAnimate animation="transition.expandIn" delay={300}>
										<Icon className="text-32">assignment_ind</Icon>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideRightIn" delay={300}>
										<div className="flex items-center">
											<FuseAnimate animation="transition.slideLeftIn" delay={300}>
												<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
													{selectedData && selectedData.Name ? selectedData.Name : 'New Role'}
												</Typography>
											</FuseAnimate>
										</div>
									</FuseAnimate>
								</Typography>
							</FuseAnimate>
						</div>
						{view ? null : (
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap normal-case"
									variant="contained"
									color="secondary"
									type="submit"
									// disabled={!canBeSubmitted()}
									onClick={handleSubmit}>
									Save
									{/* {btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />} */}
								</Button>
							</FuseAnimate>
						)}
					</div>
				}
				content={
					<div className="flex flex-row w-full p-16 ">
						<Grid container className="flex flex-1 w-full">
							<Grid
								item
								xl={12}
								lg={12}
								md={12}
								sm={12}
								xs={12}
								className="flex-1 flex w-full flex-row items-center">
								<Grid className="flex-1 w-full mt-4" item xl={9} lg={9} md={9} xs={12} sm={12}>
									<Grid
										item
										xl={8}
										lg={8}
										md={8}
										sm={12}
										xs={12}
										className="flex-1 flex w-full pr-10 flex-col">
										<TextField
											fullWidth
											className="mb-6"
											margin="dense"
											name="Name"
											label="Role Name"
											value={formState.values.Name || ''}
											type="text"
											onChange={handleChange}
											error={hasError('Name')}
											helperText={hasError('Name') ? formState.errors.Name[0] : null}
											variant="outlined"
											disabled={view}
											required
											inputProps={{ maxLength: 40 }}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid
								container
								item
								// spacing={2}
								xl={12}
								lg={12}
								md={12}
								sm={12}
								xs={12}
								className=" flex flex-row items-center">
								<Grid item xl={4} lg={4} md={4} sm={12} xs={12} className="flex flex-col px-8 py-16">
									<Divider />
								</Grid>
							</Grid>
							{data.length > 0 && (
								<Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
									<div className={classes.demo}>
										{columnGroup.map(col => (
											<div className={classes.margin}>
												<List
													subheader={
														<ListSubheader className={classes.header}>
															{col.title}
														</ListSubheader>
													}
													className={classes.root}>
													<hr className={classes.division} />
													<Grid container className={classes.grid}>
														<Divider
															className={classes.fullDivider}
															orientation="vertical"
															flexItem
														/>
														<Grid item xs={1} className={classes.full}>
															Full Access
														</Grid>
														<Divider
															className={classes.addDivider}
															orientation="vertical"
															flexItem
														/>
														<Grid item xs={1} className={classes.add}>
															Add
														</Grid>
														<Divider
															className={classes.deleteDivider}
															orientation="vertical"
															flexItem
														/>
														<Grid item xs={1} className={classes.delete}>
															Delete
														</Grid>
														<Divider
															className={classes.editDivider}
															orientation="vertical"
															flexItem
														/>
														<Grid item xs={1} className={classes.edit}>
															Edit
														</Grid>
														<Divider
															className={classes.readDivider}
															orientation="vertical"
															flexItem
														/>
														<Grid item xs={1} className={classes.read}>
															Read
														</Grid>
														<Divider
															className={classes.endDivider}
															orientation="vertical"
															flexItem
														/>
													</Grid>
													<ListItem className="p-0">
														<Grid
															container
															item
															// spacing={2}
															xl={12}
															lg={12}
															md={12}
															sm={12}
															xs={12}
															className=" flex flex-row">
															{Object.entries(col.resourceMap).map(([key, value]) => {
																return (
																	<Grid
																		item
																		xl={12}
																		lg={12}
																		md={12}
																		sm={12}
																		xs={12}
																		className={classes.column}>
																		<div className="flex flex-1 flex-row ">
																			<Grid
																				item
																				xl={3}
																				lg={3}
																				md={3}
																				sm={12}
																				xs={12}
																				className="flex flex-1 flex-col pl-8 pt-8">
																				{key}
																			</Grid>
																			<Divider
																				className="mx-12 "
																				orientation="vertical"
																				flexItem
																			/>

																			<Grid
																				item
																				xl={12}
																				lg={12}
																				md={12}
																				sm={12}
																				xs={12}
																				className="flex flex-1 flex-col">
																				<FormGroup className="flex-row">
																					<FormControlLabel
																						// value={val.ResourceAction}
																						onChange={e =>
																							handleFullAccess(e, key)
																						}
																						className="px-0 mx-0"
																						control={
																							<Checkbox
																								color="secondary"
																								disabled={view}
																								// checked={handleCheck(
																								// 	val
																								// )}
																							/>
																						}
																						// label="Full Access"
																						// labelPlacement="top"
																					/>
																					<Divider
																						className="mx-12 "
																						orientation="vertical"
																						flexItem
																					/>
																					{value.map(val => {
																						return (
																							<>
																								<FormControlLabel
																									value={
																										val.ResourceAction
																									}
																									onChange={e =>
																										handleCheckboxChange(
																											e,
																											val
																										)
																									}
																									className="mx-0 px-0"
																									control={
																										<Checkbox
																											color="secondary"
																											disabled={
																												view
																											}
																											checked={handleCheck(
																												val
																											)}
																										/>
																									}
																									// label={
																									// 	val.ResourceAction
																									// }
																									// labelPlacement="top"
																								/>
																								<Divider
																									className="mx-12 "
																									orientation="vertical"
																									flexItem
																								/>
																							</>
																						);
																					})}
																				</FormGroup>
																			</Grid>
																		</div>
																	</Grid>
																);
															})}
														</Grid>
													</ListItem>
												</List>
											</div>
										))}
									</div>
									{/* <div className={classes.demo}>
										<List
											subheader={<ListSubheader>Promotions</ListSubheader>}
											className={classes.root}>
											<hr className={classes.division} />
											<ListItem>Data of this section</ListItem>
										</List>
									</div> */}
								</Grid>
							)}

							<Divider className="mx-12 " orientation="vertical" flexItem />
						</Grid>
					</div>
				}
				innerScroll
			/>
		</div>
	);
};

export default AddPermission;
