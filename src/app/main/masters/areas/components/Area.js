import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import {
	Button,
	TextField,
	CircularProgress
	// FormControl,
	// InputLabel,
	// MenuItem,
	// Select,
	// OutlinedInput
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';
import useThrottle from '../../../../hooks/useThrottle';

import { showMessage } from '../../../../store/fuse/messageSlice';

import saga from '../store/saga';
import sagaCity from '../../cities/store/saga';
import { name, actions } from '../store/slice';
import { name as nameCity, actions as actionsCity } from '../../cities/store/slice';

// Runtime city add
import { CustomDrawer } from '../../../../components';
import City from '../../cities/components/City';

const schema = {
	Name: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 40
		}
		/* format: {
			pattern: '[a-z A-Z]+',
			flags: 'i',
			message: 'can only contain alphabet.'
		} */
	},
	idCity: {
		presence: {
			allowEmpty: false,
			message() {
				return validate.format('^%{label} is required', {
					label: 'City'
				});
			}
		}
	}
};
// const filterOptions = createFilterOptions({
// 	matchFrom: 'any',
// 	stringify: option => option.Name
// });
const filter = createFilterOptions();

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
	}
}));

const Area = props => {
	useInjectSaga({ key: name, saga });
	useInjectSaga({ key: nameCity, saga: sagaCity });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer, cityReducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.area.area,
			cityReducer: reducer.city.city,
			user: reducer.auth.user
		}),
		shallowEqual
	);
	const { ParentCompany } = user.data;

	const { edit, onCloseDrawer, passProps, selectedData, width } = props;

	const inputRef = useRef(null);

	const { Loading, addSuccess, addError, editSuccess, editError, getOneSuccess } = Reducer;

	const InitialArea = {
		isValid: false,
		values: {
			ParentCompany
		},
		touched: {},
		errors: {}
	};

	// const InitialCity = {
	// 	idCity: 0,
	// 	City: ''
	// };

	const [formState, setFormState] = useState(InitialArea);
	const [btnLoder, setBtnLoader] = useState(false);

	// Runtime city add
	const [onlineAdd, setOnlineAdd] = useState(false);

	const [cityDisable, setCityDisable] = useState(false);

	// const [city, setCity] = useState(InitialCity);
	// const [cityList, setCityList] = useState(null);

	// const inputLabelCity = createRef(null);

	// const [labelWidthCity, setLabelWidthCity] = useState(0);
	const [cityLoading, setCityLoading] = useState(false);
	// const [cityOpen, setCityOpen] = useState(false);
	const [cityOptions, setCityOptions] = useState([]);
	const [cityDefault, setCityDefault] = useState(null);
	const [inputCityValue, setInputCityValue] = useState('');
	const throttledInputCityValue = useThrottle(inputCityValue, 400);
	// Runtime city add
	const [openCityDrawer, setOpenCityDrawer] = useState(false);
	const [cityData, setCityData] = useState('');

	useEffect(() => {
		// setLabelWidthCity(inputLabelCity.current.offsetWidth);

		if (edit) {
			dispatch(actions.getOne(selectedData));
		} else if (!edit && selectedData && selectedData.idArea === -1) {
			setOnlineAdd(true);
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					Name: selectedData.Name
				}
			}));
			if (selectedData.idCity) {
				dispatch(actionsCity.getOne(selectedData));
			}
		}

		// dispatch(actionsCity.get({ QueryParams: 'limit=50' }));

		const timer = setTimeout(() => {
			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);

		return () => {
			clearTimeout(timer);
			dispatch(actions.reset());
			dispatch(actionsCity.reset());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	if (cityReducer.getSuccess) {
	// 		setCityList(cityReducer.getSuccess);

	// 		if (getOneSuccess && getOneSuccess.idCity) {
	// 			setCity({
	// 				City: getOneSuccess.idCity
	// 			});
	// 		}
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [cityReducer.getSuccess]);

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
		if (cityReducer.getOneSuccess && onlineAdd) {
			const { idCity, Name } = cityReducer.getOneSuccess;
			setCityDefault({ idCity, Name });
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					idCity
				}
			}));
			setCityDisable(true);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cityReducer.getOneSuccess, cityReducer.getOneError]);

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

	// useEffect(() => {
	// 	setCityLoading(true);
	// 	dispatch(actionsCity.reset());
	// 	if (throttledInputCityValue === '') {
	// 		dispatch(actionsCity.get({ QueryParams: `limit=10` }));
	// 		return undefined;
	// 	}

	// 	dispatch(actionsCity.get({ QueryParams: `q=${throttledInputCityValue}` }));

	// 	return () => {};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [throttledInputCityValue]);

	const handleCityChange = (evt, value) => {
		const idCity = value ? value.idCity : null;

		// setCityDefault(value);
		// Runtime city add
		if (typeof value === 'string') {
			setCityDefault(value);
		} else if (value && value.inputValue) {
			// Create a new value from the user input
			setCityDefault({ idCity: -1, Name: value.inputValue });
			setCityData({ idCity: -1, Name: value.inputValue });
			setOpenCityDrawer(true);
		} else {
			setCityDefault(value);
		}
		dispatch(actionsCity.reset());

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				idCity
			}
		}));

		if (!value) {
			dispatch(actionsCity.get({ QueryParams: `limit=10` }));
		}
	};

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
					message: 'Area added successfully',
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
			dispatch(actionsCity.reset());

			setFormState(InitialArea);
			setCityDefault(null);
			setCityOptions([]);
			// setCity(InitialCity);

			// if (inputRef && inputRef.current) {
			// 	inputRef.current.focus();
			// }
			if (onlineAdd) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					onCloseDrawer();
				}, 700);
			} else if (!onlineAdd) {
				if (inputRef && inputRef.current) {
					inputRef.current.focus();
				}
				// Fill autocomplete after add succes
				// dispatch(actionsProduct.get({ QueryParams: `limit=10` }));
				// dispatch(actionsCategory.get({ QueryParams: `limit=10` }));
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editSuccess]);

	useEffect(() => {
		if (getOneSuccess) {
			// eslint-disable-next-line no-shadow
			const { idCity, City } = getOneSuccess;

			if (idCity) {
				setCityDefault({ idCity, Name: City });
			}
			const assignGetOneSuccess = {
				...getOneSuccess,
				...{
					ParentCompany
				}
			};

			setFormState({
				isValid: false,
				values: assignGetOneSuccess,
				touched: {},
				errors: {}
			});

			// if (cityList && getOneSuccess.idCity) {
			// 	setCity({
			// 		City: getOneSuccess.idCity
			// 	});
			// }
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

	// const handleSelectChange = async event => {
	// 	// eslint-disable-next-line no-shadow
	// 	const { name, value } = event.target;

	// 	setCity(oldCity => ({
	// 		...oldCity,
	// 		[name.substring(2)]: value
	// 	}));

	// 	setFormState(frmState => ({
	// 		...frmState,
	// 		values: {
	// 			...frmState.values,
	// 			[name]: value
	// 		}
	// 	}));
	// };

	const handleSubmit = event => {
		event.preventDefault();

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
			dispatch(actions.edit(formState.values));
		}
	};

	const close = () => {
		onCloseDrawer();
	};
	// eslint-disable-next-line consistent-return
	const hanldeAcOnKeyDown = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
			return false;
		}
	};

	// Runtime city add
	const closeCityDrawer = () => {
		setOpenCityDrawer(false);
	};

	// Runtime city add
	const childCityProps = obj => {
		setCityDefault(obj.data);

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				idCity: obj.data.idCity
			}
		}));
	};

	const hasError = field => !!formState.errors[field];

	return (
		<div className="w-full p-20">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
				<TextField
					className="mb-16"
					name="Name"
					label="Area"
					margin="dense"
					inputRef={inputRef}
					value={formState.values.Name || ''}
					type="text"
					onChange={handleChange}
					error={hasError('Name')}
					helperText={hasError('Name') ? formState.errors.Name[0] : null}
					variant="outlined"
					required
					inputProps={{ maxLength: 40 }}
				/>
				{/* <Autocomplete
					className="mb-16"
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
							id="idCity"
							// eslint-disable-next-line
							{...params}
							label="City *"
							margin="dense"
							variant="outlined"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => setInputCityValue(e.target.value)}
							error={hasError('idCity')}
							helperText={hasError('idCity') ? formState.errors.idCity[0] : null}
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
				/> */}
				<Autocomplete
					disabled={cityDisable}
					className="mb-6"
					value={cityDefault || null}
					loading={cityLoading}
					onChange={(event, newValue) => {
						handleCityChange(event, newValue);
					}}
					filterOptions={(options, params) => {
						const filtered = filter(options, params);

						// Suggest the creation of a new value
						if (params.inputValue !== '') {
							const result = filtered.map(a => a.Name);
							const found = result.includes(params.inputValue);
							if (!found) {
								filtered.push({
									inputValue: params.inputValue,
									Name: `Add "${params.inputValue}"`
								});
							}
						}

						return filtered;
					}}
					// filterOptions={filterOptions}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					freeSolo
					forcePopupIcon
					options={cityOptions}
					getOptionLabel={option => {
						// Value selected with enter, right from the input
						if (typeof option === 'string') {
							return option;
						}
						// Add "xxx" option created dynamically
						if (option.inputValue) {
							return option.inputValue;
						}
						// Regular option
						return option.Name;
					}}
					renderOption={option => option.Name}
					// getOptionLabel={option => option.Name}
					// open={cityOpen}
					// onOpen={() => {
					// 	setCityOpen(true);
					// }}
					// onClose={() => {
					// 	setCityOpen(false);
					// }}
					getOptionSelected={(option, value) => option.Name === value.Name}
					autoHighlight
					openOnFocus
					renderInput={params => (
						<TextField
							id="idCity"
							// eslint-disable-next-line
							{...params}
							label="City *"
							variant="outlined"
							margin="dense"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => setInputCityValue(e.target.value)}
							error={hasError('idCity')}
							helperText={hasError('idCity') ? formState.errors.idCity[0] : null}
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
							onFocus={() => {
								if (cityOptions && cityOptions.length === 0) {
									dispatch(actionsCity.get({ QueryParams: `limit=10` }));
								}
							}}
						/>
					)}
				/>
				{/* <FormControl variant="outlined">
					<InputLabel ref={inputLabelCity}>City *</InputLabel>
					<Select
						id="idCity"
						value={city.City}
						onChange={handleSelectChange}
						error={hasError('idCity')}
						input={
							<OutlinedInput
								labelWidth={labelWidthCity}
								name="idCity"
								// classes={{ input: classes.selectInput }}
							/>
						}>
						{cityList
							? cityList.data.map(p => (
									<MenuItem key={p.idCity} value={p.idCity}>
										{p.Name}
									</MenuItem>
							  ))
							: ''}
					</Select>
				</FormControl> */}
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

			{/* Runtime city add */}
			{openCityDrawer && (
				<CustomDrawer
					title={cityData && cityData.Name ? cityData.Name : 'City'}
					component={City}
					onDrawerClose={closeCityDrawer}
					onCloseDrawer={closeCityDrawer}
					selectedData={cityData}
					passProps={childCityProps}
					width={30}
				/>
			)}
		</div>
	);
};

Area.propTypes = {
	edit: PropTypes.bool,
	onCloseDrawer: PropTypes.func,
	passProps: PropTypes.func,
	selectedData: PropTypes.instanceOf(Object),
	width: PropTypes.number
};

Area.defaultProps = {
	edit: false,
	onCloseDrawer: null,
	passProps: null,
	selectedData: null,
	width: 30
};

export default Area;
