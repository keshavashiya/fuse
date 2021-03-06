/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextField, Typography, Icon, Button, Grid, Paper } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useInjectSaga } from 'redux-injectors';

import validate from 'validate.js';

// import { setAuthRoles } from './authRoleSlice';
import { setAuthRoles } from '../../../../auth/store/authRoleSlice';
import authService from '../../../../services/authService';

// import { setNewNavigation } from '../../store/fuse/navigationSlice';
import { setNewNavigation } from '../../../../store/fuse/navigationSlice';

import FusePageCarded from '../../../../../@fuse/core/FusePageCarded';
import FuseAnimate from '../../../../../@fuse/core/FuseAnimate';
import history from '../../../../../history';
import { showMessage } from '../../../../store/fuse/messageSlice';

import { ObjecttoQueryString, groupBy, removeObjectFromArray } from '../../../../helpers/utils';
import { CheckboxGroup } from '../../../../components';

import saga from '../store/saga';
import { name as namePermission, actions as actionsPermission } from '../store/slice';

import sagaRoles from '../store/userRolesSaga';
import { name as nameRoles, actions as actionsRoles } from '../store/userRolesSlice';

import sagaAuthRole from '../../../auth/store/authRoleSaga';
import { name as nameAuthRole, actions as actionsAuthRole } from '../../../auth/store/authRoleSlice';

const schema = {
	Name: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 40
		}
	}
};

const AddPermission = props => {
	const theme = useTheme();

	useInjectSaga({ key: namePermission, saga });
	useInjectSaga({ key: nameRoles, saga: sagaRoles });
	useInjectSaga({ key: nameAuthRole, saga: sagaAuthRole });

	const dispatch = useDispatch();
	const { rolesReducer, permissionsReducer, user, authRoleReducer } = useSelector(
		reducer => ({
			permissionsReducer: reducer.permissions.permissions,
			rolesReducer: reducer.permissions.roles,
			user: reducer.auth.user,
			authRoleReducer: reducer.signin.authrole
		}),
		shallowEqual
	);

	// eslint-disable-next-line
	const { edit, selectedData, view } = props.location;

	const { ParentCompany } = user.data;

	const { addSuccess, addError, editSuccess, editError, getOneSuccess } = rolesReducer;
	const { getSuccess, getDistinctSuccess } = permissionsReducer;

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

	const [formState, setFormState] = useState(InitialValue);
	const [checkBoxState, setCheckBoxState] = useState(null);
	const [headerState, setHeaderState] = useState(null);

	const inputRef = useRef(null);

	useEffect(() => {
		dispatch(actionsPermission.getDistinct());
		if (edit) {
			dispatch(actionsRoles.getOne(selectedData));
		} else if (!edit && !view) {
			const queryParams = { ...initParams };
			const queryStirng = ObjecttoQueryString(queryParams);

			dispatch(actionsPermission.get({ QueryParams: queryStirng }));
		}

		if (!edit) {
			const timer = setTimeout(() => {
				clearTimeout(timer);
				if (inputRef && inputRef.current) {
					inputRef.current.focus();
				}
			}, 500);
		}

		return () => {
			dispatch(actionsPermission.reset());
			dispatch(actionsRoles.reset());
			setFormState(InitialValue);
			setCheckBoxState(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (addError) {
			const errors = addError.error;
			if (errors) {
				if (errors.error) {
					setFormState(frmState => ({
						...frmState,
						isValid: !errors.error,
						errors: errors.error || {}
					}));
				} else {
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
	}, [addError]);

	useEffect(() => {
		if (addSuccess) {
			if (formState.values.Name === user.role[0]) {
				dispatch(actionsAuthRole.authRole());
			} else {
				dispatch(
					showMessage({
						message: 'Role Permission added successfully',
						autoHideDuration: 5000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);

				dispatch(actionsRoles.reset());
				dispatch(actionsPermission.reset());
				setFormState(InitialValue);

				const timer = setTimeout(() => {
					clearTimeout(timer);
					history.push('/permissions');
				}, 700);
			}
		}
		// eslint-disable-next-line
	}, [addSuccess]);

	useEffect(() => {
		if (editError) {
			const errors = editError.error;
			if (errors) {
				if (errors.error) {
					setFormState(frmState => ({
						...frmState,
						isValid: !errors.error,
						errors: errors.error || {}
					}));
				} else {
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
	}, [editError]);

	useEffect(() => {
		if (authRoleReducer.Success) {
			authService.setAuthRoles(JSON.stringify(authRoleReducer.Success));
			dispatch(setAuthRoles());
			setTimeout(() => {
				dispatch(setNewNavigation());
				dispatch(
					showMessage({
						message: `Role Permission ${edit ? 'edit' : 'added'} successfully`,
						autoHideDuration: 5000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);

				const timer = setTimeout(() => {
					clearTimeout(timer);
					dispatch(actionsRoles.reset());
					dispatch(actionsPermission.reset());
					dispatch(actionsAuthRole.reset());
					setFormState(InitialValue);
					history.push('/permissions');
				}, 700);
			}, 200);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authRoleReducer]);

	useEffect(() => {
		if (editSuccess) {
			if (formState.values.Name === user.role[0]) {
				dispatch(actionsAuthRole.authRole());
			} else {
				dispatch(
					showMessage({
						message: 'Role Permission edit successfully',
						autoHideDuration: 5000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);

				const timer = setTimeout(() => {
					clearTimeout(timer);
					dispatch(actionsRoles.reset());
					dispatch(actionsPermission.reset());
					setFormState(InitialValue);
					history.push('/permissions');
				}, 700);
			}
		}
		// eslint-disable-next-line
	}, [editSuccess]);

	useEffect(() => {
		if (getSuccess) {
			// Added extra property for the render checkbox
			const result = getSuccess.data.map(obj => ({
				...obj,
				value: obj.idPermission,
				label: obj.ResourceAction,
				checked: obj.Checked === 1
			}));

			// eslint-disable-next-line func-names
			const prepareFormSate = result.filter(function (obj) {
				return obj.checked === true;
			});

			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					Permissions: prepareFormSate
				}
			}));

			// Group by Resource, Area, City etc
			const groupByResource = groupBy(result, a => a.Resource);

			// set State for Render CheckBox
			setCheckBoxState(groupByResource);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getSuccess]);

	useEffect(() => {
		if (getDistinctSuccess) {
			setHeaderState(getDistinctSuccess);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getDistinctSuccess]);

	useEffect(() => {
		if (getOneSuccess) {
			const result = getOneSuccess.Permissions.map(obj => ({
				...obj,
				value: obj.idPermission,
				label: obj.ResourceAction,
				checked: obj.Checked === '1',
				disabled: !!(
					obj.ResourceAction === 'Read' &&
					getOneSuccess.Permissions.filter(
						d => d.Resource === obj.Resource && d.ResourceAction !== 'Read' && d.Checked === '1'
					).length > 0
				)
			}));

			// eslint-disable-next-line func-names
			const prepareFormSate = result.filter(function (obj) {
				return obj.checked === true;
			});

			setFormState({
				isValid: false,
				values: {
					idRole: getOneSuccess.idRole,
					Name: getOneSuccess.Name,
					Permissions: prepareFormSate
				},
				touched: {},
				errors: {}
			});

			// Group by Resource, Area, City etc
			const groupByResource = groupBy(result, a => a.Resource);

			// set State for Render CheckBox
			setCheckBoxState(groupByResource);
		}
	}, [getOneSuccess]);

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

	// eslint-disable-next-line no-shadow
	const handleCheckboxgroupChange = (updatedUsecaseCBState, props) => {
		const newArr = [];
		let newFormState = [];
		const Permissions = [...formState.values.Permissions];
		newFormState = Permissions;

		const newCBState = [...updatedUsecaseCBState];

		const findCB = updatedUsecaseCBState.filter(d => d.ResourceAction !== 'Read' && d.checked === true).length > 0;

		const idx = newCBState.findIndex(d => d.ResourceAction === 'Read');
		if (findCB) {
			newCBState[idx].checked = true;
			newCBState[idx].disabled = true;
		} else {
			// newCBState[idx].checked = false;
			newCBState[idx].disabled = false;
		}

		newCBState.forEach(element => {
			if (!edit) {
				if (element.checked) {
					if (element.Action === 'Delete') {
						const rm = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
						newFormState = rm;
					} else {
						const newElement = { ...element, Action: 'Add', Checked: '1' };
						newArr.push(newElement);
					}
				} else if (!element.checked) {
					removeObjectFromArray(newArr, 'idPermission', element.idPermission);
					const rm = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
					newFormState = rm;
				}
			} else if (edit) {
				const findElement = getOneSuccess.Permissions.find(
					obj => obj.idPermission === element.idPermission && obj.Checked === '1'
				);
				if (element.checked) {
					if (!findElement) {
						const newElement = { ...element, Action: 'Add', Checked: '1' };
						newArr.push(newElement);
					} else {
						const newElement = { ...element };
						delete newElement.Action;
						newArr.push(newElement);
					}
				} else if (!element.checked) {
					if (findElement) {
						const newElement = { ...element, Action: 'Delete' };
						newArr.push(newElement);
					} else {
						const rm = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
						newFormState = rm;
						removeObjectFromArray(newArr, 'idPermission', element.idPermission);
					}
				}
			}
		});

		// newCBState.forEach(element => {
		// 	const found = Permissions.find(obj => obj.idPermission === element.idPermission);

		// 	if (element.checked) {
		// 		if (found) {
		// 			if (found.Action === 'Delete') {
		// 				const removed = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
		// 				newFormState = removed;
		// 				newArr.push(element);
		// 			}
		// 		} else {
		// 			const newElement = { ...element, Action: 'Add' };
		// 			newArr.push(newElement);
		// 		}
		// 	} else if (!element.checked) {
		// 		if (found) {
		// 			if (found.Action === 'Add') {
		// 				console.log('FOUND ADD', element);
		// 				const removed = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
		// 				newFormState = removed;
		// 				console.log('REMOVED');
		// 				console.log(removed);
		// 			} else if (!found.Action) {
		// 				console.log('NOT FOUND', element);
		// 				const x = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
		// 				newFormState = x;
		// 				const newElement = { ...element, Action: 'Delete' };
		// 				newArr.push(newElement);
		// 			} else if (found.Action === 'Delete') {
		// 				console.log('FOUND DELETE', element);
		// 				const removed = removeObjectFromArray(newFormState, 'idPermission', element.idPermission);
		// 				newFormState = removed;
		// 			}
		// 		}
		// 	}
		// });

		newArr.forEach(element => {
			const indx = newFormState.findIndex(el => el.idPermission === element.idPermission);
			if (indx > -1) {
				newFormState[indx] = element;
			} else {
				newFormState.push(element);
			}
		});

		const newState = newFormState;

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				Permissions: newState
			}
		}));

		//		const found = updatedUsecaseCBState.find(obj => obj.ResourceAction === 'Read');

		setCheckBoxState(value => ({
			...value,
			// eslint-disable-next-line react/prop-types
			[props.id]: newCBState
		}));
	};

	const hasError = field => !!formState.errors[field];

	// eslint-disable-next-line consistent-return
	const renderHeader = () => {
		if (headerState) {
			const items = [];

			items.push(
				<Grid item container direction="column" key="Permission" sm={4}>
					<Grid item>
						<Paper variant="outlined" square elevation={0} style={{ height: '5vh', textAlign: 'center' }}>
							<Typography style={{ margin: 10 }}>Permission</Typography>
						</Paper>
					</Grid>
				</Grid>
			);

			items.push(
				<Grid item container key="FullAccess" direction="column" sm={1}>
					<Grid item>
						<Paper variant="outlined" square elevation={0} style={{ height: '5vh', textAlign: 'center' }}>
							<Typography style={{ margin: '10px 0 10px 0' }}>Full Access</Typography>
						</Paper>
					</Grid>
				</Grid>
			);
			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(headerState)) {
				items.push(
					<Grid item container direction="column" sm={1} key={key} style={{ padding: 0 }}>
						<Grid item>
							<Paper elevation={0} variant="outlined" square style={{ height: '5vh' }}>
								<Typography style={{ margin: 10, textAlign: 'center' }}>
									{value.ResourceAction}
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				);
			}
			return items;
		}
	};

	// eslint-disable-next-line consistent-return
	const renderCheckboxes = () => {
		if (checkBoxState) {
			const items = [];
			let GroupName = '';
			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(checkBoxState)) {
				if (GroupName !== value[0].GroupName) {
					items.push(
						<Grid
							item
							container
							spacing={1}
							justify="flex-start"
							key={value[0].GroupName}
							style={{ padding: 0 }}>
							<Grid item container direction="column" sm={9}>
								<Grid
									item
									style={{
										backgroundColor: '#F5F5F5',
										borderStyle: 'ridge',
										borderWidth: ' 1.5px',
										borderColor: 'ghostwhite'
									}}>
									<Paper
										variant="outlined"
										square
										elevation={0}
										style={{
											height: '3vh',
											border: 0,
											backgroundColor: '#F5F5F5',
											marginBottom: '2px'
										}}>
										<Typography style={{ margin: 10, textAlign: 'center', fontWeight: 500 }}>
											{value[0].GroupName}
										</Typography>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
					);
				}
				items.push(
					<Grid
						item
						container
						// xl={9}
						// lg={9}
						// md={9}
						// sm={12}
						// xs={12}
						spacing={1}
						justify="flex-start"
						key={key}
						style={{ padding: 0 }}>
						<CheckboxGroup
							key={key}
							id={key}
							checkboxes={value}
							onCheckboxGroupChange={handleCheckboxgroupChange}
						/>
					</Grid>
				);

				GroupName = value[0].GroupName;
			}

			return items;
		}
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
							<Grid item xs={4}>
								<TextField
									fullWidth
									autoComplete="off"
									className="mb-16"
									name="Name"
									label="Role"
									margin="dense"
									inputRef={inputRef}
									value={formState.values.Name || ''}
									type="text"
									onChange={handleChange}
									error={hasError('Name')}
									helperText={hasError('Name') ? formState.errors.Name[0] : null}
									variant="outlined"
									required
									disabled={view}
									inputProps={{ maxLength: 40 }}
								/>
							</Grid>
							<Grid container spacing={1} justify="flex-start">
								<Grid item container justify="flex-start" style={{ padding: 0 }}>
									{renderHeader()}
								</Grid>
								{renderCheckboxes()}
							</Grid>
						</Grid>
					</div>
				}
				innerScroll
			/>
		</div>
	);
};

AddPermission.propTypes = {
	view: PropTypes.bool,
	edit: PropTypes.bool,
	selectedData: PropTypes.instanceOf(Object)
};

AddPermission.defaultProps = {
	view: false,
	edit: false,
	selectedData: null
};

export default AddPermission;

// /* eslint-disable react/prop-types */
// import React, { useRef, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { TextField, Typography, Icon, Button, Grid, Paper } from '@material-ui/core';
// import { useTheme } from '@material-ui/styles';

// import { useSelector, useDispatch, shallowEqual } from 'react-redux';
// import { useInjectSaga } from 'redux-injectors';

// import validate from 'validate.js';

// import FusePageCarded from '../../../../../@fuse/core/FusePageCarded';
// import FuseAnimate from '../../../../../@fuse/core/FuseAnimate';
// import history from '../../../../../history';
// import { showMessage } from '../../../../store/fuse/messageSlice';

// import { ObjecttoQueryString, groupBy, removeObjectFromArray } from '../../../../helpers/utils';
// import { CheckboxGroup } from '../../../../components';

// import saga from '../store/saga';
// import { name as namePermission, actions as actionsPermission } from '../store/slice';

// import sagaRoles from '../store/userRolesSaga';
// import { name as nameRoles, actions as actionsRoles } from '../store/userRolesSlice';

// const schema = {
// 	Name: {
// 		presence: { allowEmpty: false, message: 'is required' },
// 		length: {
// 			maximum: 40
// 		}
// 	}
// };

// const AddPermission = props => {
// 	const theme = useTheme();

// 	useInjectSaga({ key: namePermission, saga });
// 	useInjectSaga({ key: nameRoles, saga: sagaRoles });

// 	const dispatch = useDispatch();
// 	const { rolesReducer, permissionsReducer, user } = useSelector(
// 		reducer => ({
// 			permissionsReducer: reducer.permissions.permissions,
// 			rolesReducer: reducer.permissions.roles,
// 			user: reducer.auth.user
// 		}),
// 		shallowEqual
// 	);

// 	// eslint-disable-next-line
// 	const { edit, selectedData, view } = props.location;

// const { ParentCompany } = user.data;

// 	const { addSuccess, addError, editSuccess, editError, getOneSuccess } = rolesReducer;
// 	const { getSuccess, getDistinctSuccess } = permissionsReducer;

// 	const initParams = {
// 		ParentCompany,
// 		limit: 500
// 	};

// 	const InitialValue = {
// 		isValid: false,
// 		values: {
// 			ParentCompany,
// 			Permissions: []
// 		},
// 		touched: {},
// 		errors: {}
// 	};

// 	const [formState, setFormState] = useState(InitialValue);
// 	const [checkBoxState, setCheckBoxState] = useState(null);
// 	const [headerState, setHeaderState] = useState(null);

// 	const inputRef = useRef(null);

// 	useEffect(() => {
// 		dispatch(actionsPermission.getDistinct());
// 		if (edit) {
// 			dispatch(actionsRoles.getOne(selectedData));
// 		} else if (!edit && !view) {
// 			const queryParams = { ...initParams };
// 			const queryStirng = ObjecttoQueryString(queryParams);

// 			dispatch(actionsPermission.get({ QueryParams: queryStirng }));
// 		}

// 		if (!edit) {
// 			const timer = setTimeout(() => {
// 				clearTimeout(timer);
// 				if (inputRef && inputRef.current) {
// 					inputRef.current.focus();
// 				}
// 			}, 500);
// 		}

// 		return () => {
// 			dispatch(actionsPermission.reset());
// 			dispatch(actionsRoles.reset());
// 			setFormState(InitialValue);
// 			setCheckBoxState(null);
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);

// 	useEffect(() => {
// 		if (addError) {
// 			const errors = addError.error;
// 			if (errors) {
// 				if (errors.error) {
// 					setFormState(frmState => ({
// 						...frmState,
// 						isValid: !errors.error,
// 						errors: errors.error || {}
// 					}));
// 				} else {
// 					dispatch(
// 						showMessage({
// 							message: errors.message,
// 							autoHideDuration: 5000,
// 							anchorOrigin: {
// 								vertical: 'top',
// 								horizontal: 'center'
// 							},
// 							variant: 'error'
// 						})
// 					);
// 				}
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [addError]);

// 	useEffect(() => {
// 		if (addSuccess) {
// 			dispatch(
// 				showMessage({
// 					message: 'Role Permission added successfully',
// 					autoHideDuration: 5000,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					},
// 					variant: 'success'
// 				})
// 			);

// 			dispatch(actionsRoles.reset());
// 			dispatch(actionsPermission.reset());
// 			setFormState(InitialValue);

// 			const timer = setTimeout(() => {
// 				clearTimeout(timer);
// 				history.push('/permissions');
// 			}, 700);
// 		}
// 		// eslint-disable-next-line
// 	}, [addSuccess]);

// 	useEffect(() => {
// 		if (editError) {
// 			const errors = editError.error;
// 			if (errors) {
// 				if (errors.error) {
// 					setFormState(frmState => ({
// 						...frmState,
// 						isValid: !errors.error,
// 						errors: errors.error || {}
// 					}));
// 				} else {
// 					dispatch(
// 						showMessage({
// 							message: errors.message,
// 							autoHideDuration: 5000,
// 							anchorOrigin: {
// 								vertical: 'top',
// 								horizontal: 'center'
// 							},
// 							variant: 'error'
// 						})
// 					);
// 				}
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [editError]);

// 	useEffect(() => {
// 		if (editSuccess) {
// 			dispatch(
// 				showMessage({
// 					message: 'Role Permission edit successfully',
// 					autoHideDuration: 5000,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					},
// 					variant: 'success'
// 				})
// 			);

// 			const timer = setTimeout(() => {
// 				clearTimeout(timer);
// 				dispatch(actionsRoles.reset());
// 				dispatch(actionsPermission.reset());
// 				setFormState(InitialValue);
// 				history.push('/permissions');
// 			}, 700);
// 		}
// 		// eslint-disable-next-line
// 	}, [editSuccess]);

// 	useEffect(() => {
// 		if (getSuccess) {
// 			// Added extra property for the render checkbox
// 			const result = getSuccess.data.map(obj => ({
// 				...obj,
// 				value: obj.idPermission,
// 				label: obj.ResourceAction,
// 				checked: obj.Checked === 1
// 			}));

// 			// eslint-disable-next-line func-names
// 			const prepareFormSate = result.filter(function (obj) {
// 				return obj.checked === true;
// 			});

// 			setFormState(frmState => ({
// 				...frmState,
// 				values: {
// 					...frmState.values,
// 					Permissions: prepareFormSate
// 				}
// 			}));

// 			// Group by Resource, Area, City etc
// 			const groupByResource = groupBy(result, a => a.Resource);

// 			// set State for Render CheckBox
// 			setCheckBoxState(groupByResource);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [getSuccess]);

// 	useEffect(() => {
// 		if (getDistinctSuccess) {
// 			setHeaderState(getDistinctSuccess);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [getDistinctSuccess]);

// 	useEffect(() => {
// 		if (getOneSuccess) {
// 			const result = getOneSuccess.Permissions.map(obj => ({
// 				...obj,
// 				value: obj.idPermission,
// 				label: obj.ResourceAction,
// 				checked: obj.Checked === '1'
// 			}));

// 			// eslint-disable-next-line func-names
// 			const prepareFormSate = result.filter(function (obj) {
// 				return obj.checked === true;
// 			});

// 			setFormState({
// 				isValid: false,
// 				values: {
// 					idRole: getOneSuccess.idRole,
// 					Name: getOneSuccess.Name,
// 					Permissions: prepareFormSate
// 				},
// 				touched: {},
// 				errors: {}
// 			});

// 			// Group by Resource, Area, City etc
// 			const groupByResource = groupBy(result, a => a.Resource);

// 			// set State for Render CheckBox
// 			setCheckBoxState(groupByResource);
// 		}
// 	}, [getOneSuccess]);

// 	const handleChange = event => {
// 		event.persist();

// 		setFormState(value => ({
// 			...value,
// 			values: {
// 				...formState.values,
// 				[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
// 			},
// 			touched: {
// 				...formState.touched,
// 				[event.target.name]: true
// 			}
// 		}));
// 	};

// 	const handleSubmit = event => {
// 		event.preventDefault();

// 		const errors = validate(formState.values, schema);

// 		setFormState(frmState => ({
// 			...frmState,
// 			isValid: !errors,
// 			errors: errors || {}
// 		}));
// 		if (errors) return;
// 		if (!edit) {
// 			dispatch(actionsRoles.add(formState.values));
// 		} else {
// 			dispatch(actionsRoles.edit(formState.values));
// 		}
// 	};

// 	// eslint-disable-next-line no-shadow
// 	const handleCheckboxgroupChange = (updatedUsecaseCBState, props) => {
// 		const newArr = [];
// 		let newFormState = [];
// 		const Permissions = [...formState.values.Permissions];
// 		newFormState = Permissions;

// 		updatedUsecaseCBState.forEach(element => {
// 			const found = Permissions.find(obj => obj.idPermission === element.idPermission);

// 			if (element.checked) {
// 				if (found) {
// 					if (found.Action === 'Delete') {
// 						const removed = removeObjectFromArray(Permissions, 'idPermission', element.idPermission);
// 						newFormState = removed;
// 						newArr.push(element);
// 					}
// 				} else {
// 					const newElement = { ...element, Action: 'Add' };
// 					newArr.push(newElement);
// 				}
// 			} else if (found) {
// 				if (found.Action === 'Add') {
// 					const removed = removeObjectFromArray(Permissions, 'idPermission', element.idPermission);
// 					newFormState = removed;
// 				} else if (!found.Action) {
// 					const x = removeObjectFromArray(Permissions, 'idPermission', element.idPermission);
// 					newFormState = x;
// 					const newElement = { ...element, Action: 'Delete' };
// 					newArr.push(newElement);
// 				}
// 			}
// 		});

// 		console.log('permission', Permissions);
// 		console.log('newFormState', newFormState);
// 		console.log('newarr', newArr);

// 		const newState = [...newFormState, ...newArr];
// 		console.log('newState', newState);

// 		setFormState(frmState => ({
// 			...frmState,
// 			values: {
// 				...frmState.values,
// 				Permissions: newState
// 			}
// 		}));

// 		setCheckBoxState(value => ({
// 			...value,
// 			// eslint-disable-next-line react/prop-types
// 			[props.id]: updatedUsecaseCBState
// 		}));
// 	};

// 	const hasError = field => !!formState.errors[field];

// 	// eslint-disable-next-line consistent-return
// 	const renderHeader = () => {
// 		if (headerState) {
// 			// <Grid item container justify="flex-start">
// 			// 	<Grid item container direction="column" sm={4}>
// 			// 		<Grid item>
// 			// 			<Paper style={{ height: '5vh', background: 'green' }}>
// 			// 				Permission
// 			// 			</Paper>
// 			// 		</Grid>
// 			// 	</Grid>
// 			// 	<Grid item container direction="column" sm={1}>
// 			// 		<Grid item>
// 			// 			<Paper style={{ height: '5vh', background: 'green' }}>
// 			// 				Full Access
// 			// 			</Paper>
// 			// 		</Grid>
// 			// 	</Grid>
// 			// 	<Grid item container direction="column" sm={1}>
// 			// 		<Grid item>
// 			// 			<Paper style={{ height: '5vh', background: 'orange' }}>Add</Paper>
// 			// 		</Grid>
// 			// 	</Grid>
// 			// 	<Grid item container direction="column" sm={1}>
// 			// 		<Grid item>
// 			// 			<Paper style={{ height: '5vh', background: 'orange' }}>
// 			// 				Delete
// 			// 			</Paper>
// 			// 		</Grid>
// 			// 	</Grid>
// 			// 	<Grid item container direction="column" sm={1}>
// 			// 		<Grid item>
// 			// 			<Paper style={{ height: '5vh', background: 'orange' }}>Edit</Paper>
// 			// 		</Grid>
// 			// 	</Grid>
// 			// 	<Grid item container direction="column" sm={1}>
// 			// 		<Grid item>
// 			// 			<Paper style={{ height: '5vh', background: 'orange' }}>Read</Paper>
// 			// 		</Grid>
// 			// 	</Grid>
// 			// </Grid>;
// 			const items = [];
// 			// eslint-disable-next-line no-restricted-syntax
// 			for (const [key, value] of Object.entries(headerState)) {
// 				items.push(
// 					<Grid item container direction="column" sm={1} key={key} style={{ padding: 0 }}>
// 						<Grid item>
// 							<Paper style={{ height: '5vh', background: 'green' }}>{value.ResourceAction}</Paper>
// 						</Grid>
// 					</Grid>
// 				);
// 			}
// 			return items;
// 		}
// 	};

// 	// eslint-disable-next-line consistent-return
// 	const renderCheckboxes = () => {
// 		if (checkBoxState) {
// 			const items = [];
// 			// eslint-disable-next-line no-restricted-syntax
// 			for (const [key, value] of Object.entries(checkBoxState)) {
// 				items.push(
// 					<Grid item container spacing={1} justify="flex-start" key={key} style={{ padding: 0 }}>
// 						<CheckboxGroup
// 							key={key}
// 							id={key}
// 							checkboxes={value}
// 							onCheckboxGroupChange={handleCheckboxgroupChange}
// 						/>
// 					</Grid>
// 				);
// 			}

// 			return items;
// 		}
// 	};

// 	return (
// 		<div>
// 			<FusePageCarded
// 				header={
// 					<div className="flex flex-1 w-full items-center justify-between">
// 						<div className="flex flex-col items-start max-w-full">
// 							<FuseAnimate animation="transition.slideRightIn" delay={300}>
// 								<Typography
// 									className="normal-case flex items-center sm:mb-12"
// 									component={Link}
// 									role="button"
// 									to="/permissions"
// 									color="inherit">
// 									<Icon className="text-20">
// 										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
// 									</Icon>
// 									{/* <span className="mx-4">Item</span> */}
// 									<FuseAnimate animation="transition.expandIn" delay={300}>
// 										<Icon className="text-32">assignment_ind</Icon>
// 									</FuseAnimate>
// 									<FuseAnimate animation="transition.slideRightIn" delay={300}>
// 										<div className="flex items-center">
// 											<FuseAnimate animation="transition.slideLeftIn" delay={300}>
// 												<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
// 													{selectedData && selectedData.Name ? selectedData.Name : 'New Role'}
// 												</Typography>
// 											</FuseAnimate>
// 										</div>
// 									</FuseAnimate>
// 								</Typography>
// 							</FuseAnimate>
// 						</div>
// 						{view ? null : (
// 							<FuseAnimate animation="transition.slideRightIn" delay={300}>
// 								<Button
// 									className="whitespace-no-wrap normal-case"
// 									variant="contained"
// 									color="secondary"
// 									type="submit"
// 									// disabled={!canBeSubmitted()}
// 									onClick={handleSubmit}>
// 									Save
// 									{/* {btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />} */}
// 								</Button>
// 							</FuseAnimate>
// 						)}
// 					</div>
// 				}
// 				content={
// 					<div>
// 						{/* <FuseAnimate animation="transition.slideUpIn" delay={300}> */}
// 						<TextField
// 							autoComplete="off"
// 							className="mb-16"
// 							name="Name"
// 							label="Role"
// 							margin="dense"
// 							fullWidth
// 							inputRef={inputRef}
// 							value={formState.values.Name || ''}
// 							type="text"
// 							onChange={handleChange}
// 							error={hasError('Name')}
// 							helperText={hasError('Name') ? formState.errors.Name[0] : null}
// 							variant="outlined"
// 							required
// 							disabled={view}
// 							inputProps={{ maxLength: 40 }}
// 						/>
// 						<Grid container spacing={1} justify="flex-start">
// 							{/* <Grid item container justify="flex-start">
// 								<Grid item container direction="column" sm={4}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'green' }}>Permission</Paper>
// 									</Grid>
// 								</Grid>
// 								<Grid item container direction="column" sm={1}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'green' }}>Full Access</Paper>
// 									</Grid>
// 								</Grid>
// 								<Grid item container direction="column" sm={1}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'orange' }}>Add</Paper>
// 									</Grid>
// 								</Grid>
// 								<Grid item container direction="column" sm={1}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'orange' }}>Delete</Paper>
// 									</Grid>
// 								</Grid>
// 								<Grid item container direction="column" sm={1}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'orange' }}>Edit</Paper>
// 									</Grid>
// 								</Grid>
// 								<Grid item container direction="column" sm={1}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'orange' }}>Read</Paper>
// 									</Grid>
// 								</Grid>
// 							</Grid> */}
// 							<Grid item container justify="flex-start" style={{ padding: 0 }}>
// 								<Grid item container direction="column" sm={4} s>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'green', padding: 0 }}>
// 											Permission
// 										</Paper>
// 									</Grid>
// 								</Grid>

// 								<Grid item container direction="column" sm={1}>
// 									<Grid item>
// 										<Paper style={{ height: '5vh', background: 'orange', padding: 0 }}>
// 											Full Access
// 										</Paper>
// 									</Grid>
// 								</Grid>
// 								{renderHeader()}
// 							</Grid>
// 							{renderCheckboxes()}
// 						</Grid>

// 						{/* </FuseAnimate> */}
// 					</div>
// 				}
// 				innerScroll
// 			/>
// 		</div>
// 	);
// };

// AddPermission.propTypes = {
// 	view: PropTypes.bool,
// 	edit: PropTypes.bool,
// 	selectedData: PropTypes.instanceOf(Object)
// };

// AddPermission.defaultProps = {
// 	view: false,
// 	edit: false,
// 	selectedData: null
// };

// export default AddPermission;
