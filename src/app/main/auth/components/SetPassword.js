import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { TextField, Button, Icon, IconButton, InputAdornment, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';
import history from '../../../../history';

import { showMessage } from '../../../store/fuse/messageSlice';

import saga from '../store/setPasswordSaga';
import { name, actions } from '../store/setPasswordSlice';
import { actions as otpAction } from '../store/otpSlice';

const schema = {
	Password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20
		}
	},
	ConfirmPassword: {
		presence: { allowEmpty: false, message: 'is required' },
		equality: 'Password',
		length: {
			maximum: 20
		}
	}
};

const useStyles = makeStyles(() => ({
	buttonProgress: {
		color: green[500],
		position: 'absolute'
	}
}));

const SetPassword = () => {
	useInjectSaga({ key: name, saga });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer, otp } = useSelector(
		reducer => ({
			Reducer: reducer.signin.setpassword,
			otp: reducer.signin.otp
		}),
		shallowEqual
	);

	const inputRef = useRef(null);

	const { Loading, Success, Error } = Reducer;

	const InitialState = {
		isValid: true,
		values: { UserName: otp.UserNameForOtp },
		touched: {},
		errors: {}
	};

	const [formState, setFormState] = useState(InitialState);
	const [btnLoder, setBtnLoader] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		let timer;

		if (!otp.UserNameForOtp) {
			history.push('/login');
		} else {
			timer = setTimeout(() => {
				if (inputRef && inputRef.current) {
					inputRef.current.focus();
				}
			}, 500);
		}
		return () => {
			clearTimeout(timer);
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
		if (Error) {
			const errors = Error.error;
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
	}, [Error]);

	useEffect(() => {
		if (Success) {
			dispatch(
				showMessage({
					message: 'Password set successfully',
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
				history.push('/login');
			}, 3000);

			dispatch(actions.reset());
			dispatch(otpAction.reset());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Success]);

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

		const errors = validate(formState.values, schema);

		setFormState(frmState => ({
			...frmState,
			isValid: !errors,
			errors: errors || {}
		}));

		if (errors) return;

		dispatch(actions.setPassword(formState.values));
	};

	const hasError = field => !!formState.errors[field];

	return (
		<div className="w-full p-20">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
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

				<TextField
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
				/>

				<Button
					disabled={!!btnLoder}
					className="w-full mx-auto mt-16 normal-case"
					color="primary"
					size="medium"
					type="submit"
					variant="contained">
					{otp.OtpType === 'Login' ? 'Set Password' : 'Change Password'}
					{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
				</Button>
			</form>
		</div>
	);
};

export default SetPassword;
