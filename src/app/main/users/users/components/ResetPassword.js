/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { TextField, Button, Icon, IconButton, InputAdornment, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';

import { showMessage } from '../../../../store/fuse/messageSlice';

import saga from '../store/resetPasswordSaga';
import { name, actions } from '../store/resetPasswordSlice';

// import { resetPassword, reset } from '../../../../../src/actions/users/Users';

const schema = {
	Password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20
		}
	}
};

const schemaOld = {
	OldPassword: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20
		}
	},
	Password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20
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
	}
}));

const ResetPassword = props => {
	useInjectSaga({ key: name, saga });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.user.resetpassword,
			user: reducer.auth.user
		}),
		shallowEqual
	);

	const { ParentCompany } = user.data;

	const { resetpassword, onCloseDialog, passProps, selectedData } = props;

	const inputRef = useRef(null);
	const inputOldRef = useRef(null);

	const { Loading, Success, Error } = Reducer;

	const InitialValue = {
		isValid: false,
		values: {
			ParentCompany,
			isResetPassword: !!resetpassword
		},
		touched: {},
		errors: {}
	};

	const [formState, setFormState] = useState(InitialValue);
	const [btnLoder, setBtnLoader] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(false);

	useEffect(() => {
		if (resetpassword) {
			setFormState(frmState => ({
				...frmState,
				values: {
					...frmState.values,
					idUser: selectedData.idUser
				}
			}));
		}

		const timer = setTimeout(() => {
			if (resetpassword) {
				if (inputRef && inputRef.current) {
					inputRef.current.focus();
				}
			} else if (inputOldRef && inputOldRef.current) {
				inputOldRef.current.focus();
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
		if (Success) {
			dispatch(
				showMessage({
					message: resetpassword ? 'Password reset successfully' : 'Password change successfully',
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);

			setFormState(InitialValue);
			const timer = setTimeout(() => {
				clearTimeout(timer);
				if (passProps) {
					passProps({ type: 'EDIT', data: Success });
					onCloseDialog();
				}
			}, 1000);
			dispatch(actions.reset());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Success]);

	useEffect(() => {
		if (Error) {
			const errors = Error.error;

			dispatch(
				showMessage({
					message: resetpassword ? 'Error while reset password' : errors.message,
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);

			if (errors) {
				setFormState(frmState => ({
					...frmState,
					isValid: !errors,
					errors: errors || {}
				}));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Error]);

	const handleChange = event => {
		event.persist();

		if (event.target.name === 'Password') {
			setFormState(value => ({
				...value,
				values: {
					...formState.values,
					[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
					ConfirmPassword: event.target.value
				},
				touched: {
					...formState.touched,
					[event.target.name]: true
				}
			}));
		} else {
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
		}
	};

	const handleSubmit = event => {
		event.preventDefault();

		if (formState.values.Password !== formState.values.ConfirmPassword) {
			const mismatchError = {
				ConfirmPassword: ['Password and confirm password should be equal']
			};

			setFormState(frmState => ({
				...frmState,
				isValid: !mismatchError,
				errors: mismatchError || {}
			}));

			return;
		}

		let errors;
		if (!resetpassword) {
			errors = validate(
				{
					OldPassword: formState.values.OldPassword,
					Password: formState.values.Password
				},
				schemaOld
			);
		} else {
			errors = validate(formState.values, schema);
		}

		if (errors) {
			setFormState(frmState => ({
				...frmState,
				isValid: !errors,
				errors: errors || {}
			}));
		} else {
			dispatch(actions.resetPassword(formState.values));
		}
	};

	const hasError = field => !!formState.errors[field];

	return (
		<div>
			<form className="flex flex-col mt-16 p-8" onSubmit={handleSubmit} noValidate autoComplete="off">
				{!resetpassword && (
					<TextField
						className="mb-16"
						name="OldPassword"
						label="Old Password"
						inputRef={inputOldRef}
						value={formState.values.OldPassword || ''}
						type="password"
						onChange={handleChange}
						error={hasError('OldPassword')}
						helperText={hasError('OldPassword') ? formState.errors.OldPassword[0] : null}
						InputProps={{
							type: showOldPassword ? 'text' : 'password',
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => {
											setShowOldPassword(!showOldPassword);
										}}>
										<Icon className="text-20" color="action">
											{showOldPassword ? 'visibility' : 'visibility_off'}
										</Icon>
									</IconButton>
								</InputAdornment>
							)
						}}
						variant="outlined"
						required
					/>
				)}
				<TextField
					className="mb-16"
					name="Password"
					label="New Password"
					inputRef={inputRef}
					value={formState.values.Password || ''}
					type="password"
					onChange={handleChange}
					error={hasError('Password')}
					helperText={hasError('Password') ? formState.errors.Password[0] : null}
					InputProps={{
						type: showPassword ? 'text' : 'password',
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => {
										setShowPassword(!showPassword);
									}}>
									<Icon className="text-20" color="action">
										{showPassword ? 'visibility' : 'visibility_off'}
									</Icon>
								</IconButton>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				{/* <TextField
				className="mb-16"
				name="ConfirmPassword"
				label="Confirm Password"
				value={formState.values.ConfirmPassword || ''}
				type="password"
				onChange={handleChange}
				error={hasError('ConfirmPassword')}
				helperText={hasError('ConfirmPassword') ? formState.errors.ConfirmPassword[0] : null}
				InputProps={{
					type: showConfirmPassword ? 'text' : 'password',
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => {
									setShowConfirmPassword(!showConfirmPassword);
								}}>
								<Icon className="text-20" color="action">
									{showConfirmPassword ? 'visibility' : 'visibility_off'}
								</Icon>
							</IconButton>
						</InputAdornment>
					)
				}}
				variant="outlined"
				required
			/> */}

				<div className="px-16">
					<Button disabled={!!btnLoder} color="primary" size="medium" type="submit" variant="contained">
						{resetpassword ? 'Reset' : 'Change'}
						{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
					</Button>
					{resetpassword && (
						<Button className="normal-case" color="primary" size="small" onClick={() => onCloseDialog()}>
							Cancel
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};

ResetPassword.propTypes = {
	onCloseDialog: PropTypes.func,
	passProps: PropTypes.func,
	selectedData: PropTypes.instanceOf(Object),
	resetpassword: PropTypes.bool
};

ResetPassword.defaultProps = {
	onCloseDialog: null,
	passProps: null,
	selectedData: null,
	resetpassword: false
};

export default ResetPassword;
