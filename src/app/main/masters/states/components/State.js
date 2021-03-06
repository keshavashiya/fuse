import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import { Button, TextField, CircularProgress } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';

import { showMessage } from '../../../../store/fuse/messageSlice';

import saga from '../store/saga';
import { name, actions } from '../store/slice'; // reducer

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

const State = props => {
	useInjectSaga({ key: name, saga });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.state.state,
			user: reducer.auth.user
		}),
		shallowEqual
	);
	const { ParentCompany } = user.data;

	const { edit, onCloseDrawer, passProps, selectedData, width } = props;

	const inputRef = useRef(null);

	const { Loading, addSuccess, addError, editSuccess, editError, getOneSuccess } = Reducer;

	const InitialState = {
		isValid: false,
		values: {
			ParentCompany,
			idCountry: 99
		},
		touched: {},
		errors: {}
	};

	const [formState, setFormState] = useState(InitialState);
	const [btnLoder, setBtnLoader] = useState(false);

	// Runtime state add
	const [onlineAdd, setOnlineAdd] = useState(false);

	useEffect(() => {
		if (edit) {
			dispatch(actions.getOne(selectedData));
		} else if (!edit && selectedData && selectedData.idState === -1) {
			setOnlineAdd(true);
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					Name: selectedData.Name
				}
			}));
		}

		const timer = setTimeout(() => {
			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);

		return () => {
			clearTimeout(timer);
			dispatch(actions.reset());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
					message: 'State added successfully',
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

			setFormState(InitialState);

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
	const hasError = field => !!formState.errors[field];

	return (
		<div className="w-full p-20">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
				<TextField
					className="mb-16"
					name="Name"
					label="State"
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

State.propTypes = {
	edit: PropTypes.bool,
	onCloseDrawer: PropTypes.func,
	passProps: PropTypes.func,
	selectedData: PropTypes.instanceOf(Object),
	width: PropTypes.number
};

State.defaultProps = {
	edit: false,
	onCloseDrawer: null,
	passProps: null,
	selectedData: null,
	width: 30
};

export default State;
