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
import sagaState from '../../states/store/saga';
import { name, actions } from '../store/slice';
import { name as nameState, actions as stateActions } from '../../states/store/slice';

// Runtime state add
import { CustomDrawer } from '../../../../components';
import State from '../../states/components/State';

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
	idState: {
		presence: {
			allowEmpty: false,
			message() {
				return validate.format('^%{label} is required', {
					label: 'State'
				});
			}
		}
	}
};

const filter = createFilterOptions();
// const filterOptions = createFilterOptions({
// 	matchFrom: 'any',
// 	stringify: option => option.Name
// });

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

const City = props => {
	useInjectSaga({ key: name, saga });
	useInjectSaga({ key: nameState, saga: sagaState });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer, stateReducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.city.city,
			stateReducer: reducer.state.state,
			user: reducer.auth.user
		}),
		shallowEqual
	);
	const { ParentCompany } = user.data;

	const { edit, onCloseDrawer, passProps, selectedData, width } = props;

	const inputRef = useRef(null);

	const { Loading, addSuccess, addError, editSuccess, editError, getOneSuccess } = Reducer;

	const InitialCity = {
		isValid: false,
		values: {
			ParentCompany
		},
		touched: {},
		errors: {}
	};

	// const InitialStates = {
	// 	idState: 0,
	// 	State: ''
	// };

	const [formState, setFormState] = useState(InitialCity);
	const [btnLoder, setBtnLoader] = useState(false);

	// Runtime state add
	const [onlineAdd, setOnlineAdd] = useState(false);

	const [stateDisable, setStateDisable] = useState(false);

	const [stateLoading, setStateLoading] = useState(false);
	// const [stateOpen, setStateOpen] = useState(false);
	const [stateOptions, setStateOptions] = useState([]);
	const [stateDefault, setStateDefault] = useState(null);
	const [inputStateValue, setInputStateValue] = useState('');
	const throttledInputStateValue = useThrottle(inputStateValue, 400);
	// Runtime state add
	const [openStateDrawer, setOpenStateDrawer] = useState(false);
	const [stateData, setStateData] = useState('');

	// const [state, setState] = useState(InitialStates);
	// const [stateList, setStateList] = useState(null);

	// const inputLabelState = createRef(null);

	// const [labelWidthState, setLabelWidthState] = useState(0);

	useEffect(() => {
		// setLabelWidthState(inputLabelState.current.offsetWidth);

		if (edit) {
			dispatch(actions.getOne(selectedData));
		} else if (!edit && selectedData && selectedData.idCity === -1) {
			setOnlineAdd(true);
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					Name: selectedData.Name
				}
			}));
			if (selectedData.idState) {
				dispatch(stateActions.getOne(selectedData));
			}
		}

		// dispatch(stateActions.get({ QueryParams: 'limit=50' }));

		const timer = setTimeout(() => {
			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);

		return () => {
			clearTimeout(timer);
			dispatch(actions.reset());
			dispatch(stateActions.reset());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	if (stateReducer.getSuccess) {
	// 		setStateList(stateReducer.getSuccess);

	// 		if (getOneSuccess && getOneSuccess.idState) {
	// 			setState({
	// 				State: getOneSuccess.idState
	// 			});
	// 		}
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [stateReducer.getSuccess]);
	useEffect(() => {
		if (stateReducer.getSuccess) {
			setStateOptions(stateReducer.getSuccess.data);
		} else {
			setStateOptions([]);
		}
		setStateLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateReducer.getSuccess, stateReducer.getError]);

	useEffect(() => {
		if (stateReducer.getOneSuccess && onlineAdd) {
			const { idState, Name } = stateReducer.getOneSuccess;
			setStateDefault({ idState, Name });
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					idState
				}
			}));
			setStateDisable(true);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateReducer.getOneSuccess, stateReducer.getOneError]);

	useEffect(() => {
		setStateLoading(true);
		dispatch(stateActions.reset());
		if (throttledInputStateValue === '') {
			dispatch(stateActions.get({ QueryParams: `limit=10` }));
			return undefined;
		}

		dispatch(stateActions.get({ QueryParams: `q=${throttledInputStateValue}` }));

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [throttledInputStateValue]);

	useEffect(() => {
		setStateLoading(true);
		dispatch(stateActions.reset());
		if (throttledInputStateValue === '') {
			dispatch(stateActions.get({ QueryParams: `limit=10` }));
			return undefined;
		}

		dispatch(stateActions.get({ QueryParams: `q=${throttledInputStateValue}` }));

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [throttledInputStateValue]);

	const handleStateChange = (evt, value) => {
		const idState = value ? value.idState : null;

		// setStateDefault(value);
		// Runtime state add
		if (typeof value === 'string') {
			setStateDefault(value);
		} else if (value && value.inputValue) {
			// Create a new value from the user input
			setStateDefault({ idState: -1, Name: value.inputValue });
			setStateData({ idState: -1, Name: value.inputValue });
			setOpenStateDrawer(true);
		} else {
			setStateDefault(value);
		}
		dispatch(stateActions.reset());

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				idState
			}
		}));

		if (!value) {
			dispatch(stateActions.get({ QueryParams: `limit=10` }));
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
					message: 'City added successfully',
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
			dispatch(stateActions.reset());

			setFormState(InitialCity);
			setStateDefault(null);
			setStateOptions([]);
			// setState(InitialStates);

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
			const { idState, State } = getOneSuccess;

			if (idState) {
				setStateDefault({ idState, Name: State });
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

			// if (stateList && getOneSuccess.idState) {
			// setState({
			// 	State: getOneSuccess.idState
			// });
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

	// 	setState(oldState => ({
	// 		...oldState,
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

	// Runtime state add
	const closeStateDrawer = () => {
		setOpenStateDrawer(false);
	};

	// Runtime product add
	const childStateProps = obj => {
		setStateDefault(obj.data);

		setFormState(frmState => ({
			...frmState,
			values: {
				...frmState.values,
				idState: obj.data.idState
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
					label="City"
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
					open={stateOpen}
					onOpen={() => {
						setStateOpen(true);
					}}
					onClose={() => {
						setStateOpen(false);
					}}
					getOptionSelected={(option, value) => option.Name === value.Name}
					getOptionLabel={option => option.Name}
					options={stateOptions}
					onChange={(event, newValue) => {
						handleStateChange(event, newValue);
					}}
					value={stateDefault || null}
					loading={stateLoading}
					filterOptions={filterOptions}
					autoHighlight
					openOnFocus
					renderInput={params => (
						<TextField
							id="idState"
							// eslint-disable-next-line
							{...params}
							label="State *"
							variant="outlined"
							margin="dense"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => setInputStateValue(e.target.value)}
							error={hasError('idState')}
							helperText={hasError('idState') ? formState.errors.idState[0] : null}
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{stateLoading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
						/>
					)}
				/> */}
				<Autocomplete
					disabled={stateDisable}
					className="mb-6"
					value={stateDefault || null}
					loading={stateLoading}
					onChange={(event, newValue) => {
						handleStateChange(event, newValue);
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
					options={stateOptions}
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
					// open={stateOpen}
					// onOpen={() => {
					// 	setStateOpen(true);
					// }}
					// onClose={() => {
					// 	setStateOpen(false);
					// }}
					getOptionSelected={(option, value) => option.Name === value.Name}
					autoHighlight
					openOnFocus
					renderInput={params => (
						<TextField
							id="idState"
							// eslint-disable-next-line
							{...params}
							label="State *"
							variant="outlined"
							margin="dense"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => setInputStateValue(e.target.value)}
							error={hasError('idState')}
							helperText={hasError('idState') ? formState.errors.idState[0] : null}
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{stateLoading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
							onFocus={() => {
								if (stateOptions && stateOptions.length === 0) {
									dispatch(stateActions.get({ QueryParams: `limit=10` }));
								}
							}}
						/>
					)}
				/>
				{/* <FormControl variant="outlined">
					<InputLabel ref={inputLabelState}>State *</InputLabel>
					<Select
						id="idState"
						value={state.State}
						onChange={handleSelectChange}
						error={hasError('idState')}
						input={
							<OutlinedInput
								labelWidth={labelWidthState}
								name="idState"
								// classes={{ input: classes.selectInput }}
							/>
						}>
						{stateList
							? stateList.data.map(p => (
									<MenuItem key={p.idState} value={p.idState}>
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

			{/* Runtime state add */}
			{openStateDrawer && (
				<CustomDrawer
					title={stateData && stateData.Name ? stateData.Name : 'State'}
					component={State}
					onDrawerClose={closeStateDrawer}
					onCloseDrawer={closeStateDrawer}
					selectedData={stateData}
					passProps={childStateProps}
					width={30}
				/>
			)}
		</div>
	);
};

City.propTypes = {
	edit: PropTypes.bool,
	onCloseDrawer: PropTypes.func,
	passProps: PropTypes.func,
	selectedData: PropTypes.instanceOf(Object),
	width: PropTypes.number
};

City.defaultProps = {
	edit: false,
	onCloseDrawer: null,
	passProps: null,
	selectedData: null,
	width: 30
};

export default City;
