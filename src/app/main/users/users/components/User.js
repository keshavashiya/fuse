/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef, createRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import {
	Button,
	TextField,
	CircularProgress,
	Grid,
	Typography,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	OutlinedInput,
	IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green, orange } from '@material-ui/core/colors';

import { Clear as ClearIcon, Edit as EditIcon } from '@material-ui/icons';
// import LaunchIcon from '@material-ui/icons/Launch';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';

import { showMessage } from '../../../../store/fuse/messageSlice';

import saga from '../store/saga';
import { name, actions } from '../store/slice';

import sagaRole from '../../roles/store/saga';
import { name as nameRole, actions as actionsRole } from '../../roles/store/slice';

import sagaCity from '../../../masters/cities/store/saga';
import { name as nameCity, actions as actionsCity } from '../../../masters/cities/store/slice';

import sagaArea from '../../../masters/areas/store/saga';
import { name as nameArea, actions as actionsArea } from '../../../masters/areas/store/slice';

// import PreviewCarousal from '../../../../components/CustomPreview/PreviewCarousal';

import { Upload } from '../../../../components';
import { difference } from '../../../../helpers/utils';
import useThrottle from '../../../../hooks/useThrottle';

// Update session when user change his/her profile
import { updateUser } from '../../../../auth/store/userSlice';

const schema = {
	FirstName: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20,
			minimum: 1
		},
		format: {
			pattern: '[a-z A-Z]+',
			flags: 'i',
			message: 'can only contain alphabet.'
		}
	},
	LastName: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20,
			minimum: 1
		},
		format: {
			pattern: '[a-z A-Z]+',
			flags: 'i',
			message: 'can only contain alphabet.'
		}
	},
	idRole: {
		presence: { allowEmpty: false, message: 'is required' }
	},
	MobileNumber: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 12,
			minimum: 12
		},
		format: {
			pattern: '[0-9]+',
			flags: 'i',
			message: 'can only contain number.'
		}
	},
	Email: {
		presence: { allowEmpty: true, message: "doesn't look like a valid email" },
		email: true,
		length: {
			minimum: 5,
			maximum: 40,
			message: "doesn't look like a valid email"
		}
	}
};

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		margin: theme.spacing(0, 2, 2, 2)
	},
	cancelButton: {
		marginLeft: theme.spacing(2)
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute'
	},
	upload: {
		marginBottom: theme.spacing(1)
	},
	footer: {
		position: 'fixed',
		right: '0',
		bottom: '0',
		boxSizing: 'border-box',
		boxShadow: '0 -2px 4px 0 rgba(0,0,0,.05)',
		textAlign: 'center',
		transition: 'all 300ms ease',
		padding: '10px',
		zIndex: 500,
		transform: 'translateY(0)',
		backgroundColor: theme.palette.background.default
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			},
			'& $productImageRemove': {
				opacity: 0.8
			}
		}
	},
	productImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		left: 0,
		color: orange[400],
		opacity: 0
	},
	productImageRemove: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: '#fff',
		// color: orange[400],
		opacity: 0
	}
}));

const filterOptions = createFilterOptions({
	matchFrom: 'any',
	stringify: option => option.Name
});

const User = props => {
	useInjectSaga({ key: name, saga });
	useInjectSaga({ key: nameRole, saga: sagaRole });
	useInjectSaga({ key: nameCity, saga: sagaCity });
	useInjectSaga({ key: nameArea, saga: sagaArea });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer, roleReducer, cityReducer, areaReducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.user.user,
			roleReducer: reducer.role.role,
			cityReducer: reducer.city.city,
			areaReducer: reducer.area.area,
			user: reducer.auth.user
		}),
		shallowEqual
	);
	const { ParentCompany } = user.data;

	const { edit, onCloseDrawer, passProps, selectedData, width } = props;

	const inputRef = useRef(null);

	const { Loading, addSuccess, addError, editSuccess, editError, getOneSuccess } = Reducer;

	const InitialValue = {
		isValid: false,
		values: {
			Files: [],
			ParentCompany
		},
		touched: {},
		errors: {}
	};

	const InitialUserType = {
		UserType: 'Employee'
	};

	const InitialRole = {
		idRole: 0,
		Role: ''
	};

	const [formState, setFormState] = useState(InitialValue);
	const [formEditState, setFormEditState] = useState(null);
	const [btnLoder, setBtnLoader] = useState(false);
	const [userType, setUserType] = useState(InitialUserType);
	const [role, setRole] = useState(InitialRole);
	const [roleList, setRoleList] = useState(null);
	// const [filePreview, setFilePreview] = useState(false);

	const [cityLoading, setCityLoading] = useState(false);
	const [cityOpen, setCityOpen] = useState(false);
	const [cityOptions, setCityOptions] = useState([]);
	const [cityDefault, setCityDefault] = useState(null);
	const [inputCityValue, setInputCityValue] = useState('');
	const throttledInputCityValue = useThrottle(inputCityValue, 400);

	const [areaLoading, setAreaLoading] = useState(false);
	const [areaOpen, setAreaOpen] = useState(false);
	const [areaOptions, setAreaOptions] = useState([]);
	const [areaDefault, setAreaDefault] = useState(null);
	const [inputAreaValue, setInputAreaValue] = useState('');
	const throttledInputAreaValue = useThrottle(inputAreaValue, 400);

	const [DOB, setDOB] = useState(null);
	const [anniversary, setAnniversary] = useState(null);
	const [showUpload, setShowUpload] = useState(false);

	const inputLabelUserType = createRef(null);
	const inputLabelRole = createRef(null);

	const [labelWidthUserType, setLabelWidthUserType] = useState(0);
	const [labelWidthRole, setLabelWidthRole] = useState(0);

	useEffect(() => {
		setLabelWidthUserType(inputLabelUserType.current.offsetWidth);
		setLabelWidthRole(inputLabelRole.current.offsetWidth);

		if (edit) {
			dispatch(actions.getOne(selectedData));
		} else {
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					UserType: InitialUserType.UserType
				}
			}));
		}

		dispatch(actionsRole.get({ QueryParams: 'limit=50' }));

		const timer = setTimeout(() => {
			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);

		return () => {
			clearTimeout(timer);
			dispatch(actions.reset());
			dispatch(actionsRole.reset());
			dispatch(actionsCity.reset());
			dispatch(actionsArea.reset());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (roleReducer.getSuccess) {
			setRoleList(roleReducer.getSuccess);

			if (getOneSuccess && getOneSuccess.idRole) {
				setRole({
					Role: getOneSuccess.idRole
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roleReducer.getSuccess]);

	useEffect(() => {
		if (cityReducer.getSuccess) {
			setCityOptions(cityReducer.getSuccess.data);
		} else {
			setCityOptions([]);
		}
		setCityLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cityReducer.getSuccess, cityReducer.getError]);

	useEffect(() => {
		if (areaReducer.getSuccess) {
			setAreaOptions(areaReducer.getSuccess.data);
		} else {
			setAreaOptions([]);
		}

		setAreaLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [areaReducer.getSuccess, areaReducer.getError]);

	useEffect(() => {
		if (Loading) {
			setBtnLoader(true);

			setFormState(value => ({
				...value,
				isValid: false
			}));
		} else {
			setBtnLoader(false);
		}
	}, [Loading]);

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
			dispatch(
				showMessage({
					message: 'User added successfully',
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);

			passProps({ type: 'ADD', data: addSuccess });
			dispatch(actions.reset());

			setFormState(InitialValue);
			setUserType(InitialUserType);
			setRole(InitialRole);
			setCityOpen(false);
			setCityOptions([]);
			setCityDefault(null);
			setAreaOpen(false);
			setAreaOptions([]);
			setAreaDefault(null);
			setDOB(null);
			setAnniversary(null);

			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		if (editSuccess) {
			passProps({ type: 'EDIT', data: editSuccess });
			const timer = setTimeout(() => {
				clearTimeout(timer);
				onCloseDrawer();
			}, 700);

			const localUser = JSON.parse(localStorage.getItem('User'));

			if (localUser.data.email === editSuccess.Email) {
				dispatch(updateUser(editSuccess));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editSuccess]);

	useEffect(() => {
		if (getOneSuccess) {
			const { idCity, City, idArea, Area } = getOneSuccess;

			if (idCity) {
				setCityDefault({ idCity, Name: City });
				if (!idArea) {
					dispatch(actionsArea.get({ QueryParams: `idCity=${idCity}` }));
				}
			}
			if (idArea) {
				setAreaDefault({ idArea, Name: Area });
			}

			// const assignGetOneSuccess = {
			// 	...getOneSuccess,
			// 	...{
			// 		ParentCompany
			// 	}
			// };

			const assignGetOneSuccess = {
				...getOneSuccess
			};

			if (!getOneSuccess.Files) {
				assignGetOneSuccess.Files = [];
			}

			setFormEditState({
				isValid: false,
				values: getOneSuccess,
				touched: {},
				errors: {}
			});

			setFormState({
				isValid: false,
				values: assignGetOneSuccess,
				touched: {},
				errors: {}
			});

			setUserType({
				UserType: getOneSuccess.UserType
			});

			if (roleList && getOneSuccess.idRole) {
				setRole({
					Role: getOneSuccess.idRole
				});
			}

			if (getOneSuccess.DOB) {
				setDOB(getOneSuccess.DOB);
			}

			if (getOneSuccess.Anniversary) {
				setAnniversary(getOneSuccess.Anniversary);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const handleSelectChange = async event => {
		// eslint-disable-next-line no-shadow
		const { name, value } = event.target;

		if (name === 'UserType') {
			setUserType(oldUserType => ({
				...oldUserType,
				[name]: value
			}));

			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					[name]: value
				}
			}));
		}

		if (name === 'idRole') {
			setRole(oldRole => ({
				...oldRole,
				[name.substring(2)]: value
			}));

			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					[name]: value
				}
			}));
		}
	};

	/** City */

	useEffect(() => {
		setCityLoading(true);
		dispatch(actionsCity.reset());
		if (throttledInputCityValue === '') {
			dispatch(actionsCity.get({ QueryParams: `limit=10` }));
			return undefined;
		}

		dispatch(actionsCity.get({ QueryParams: `q=${throttledInputCityValue}` }));

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [throttledInputCityValue]);

	const handleCityChange = (evt, value) => {
		const idCity = value ? value.idCity : null;

		setCityDefault(value);
		dispatch(actionsCity.reset());

		setAreaDefault(null);
		setAreaOptions([]);

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				idCity,
				idArea: null
			}
		}));

		if (value) {
			dispatch(actionsArea.get({ QueryParams: `idCity=${value.idCity}` }));
		} else {
			dispatch(actionsCity.get({ QueryParams: `limit=10` }));
		}
	};

	/** Area */

	useEffect(() => {
		dispatch(actionsArea.reset());
		if (throttledInputAreaValue === '') {
			// setAreaOptions([]);
			if (formState.values.idCity) {
				setAreaLoading(true);
				dispatch(actionsArea.get({ QueryParams: `idCity=${formState.values.idCity}&limit=10` }));
			}
			return undefined;
		}

		if (formState.values.idCity) {
			setAreaLoading(true);
			dispatch(
				actionsArea.get({ QueryParams: `idCity=${formState.values.idCity}&q=${throttledInputAreaValue}` })
			);
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [throttledInputAreaValue]);

	const handleAreaChange = (evt, value) => {
		const idArea = value ? value.idArea : null;

		setAreaDefault(value);
		dispatch(actionsArea.reset());

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				idArea
			}
		}));

		if (!value) {
			if (formState.values.idCity) {
				setAreaLoading(true);
				dispatch(actionsArea.get({ QueryParams: `idCity=${formState.values.idCity}&limit=10` }));
			}
		}
	};

	// eslint-disable-next-line consistent-return
	const hanldeAcOnKeyDown = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
			return false;
		}
	};

	const handleDOBDateChange = date => {
		setDOB(date);

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				DOB: date ? date.toString() : null
			}
		}));
	};

	const handleAnniversaryDateChange = date => {
		setAnniversary(date);

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				Anniversary: date ? date.toString() : null
			}
		}));
	};

	const handleSubmit = event => {
		event.preventDefault();
		// if (formState.values.MobileNumber.length === 10) {
		// 	formState.values.MobileNumber = 91 + formState.values.MobileNumber;
		// }
		let errors;
		if (!edit) {
			errors = validate(formState.values, schema);
		}

		setFormState(frmState => ({
			...frmState,
			isValid: !errors,
			errors: errors || {}
		}));

		if (errors) return;
		if (!edit) {
			dispatch(actions.add(formState.values));
		} else {
			const diffFormState = difference(formEditState.values, formState.values);

			const assignState = {
				...diffFormState,
				...{
					ParentCompany,
					idUser: formState.values.idUser,
					Files: formState.values.Files
				}
			};

			dispatch(actions.edit(assignState));
		}
	};

	const close = () => {
		onCloseDrawer();
	};

	const previousFiles = () => {
		/* Action mark as delete for all objects except last added to array */
		const files = [...formState.values.Files];

		const result = files.map(obj => ({ ...obj, Action: 'Delete' }));

		return result;
	};

	const handleFileRemove = () => {
		const Files = previousFiles();

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				Files
			}
		}));
	};

	const fileUploaded = file => {
		if (file[0].File) {
			const { OriginalName, Size, File, MimeType, Action } = file[0];

			const Files = previousFiles();
			setShowUpload(false);

			Files.unshift({
				File,
				Size,
				OriginalName,
				MimeType,
				Action
			});

			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					Files
				}
			}));
		}
	};

	const fileUploadCancel = () => {
		setShowUpload(false);
	};

	const hasError = field => !!formState.errors[field];
	const TempAvatarPreview = data => {
		const filteredFiles = data.data.filter(
			// eslint-disable-next-line
			x => x.Action === 'Add' || x.Action === 'Edit' || x.hasOwnProperty('Action') === false
		);
		return filteredFiles.map((file, idx) => (
			<div
				role="button"
				tabIndex={0}
				className={clsx(
					classes.productImageItem,
					'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
				)}
				// eslint-disable-next-line react/no-array-index-key
				key={idx}>
				<IconButton
					style={{ backgroundColor: '#fff' }}
					className={classes.productImageRemove}
					onClick={() => handleFileRemove()}>
					<ClearIcon style={{ color: 'rgba(82, 92, 105, 0.5)', fontSize: '1rem' }} />
				</IconButton>
				<IconButton
					style={{ backgroundColor: '#fff' }}
					// className={classes.productImageRemove}
					className={classes.productImageFeaturedStar}
					onClick={() => {
						setShowUpload(true);
					}}>
					<EditIcon style={{ color: 'rgba(82, 92, 105, 0.5)', fontSize: '1rem' }} />
				</IconButton>
				<img className="max-w-none w-auto h-full" src={file.File} alt="item" />
			</div>
		));
	};
	return (
		<div className="w-full p-20">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
				<TextField
					margin="dense"
					className="mb-6"
					name="FirstName"
					label="First Name"
					inputRef={inputRef}
					value={formState.values.FirstName || ''}
					type="text"
					onChange={handleChange}
					error={hasError('FirstName')}
					helperText={hasError('FirstName') ? formState.errors.FirstName[0] : null}
					variant="outlined"
					required
					inputProps={{ maxLength: 20 }}
				/>
				<TextField
					margin="dense"
					className="mb-6"
					name="LastName"
					label="Last Name"
					value={formState.values.LastName || ''}
					type="text"
					onChange={handleChange}
					error={hasError('LastName')}
					helperText={hasError('LastName') ? formState.errors.LastName[0] : null}
					variant="outlined"
					required
					inputProps={{ maxLength: 20 }}
				/>
				<TextField
					margin="dense"
					className="mb-16"
					name="UserCode"
					label="Code"
					value={formState.values.UserCode || ''}
					type="text"
					onChange={handleChange}
					variant="outlined"
					inputProps={{ maxLength: 20 }}
				/>

				<div>
					{formState.values.Files[0] &&
						formState.values.Files[0].File &&
						formState.values.Files[0].Action !== 'Delete' && (
							<Grid container>
								<TempAvatarPreview data={formState.values.Files} />
							</Grid>
						)}
					{showUpload ? (
						<Upload
							accept={['image/*', '.jpg', '.jpeg', '.png']}
							upload={fileUploaded}
							uploadCancel={fileUploadCancel}
						/>
					) : (
						<div className={classes.upload}>
							{!formState.values.Files[0] ||
							// formState.values.Files[0].File &&
							formState.values.Files[0].Action === 'Delete' ? (
								// eslint-disable-next-line
								<div
									className="flex items-center justify-center relative w-128 h-128 rounded-8 mt-8 overflow-hidden cursor-pointer bg-gray-500 border-1"
									onClick={() => {
										setShowUpload(true);
									}}>
									<Typography variant="body1">Add Image</Typography>
								</div>
							) : null}
						</div>
					)}
				</div>
				<FormControl margin="dense" className="mb-6" variant="outlined">
					<InputLabel ref={inputLabelUserType}>User Type *</InputLabel>
					<Select
						id="UserType"
						value={userType.UserType}
						onChange={handleSelectChange}
						input={
							<OutlinedInput
								labelWidth={labelWidthUserType}
								name="UserType"
								// classes={{ input: classes.selectInput }}
							/>
						}>
						<MenuItem key={1} value="Dealer">
							Dealer
						</MenuItem>
						<MenuItem key={2} value="Aggregator">
							Aggregator
						</MenuItem>
						<MenuItem key={3} value="Employee">
							Employee
						</MenuItem>
					</Select>
				</FormControl>
				<FormControl margin="dense" className="mb-6" variant="outlined">
					<InputLabel ref={inputLabelRole}>Role *</InputLabel>
					<Select
						id="idRole"
						value={role.Role}
						onChange={handleSelectChange}
						error={hasError('idRole')}
						input={
							<OutlinedInput
								labelWidth={labelWidthRole}
								name="idRole"
								// classes={{ input: classes.selectInput }}
							/>
						}>
						{roleList
							? roleList.data.map(p => (
									<MenuItem key={p.idRole} value={p.idRole}>
										{p.Name}
									</MenuItem>
							  ))
							: ''}
					</Select>
				</FormControl>

				<Autocomplete
					className="mb-6"
					open={cityOpen}
					onOpen={() => {
						setCityOpen(true);
					}}
					onClose={() => {
						setCityOpen(false);
					}}
					getOptionSelected={(option, value) => option.Name === value.Name}
					getOptionLabel={option => option.Name}
					options={cityOptions}
					onChange={(event, newValue) => {
						handleCityChange(event, newValue);
					}}
					value={cityDefault || null}
					loading={cityLoading}
					filterOptions={filterOptions}
					autoHighlight
					openOnFocus
					renderInput={params => (
						<TextField
							margin="dense"
							{...params}
							label="City"
							variant="outlined"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => setInputCityValue(e.target.value)}
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
						/>
					)}
				/>

				<Autocomplete
					className="mb-6"
					open={areaOpen}
					onOpen={() => {
						setAreaOpen(true);
					}}
					onClose={() => {
						setAreaOpen(false);
					}}
					getOptionSelected={(option, value) => option.Name === value.Name}
					getOptionLabel={option => option.Name}
					options={areaOptions}
					onChange={(event, newValue) => {
						handleAreaChange(event, newValue);
					}}
					value={areaDefault || null}
					loading={areaLoading}
					filterOptions={filterOptions}
					autoHighlight
					openOnFocus
					renderInput={params => (
						<TextField
							margin="dense"
							{...params}
							label="Area"
							variant="outlined"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => setInputAreaValue(e.target.value)}
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{areaLoading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
						/>
					)}
				/>

				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<KeyboardDatePicker
						margin="dense"
						className="mb-6"
						autoOk
						disableToolbar
						helperText=""
						error={false}
						variant="inline"
						inputVariant="outlined"
						format="dd/MM/yyyy"
						id="DOB"
						label="DOB"
						value={DOB}
						onChange={handleDOBDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change date'
						}}
					/>
				</MuiPickersUtilsProvider>

				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<KeyboardDatePicker
						margin="dense"
						className="mb-6"
						autoOk
						disableToolbar
						helperText=""
						error={false}
						variant="inline"
						inputVariant="outlined"
						format="dd/MM/yyyy"
						id="Anniversary"
						label="Anniversary"
						value={anniversary}
						onChange={handleAnniversaryDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change date'
						}}
					/>
				</MuiPickersUtilsProvider>

				<TextField
					margin="dense"
					className="mb-6"
					name="MobileNumber"
					label="Mobile Number"
					value={formState.values.MobileNumber || ''}
					type="text"
					onChange={handleChange}
					error={hasError('MobileNumber')}
					helperText={hasError('MobileNumber') ? formState.errors.MobileNumber[0] : null}
					variant="outlined"
					required
					inputProps={{ maxLength: 12 }}
				/>

				<TextField
					margin="dense"
					className="mb-52"
					name="Email"
					label="Email"
					value={formState.values.Email || ''}
					type="text"
					onChange={handleChange}
					error={formState.values.Email ? hasError('Email') : null}
					// eslint-disable-next-line
					helperText={formState.values.Email ? (hasError('Email') ? formState.errors.Email[0] : null) : null}
					variant="outlined"
					inputProps={{ maxLength: 40 }}
				/>

				<div style={{ width: `${width}%` }} className={classes.footer}>
					<Button disabled={!!btnLoder} color="primary" size="medium" type="submit" variant="contained">
						Save
						{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
					</Button>
					<Button color="primary" size="small" onClick={close} className={classes.cancelButton}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
};

User.propTypes = {
	edit: PropTypes.bool,
	onCloseDrawer: PropTypes.func,
	passProps: PropTypes.func,
	selectedData: PropTypes.instanceOf(Object),
	width: PropTypes.number
};

User.defaultProps = {
	edit: false,
	onCloseDrawer: null,
	passProps: null,
	selectedData: null,
	width: 30
};

export default User;

// /* eslint-disable react/jsx-props-no-spreading */
// import React, { useState, useEffect, useRef, createRef } from 'react';
// import PropTypes from 'prop-types';
// import { useSelector, useDispatch, shallowEqual } from 'react-redux';

// import {
// 	Button,
// 	TextField,
// 	CircularProgress,
// 	Grid,
// 	Avatar,
// 	FormControl,
// 	InputLabel,
// 	MenuItem,
// 	Select,
// 	OutlinedInput,
// 	IconButton
// } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import { green } from '@material-ui/core/colors';
// import { Clear as ClearIcon } from '@material-ui/icons';
// import DateFnsUtils from '@date-io/date-fns';
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

// import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
// import validate from 'validate.js';

// import { showMessage } from '../../../../store/fuse/messageSlice';

// import saga from '../store/saga';
// import { name, actions } from '../store/slice';

// import sagaRole from '../../roles/store/saga';
// import { name as nameRole, actions as actionsRole } from '../../roles/store/slice';

// import sagaCity from '../../../masters/cities/store/saga';
// import { name as nameCity, actions as actionsCity } from '../../../masters/cities/store/slice';

// import sagaArea from '../../../masters/areas/store/saga';
// import { name as nameArea, actions as actionsArea } from '../../../masters/areas/store/slice';

// import { Upload } from '../../../../components';
// import { formatBytes } from '../../../../helpers/utils';
// import useThrottle from '../../../../hooks/useThrottle';

// const schema = {
// 	FirstName: {
// 		presence: { allowEmpty: false, message: 'is required' },
// 		length: {
// 			maximum: 20,
// 			minimum: 1
// 		},
// 		format: {
// 			pattern: '[a-z A-Z]+',
// 			flags: 'i',
// 			message: 'can only contain alphabet.'
// 		}
// 	},
// 	LastName: {
// 		presence: { allowEmpty: false, message: 'is required' },
// 		length: {
// 			maximum: 20,
// 			minimum: 1
// 		},
// 		format: {
// 			pattern: '[a-z A-Z]+',
// 			flags: 'i',
// 			message: 'can only contain alphabet.'
// 		}
// 	},
// 	idRole: {
// 		presence: { allowEmpty: false, message: 'is required' }
// 	},
// 	MobileNumber: {
// 		presence: { allowEmpty: false, message: 'is required' },
// 		length: {
// 			maximum: 12,
// 			minimum: 12
// 		},
// 		format: {
// 			pattern: '[0-9]+',
// 			flags: 'i',
// 			message: 'can only contain number.'
// 		}
// 	},
// 	Email: {
// 		presence: { allowEmpty: true, message: "doesn't look like a valid email" },
// 		email: true,
// 		length: {
// 			minimum: 5,
// 			maximum: 40,
// 			message: "doesn't look like a valid email"
// 		}
// 	}
// };

// const useStyles = makeStyles(theme => ({
// 	root: {
// 		flexGrow: 1,
// 		margin: theme.spacing(0, 2, 2, 2)
// 	},
// 	cancelButton: {
// 		marginLeft: theme.spacing(2)
// 	},
// 	buttonProgress: {
// 		color: green[500],
// 		position: 'absolute'
// 	},
// 	upload: {
// 		marginBottom: theme.spacing(2)
// 	},
// 	footer: {
// 		position: 'fixed',
// 		right: '0',
// 		bottom: '0',
// 		boxSizing: 'border-box',
// 		boxShadow: '0 -2px 4px 0 rgba(0,0,0,.05)',
// 		textAlign: 'center',
// 		transition: 'all 300ms ease',
// 		padding: '10px',
// 		zIndex: 500,
// 		transform: 'translateY(0)',
// 		backgroundColor: theme.palette.background.default
// 	}
// }));

// const filterOptions = createFilterOptions({
// 	matchFrom: 'any',
// 	stringify: option => option.Name
// });

// const User = props => {
// 	useInjectSaga({ key: name, saga });
// 	useInjectSaga({ key: nameRole, saga: sagaRole });
// 	useInjectSaga({ key: nameCity, saga: sagaCity });
// 	useInjectSaga({ key: nameArea, saga: sagaArea });

// 	const classes = useStyles();
// 	const dispatch = useDispatch();
// 	const { Reducer, roleReducer, cityReducer, areaReducer, user } = useSelector(
// 		reducer => ({
// 			Reducer: reducer.user.user,
// 			roleReducer: reducer.role.role,
// 			cityReducer: reducer.city.city,
// 			areaReducer: reducer.area.area,
// 			user: reducer.auth.user
// 		}),
// 		shallowEqual
// 	);
// 	const { ParentCompany } = user.data;

// 	const { edit, onCloseDrawer, passProps, selectedData, width } = props;

// 	const inputRef = useRef(null);

// 	const { Loading, addSuccess, addError, editSuccess, editError, getOneSuccess } = Reducer;

// 	const InitialValue = {
// 		isValid: false,
// 		values: {
// 			Files: [],
// 			ParentCompany
// 		},
// 		touched: {},
// 		errors: {}
// 	};

// 	const InitialUserType = {
// 		UserType: 'Customer'
// 	};

// 	const InitialRole = {
// 		idRole: 0,
// 		Role: ''
// 	};

// 	const [formState, setFormState] = useState(InitialValue);
// 	const [btnLoder, setBtnLoader] = useState(false);
// 	const [userType, setUserType] = useState(InitialUserType);
// 	const [role, setRole] = useState(InitialRole);
// 	const [roleList, setRoleList] = useState(null);

// 	const [cityLoading, setCityLoading] = useState(false);
// 	const [cityOpen, setCityOpen] = useState(false);
// 	const [cityOptions, setCityOptions] = useState([]);
// 	const [cityDefault, setCityDefault] = useState(null);
// 	const [inputCityValue, setInputCityValue] = useState('');
// 	const throttledInputCityValue = useThrottle(inputCityValue, 400);

// 	const [areaLoading, setAreaLoading] = useState(false);
// 	const [areaOpen, setAreaOpen] = useState(false);
// 	const [areaOptions, setAreaOptions] = useState([]);
// 	const [areaDefault, setAreaDefault] = useState(null);
// 	const [inputAreaValue, setInputAreaValue] = useState('');
// 	const throttledInputAreaValue = useThrottle(inputAreaValue, 400);

// 	const [DOB, setDOB] = useState(null);
// 	const [anniversary, setAnniversary] = useState(null);
// 	const [showUpload, setShowUpload] = useState(false);

// 	const inputLabelUserType = createRef(null);
// 	const inputLabelRole = createRef(null);

// 	const [labelWidthUserType, setLabelWidthUserType] = useState(0);
// 	const [labelWidthRole, setLabelWidthRole] = useState(0);

// 	useEffect(() => {
// 		setLabelWidthUserType(inputLabelUserType.current.offsetWidth);
// 		setLabelWidthRole(inputLabelRole.current.offsetWidth);

// 		if (edit) {
// 			dispatch(actions.getOne(selectedData));
// 		} else {
// 			setFormState(frmState => ({
// 				...frmState,
// 				values: {
// 					...frmState.values,
// 					UserType: InitialUserType.UserType
// 				}
// 			}));
// 		}

// 		dispatch(actionsRole.get({ QueryParams: 'limit=50' }));
// 		// dispatch(actionsCity.get({ QueryParams: 'limit=50' }));
// 		// dispatch(actionsArea.get({ QueryParams: 'limit=50' }));

// 		const timer = setTimeout(() => {
// 			if (inputRef && inputRef.current) {
// 				inputRef.current.focus();
// 			}
// 		}, 500);

// 		return () => {
// 			clearTimeout(timer);
// 			dispatch(actions.reset());
// 			dispatch(actionsRole.reset());
// 			dispatch(actionsCity.reset());
// 			dispatch(actionsArea.reset());
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);

// 	useEffect(() => {
// 		if (roleReducer.getSuccess) {
// 			setRoleList(roleReducer.getSuccess);

// 			if (getOneSuccess && getOneSuccess.idRole) {
// 				setRole({
// 					Role: getOneSuccess.idRole
// 				});
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [roleReducer.getSuccess]);

// 	useEffect(() => {
// 		console.log('DOST I AM CITY EROROROROROROR FROM COMBNNEEEE');
// 		console.log(cityReducer.getSuccess);
// 		console.log(cityReducer.getError);
// 		if (cityReducer.getSuccess) {
// 			setCityOptions(cityReducer.getSuccess.data);
// 		} else {
// 			setCityOptions([]);
// 		}
// 		setCityLoading(false);

// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [cityReducer.getSuccess, cityReducer.getError]);

// 	// useEffect(() => {
// 	// 	console.log('DOST I AM CITY EROROROROROROR');
// 	// 	setCityOptions([]);
// 	// 	setCityLoading(false);

// 	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	// }, [cityReducer.getError]);

// 	useEffect(() => {
// 		if (areaReducer.getSuccess) {
// 			setAreaOptions(areaReducer.getSuccess.data);
// 		} else {
// 			setAreaOptions([]);
// 		}

// 		setAreaLoading(false);

// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [areaReducer.getSuccess]);

// 	useEffect(() => {
// 		setAreaOptions([]);
// 		setAreaLoading(false);

// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [areaReducer.getError]);

// 	useEffect(() => {
// 		if (Loading) {
// 			setBtnLoader(true);

// 			setFormState(value => ({
// 				...value,
// 				isValid: false
// 			}));
// 		} else {
// 			setBtnLoader(false);
// 		}
// 	}, [Loading]);

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
// 					message: 'User added successfully',
// 					autoHideDuration: 5000,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					},
// 					variant: 'success'
// 				})
// 			);

// 			passProps({ type: 'ADD', data: addSuccess });
// 			dispatch(actions.reset());

// 			setFormState(InitialValue);
// 			setUserType(InitialUserType);
// 			setRole(InitialRole);
// 			setCityOpen(false);
// 			setCityOptions([]);
// 			setAreaOpen(false);
// 			setAreaOptions([]);
// 			setDOB(null);
// 			setAnniversary(null);

// 			if (inputRef && inputRef.current) {
// 				inputRef.current.focus();
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
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
// 			passProps({ type: 'EDIT', data: editSuccess });
// 			const timer = setTimeout(() => {
// 				clearTimeout(timer);
// 				onCloseDrawer();
// 			}, 700);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [editSuccess]);

// 	useEffect(() => {
// 		if (getOneSuccess) {
// 			const { idCity, City, idArea, Area } = getOneSuccess;

// 			if (idCity) {
// 				setCityDefault({ idCity, Name: City });
// 				if (!idArea) {
// 					dispatch(actionsArea.get({ QueryParams: `idCity=${idCity}` }));
// 				}
// 			}
// 			if (idArea) {
// 				setAreaDefault({ idArea, Name: Area });
// 			}

// 			const assignGetOneSuccess = {
// 				...getOneSuccess,
// 				...{
// 					ParentCompany
// 				}
// 			};

// 			if (!getOneSuccess.Files) {
// 				assignGetOneSuccess.Files = [];
// 			}

// 			setFormState({
// 				isValid: false,
// 				values: assignGetOneSuccess,
// 				touched: {},
// 				errors: {}
// 			});

// 			setUserType({
// 				UserType: getOneSuccess.UserType
// 			});

// 			if (roleList && getOneSuccess.idRole) {
// 				setRole({
// 					Role: getOneSuccess.idRole
// 				});
// 			}

// 			if (getOneSuccess.DOB) {
// 				setDOB(getOneSuccess.DOB);
// 			}

// 			if (getOneSuccess.Anniversary) {
// 				setAnniversary(getOneSuccess.Anniversary);
// 			}
// 		}

// 		// eslint-disable-next-line react-hooks/exhaustive-deps
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

// 	const handleSelectChange = async event => {
// 		// eslint-disable-next-line no-shadow
// 		const { name, value } = event.target;

// 		if (name === 'UserType') {
// 			setUserType(oldUserType => ({
// 				...oldUserType,
// 				[name]: value
// 			}));

// 			setFormState(frmState => ({
// 				...frmState,
// 				values: {
// 					...frmState.values,
// 					[name]: value
// 				}
// 			}));
// 		}

// 		if (name === 'idRole') {
// 			setRole(oldRole => ({
// 				...oldRole,
// 				[name.substring(2)]: value
// 			}));

// 			setFormState(frmState => ({
// 				...frmState,
// 				values: {
// 					...frmState.values,
// 					[name]: value
// 				}
// 			}));
// 		}
// 	};

// 	/** City */
// 	// const handleSearchCityChange = event => {
// 	// 	setInputCityValue(event.target.value);
// 	// };

// 	useEffect(() => {
// 		setCityLoading(true);
// 		dispatch(actionsCity.reset());
// 		if (throttledInputCityValue === '') {
// 			// setCityOptions([]);
// 			// setCityLoading(true);
// 			dispatch(actionsCity.get({ QueryParams: `limit=10` }));

// 			return undefined;
// 		}

// 		// setCityLoading(true);
// 		dispatch(actionsCity.get({ QueryParams: `q=${throttledInputCityValue}&limit=100` }));

// 		return () => {};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [throttledInputCityValue]);

// 	const handleCityChange = (evt, value) => {
// 		const idCity = value ? value.idCity : null;

// 		setCityDefault(value);
// 		// dispatch(actionsCity.reset());

// 		setAreaDefault(null);
// 		setAreaOptions([]);

// 		setFormState(frmState => ({
// 			...frmState,
// 			values: {
// 				...frmState.values,
// 				idCity,
// 				idArea: null
// 			}
// 		}));

// 		if (value) {
// 			dispatch(actionsArea.get({ QueryParams: `idCity=${value.idCity}` }));
// 		}
// 	};

// 	/** Area */
// 	const handleSearchAreaChange = event => {
// 		setInputAreaValue(event.target.value);
// 	};

// 	useEffect(() => {
// 		if (throttledInputAreaValue === '') {
// 			setAreaOptions([]);

// 			console.log('BHAI AREA KHALI BOL RAHA HUUUUUUUUUUUUUUUUUUUUUUUUUUU');
// 			// dispatch(actionsCity.get({ QueryParams: `limit=10` }));

// 			return undefined;
// 		}

// 		setAreaLoading(true);

// 		console.log('DAHEMMSMMSMSMSMSMS PAATATATTATATTATAT');
// 		console.log(formState.values.idCity);
// 		if (formState.values.idCity) {
// 			dispatch(
// 				actionsArea.get({ QueryParams: `idCity=${formState.values.idCity}&q=${throttledInputAreaValue}` })
// 			);
// 		}

// 		return () => {};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [throttledInputAreaValue]);

// 	const handleAreaChange = (evt, value) => {
// 		const idArea = value ? value.idArea : null;

// 		setAreaDefault(value);
// 		dispatch(actionsArea.reset());

// 		setFormState(frmState => ({
// 			...frmState,
// 			values: {
// 				...frmState.values,
// 				idArea
// 			}
// 		}));

// 		// dispatch(actionsArea.reset());
// 	};

// 	// eslint-disable-next-line consistent-return
// 	const hanldeAcOnKeyDown = (event, acname) => {
// 		console.log('KEY DOWN ME AAAYAYAYYAYAYAY');
// 		if (event.keyCode === 13) {
// 			event.preventDefault();
// 			return false;
// 		}
// 		console.log(event);
// 		console.log(acname);
// 	};

// 	const handleDOBDateChange = date => {
// 		setDOB(date);

// 		setFormState(frmState => ({
// 			...frmState,
// 			values: {
// 				...frmState.values,
// 				DOB: date ? date.toString() : null
// 			}
// 		}));
// 	};

// 	const handleAnniversaryDateChange = date => {
// 		setAnniversary(date);

// 		setFormState(frmState => ({
// 			...frmState,
// 			values: {
// 				...frmState.values,
// 				Anniversary: date ? date.toString() : null
// 			}
// 		}));
// 	};

// 	const handleSubmit = event => {
// 		event.preventDefault();

// 		console.log('FORM STATE');
// 		console.log(formState.values);
// 		console.log('hi');

// 		let errors;
// 		if (!edit) {
// 			errors = validate(formState.values, schema);
// 		}

// 		setFormState(frmState => ({
// 			...frmState,
// 			isValid: !errors,
// 			errors: errors || {}
// 		}));

// 		if (errors) return;

// 		if (!edit) {
// 			dispatch(actions.add(formState.values));
// 		} else {
// 			dispatch(actions.edit(formState.values));
// 		}
// 	};

// 	const close = () => {
// 		onCloseDrawer();
// 	};

// 	const previousFiles = () => {
// 		/* Action mark as delete for all objects except last added to array */
// 		const files = [...formState.values.Files];

// 		const result = files.map(obj => ({ ...obj, Action: 'Delete' }));

// 		return result;
// 	};

// 	const handleFileRemove = () => {
// 		const Files = previousFiles();

// 		setFormState(frmState => ({
// 			...frmState,
// 			values: {
// 				...frmState.values,
// 				Files
// 			}
// 		}));
// 	};

// 	const fileUploaded = file => {
// 		if (file[0].File) {
// 			const { OriginalName, Size, File, MimeType, Action } = file[0];

// 			const Files = previousFiles();
// 			setShowUpload(false);

// 			Files.unshift({
// 				File,
// 				Size,
// 				OriginalName,
// 				MimeType,
// 				Action
// 			});

// 			setFormState(frmState => ({
// 				...frmState,
// 				values: {
// 					...frmState.values,
// 					Files
// 				}
// 			}));
// 		}
// 	};

// 	const fileUploadCancel = () => {
// 		setShowUpload(false);
// 	};

// 	const hasError = field => !!formState.errors[field];

// 	return (
// 		<div className="w-full p-20">
// 			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
// 				<TextField
// 					className="mb-16"
// 					name="FirstName"
// 					label="First Name"
// 					inputRef={inputRef}
// 					value={formState.values.FirstName || ''}
// 					type="text"
// 					onChange={handleChange}
// 					error={hasError('FirstName')}
// 					helperText={hasError('FirstName') ? formState.errors.FirstName[0] : null}
// 					variant="outlined"
// 					required
// 					inputProps={{ maxLength: 20 }}
// 				/>
// 				<TextField
// 					className="mb-16"
// 					name="LastName"
// 					label="Last Name"
// 					value={formState.values.LastName || ''}
// 					type="text"
// 					onChange={handleChange}
// 					error={hasError('LastName')}
// 					helperText={hasError('LastName') ? formState.errors.LastName[0] : null}
// 					variant="outlined"
// 					required
// 					inputProps={{ maxLength: 20 }}
// 				/>
// 				<TextField
// 					className="mb-16"
// 					name="UserCode"
// 					label="Code"
// 					value={formState.values.UserCode || ''}
// 					type="text"
// 					onChange={handleChange}
// 					variant="outlined"
// 					inputProps={{ maxLength: 20 }}
// 				/>

// 				<div className={classes.upload}>
// 					{formState.values.Files[0] &&
// 						formState.values.Files[0].File &&
// 						formState.values.Files[0].Action !== 'Delete' && (
// 							<Grid container style={{ marginBottom: '10px', paddingLeft: '5px' }}>
// 								<Grid item>
// 									<Avatar alt={formState.values.Files[0].File} src={formState.values.Files[0].File} />
// 								</Grid>
// 								<Grid item xs style={{ paddingLeft: '5px' }}>
// 									<span style={{ fontWeight: 400, paddingTop: '10px' }}>
// 										{formState.values.Files[0].OriginalName}{' '}
// 										{formatBytes(formState.values.Files[0].Size)}
// 									</span>
// 									<IconButton aria-label="delete" onClick={() => handleFileRemove()}>
// 										<ClearIcon />
// 									</IconButton>
// 								</Grid>
// 							</Grid>
// 						)}
// 					{showUpload ? (
// 						<Upload
// 							accept={['image/*', '.jpg', '.jpeg', '.png']}
// 							upload={fileUploaded}
// 							uploadCancel={fileUploadCancel}
// 						/>
// 					) : (
// 						<Button
// 							variant="outlined"
// 							onClick={() => {
// 								setShowUpload(true);
// 							}}
// 							className={classes.button}>
// 							{!formState.values.Files[0] ||
// 							(formState.values.Files[0] && formState.values.Files[0].Action === 'Delete')
// 								? 'Add Image'
// 								: 'Replace Image'}
// 						</Button>
// 					)}
// 				</div>
// 				<FormControl className="mb-16" variant="outlined">
// 					<InputLabel ref={inputLabelUserType}>User Type *</InputLabel>
// 					<Select
// 						id="UserType"
// 						value={userType.UserType}
// 						onChange={handleSelectChange}
// 						input={
// 							<OutlinedInput
// 								labelWidth={labelWidthUserType}
// 								name="UserType"
// 								// classes={{ input: classes.selectInput }}
// 							/>
// 						}>
// 						<MenuItem key={1} value="Customer">
// 							Customer
// 						</MenuItem>
// 						<MenuItem key={2} value="Aggregator">
// 							Aggregator
// 						</MenuItem>
// 						<MenuItem key={3} value="Distributor">
// 							Distributor
// 						</MenuItem>
// 						<MenuItem key={4} value="Dealer">
// 							Dealer
// 						</MenuItem>
// 					</Select>
// 				</FormControl>
// 				<FormControl className="mb-16" variant="outlined">
// 					<InputLabel ref={inputLabelRole}>Role *</InputLabel>
// 					<Select
// 						id="idRole"
// 						value={role.Role}
// 						onChange={handleSelectChange}
// 						error={hasError('idRole')}
// 						input={
// 							<OutlinedInput
// 								labelWidth={labelWidthRole}
// 								name="idRole"
// 								// classes={{ input: classes.selectInput }}
// 							/>
// 						}>
// 						{roleList
// 							? roleList.data.map(p => (
// 									<MenuItem key={p.idRole} value={p.idRole}>
// 										{p.Name}
// 									</MenuItem>
// 							  ))
// 							: ''}
// 					</Select>
// 				</FormControl>

// 				<Autocomplete
// 					className="mb-16"
// 					open={cityOpen}
// 					onOpen={() => {
// 						setCityOpen(true);
// 					}}
// 					onClose={() => {
// 						setCityOpen(false);
// 					}}
// 					getOptionSelected={(option, value) => option.Name === value.Name}
// 					getOptionLabel={option => option.Name}
// 					options={cityOptions}
// 					onChange={(event, newValue) => {
// 						handleCityChange(event, newValue);
// 					}}
// 					// getOptionLabel={option => option.Name}
// 					// options={cityOptions}
// 					// defaultValue={{ Name: 'Vadodara', idCity: 12 }}
// 					// defaultValue={cityDefault}
// 					value={cityDefault || null}
// 					loading={cityLoading}
// 					// filterOptions={x => x}
// 					filterOptions={filterOptions}
// 					autoHighlight
// 					openOnFocus
// 					//	selectOnFocus={false}
// 					renderInput={params => (
// 						<TextField
// 							{...params}
// 							label="City"
// 							variant="outlined"
// 							onKeyDown={e => hanldeAcOnKeyDown(e, 'city')}
// 							// onChange={e => handleSearchCityChange(e)}
// 							onChange={e => setInputCityValue(e.target.value)}
// 							InputProps={{
// 								...params.InputProps,
// 								endAdornment: (
// 									<>
// 										{cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
// 										{params.InputProps.endAdornment}
// 									</>
// 								)
// 								// startAdornment: (
// 								// 	<InputAdornment position="start">
// 								// 		<AccountCircle />
// 								// 	</InputAdornment>
// 								// )
// 							}}
// 						/>
// 					)}
// 					// renderOption={option => {
// 					// 	return (
// 					// 		<Grid container alignItems="center">
// 					// 			<Grid item xs>
// 					// 				<span>{option.Name}</span>
// 					// 			</Grid>
// 					// 		</Grid>
// 					// 	);
// 					// }}
// 				/>

// 				<Autocomplete
// 					className="mb-16"
// 					open={areaOpen}
// 					onOpen={() => {
// 						setAreaOpen(true);
// 					}}
// 					onClose={() => {
// 						setAreaOpen(false);
// 					}}
// 					getOptionSelected={(option, value) => option.Name === value.Name}
// 					getOptionLabel={option => option.Name}
// 					options={areaOptions}
// 					onChange={(event, newValue) => {
// 						handleAreaChange(event, newValue);
// 					}}
// 					value={areaDefault || null}
// 					loading={areaLoading}
// 					filterOptions={filterOptions}
// 					autoHighlight
// 					openOnFocus
// 					renderInput={params => (
// 						<TextField
// 							{...params}
// 							label="Area"
// 							variant="outlined"
// 							onKeyDown={e => hanldeAcOnKeyDown(e, 'area')}
// 							onChange={e => handleSearchAreaChange(e)}
// 							InputProps={{
// 								...params.InputProps,
// 								endAdornment: (
// 									<>
// 										{areaLoading ? <CircularProgress color="inherit" size={20} /> : null}
// 										{params.InputProps.endAdornment}
// 									</>
// 								)
// 							}}
// 						/>
// 					)}
// 				/>

// 				<MuiPickersUtilsProvider utils={DateFnsUtils}>
// 					<KeyboardDatePicker
// 						className="mb-16"
// 						autoOk
// 						disableToolbar
// 						helperText=""
// 						error={false}
// 						variant="inline"
// 						inputVariant="outlined"
// 						format="dd/MM/yyyy"
// 						id="DOB"
// 						label="DOB"
// 						value={DOB}
// 						onChange={handleDOBDateChange}
// 						KeyboardButtonProps={{
// 							'aria-label': 'change date'
// 						}}
// 					/>
// 				</MuiPickersUtilsProvider>

// 				<MuiPickersUtilsProvider utils={DateFnsUtils}>
// 					<KeyboardDatePicker
// 						className="mb-16"
// 						autoOk
// 						disableToolbar
// 						helperText=""
// 						error={false}
// 						variant="inline"
// 						inputVariant="outlined"
// 						format="dd/MM/yyyy"
// 						id="Anniversary"
// 						label="Anniversary"
// 						value={anniversary}
// 						onChange={handleAnniversaryDateChange}
// 						KeyboardButtonProps={{
// 							'aria-label': 'change date'
// 						}}
// 					/>
// 				</MuiPickersUtilsProvider>

// 				<TextField
// 					className="mb-16"
// 					name="MobileNumber"
// 					label="Mobile Number"
// 					value={formState.values.MobileNumber || ''}
// 					type="text"
// 					onChange={handleChange}
// 					error={hasError('MobileNumber')}
// 					helperText={hasError('MobileNumber') ? formState.errors.MobileNumber[0] : null}
// 					variant="outlined"
// 					required
// 					inputProps={{ maxLength: 12 }}
// 				/>

// 				<TextField
// 					className="mb-52"
// 					name="Email"
// 					label="Email"
// 					value={formState.values.Email || ''}
// 					type="text"
// 					onChange={handleChange}
// 					error={formState.values.Email ? hasError('Email') : null}
// 					// eslint-disable-next-line
// 					helperText={formState.values.Email ? (hasError('Email') ? formState.errors.Email[0] : null) : null}
// 					variant="outlined"
// 					inputProps={{ maxLength: 40 }}
// 				/>

// 				<div style={{ width: `${width}%` }} className={classes.footer}>
// 					<Button disabled={!!btnLoder} color="primary" size="medium" type="submit" variant="contained">
// 						Save
// 						{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
// 					</Button>
// 					<Button color="primary" size="small" onClick={close} className={classes.cancelButton}>
// 						Cancel
// 					</Button>
// 				</div>
// 			</form>
// 		</div>
// 	);
// };

// User.propTypes = {
// 	edit: PropTypes.bool,
// 	onCloseDrawer: PropTypes.func,
// 	passProps: PropTypes.func,
// 	selectedData: PropTypes.instanceOf(Object),
// 	width: PropTypes.number
// };

// User.defaultProps = {
// 	edit: false,
// 	onCloseDrawer: null,
// 	passProps: null,
// 	selectedData: null,
// 	width: 30
// };

// export default User;
