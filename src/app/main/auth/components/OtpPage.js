import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { TextField, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';
import history from '../../../../history';

import { showMessage } from '../../../store/fuse/messageSlice';

import saga from '../store/otpSaga';
import { name, actions } from '../store/otpSlice';

import { submitLogin } from '../../../auth/store/loginSlice';

const schema = {
	OTPCode: {
		presence: { allowEmpty: false },
		length: {
			minimum: 4,
			message: 'OTP code should be 4 character long'
		}
	}
};

const useStyles = makeStyles(() => ({
	buttonProgress: {
		color: green[500],
		position: 'absolute'
	}
}));

const OtpPage = () => {
	useInjectSaga({ key: name, saga });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer } = useSelector(
		reducer => ({
			Reducer: reducer.signin.otp
		}),
		shallowEqual
	);

	const inputRef = useRef(null);

	const { Loading, Success, Error, OtpType, UserNameForOtp, resendSuccess, resendError } = Reducer;

	const InitialState = {
		isValid: true,
		values: { Serial: '1', AppType: 'Browser', UserName: UserNameForOtp, Type: OtpType },
		touched: {},
		errors: {}
	};

	const [formState, setFormState] = useState(InitialState);
	const [btnLoder, setBtnLoader] = useState(false);

	const [timedOut, setTimedOut] = useState(false);

	useEffect(() => {
		let interval;
		let timer;
		if (!OtpType) {
			history.push('/login');
		} else if (!UserNameForOtp) {
			history.push('/sendotp');
		} else {
			let time = 59;
			const countdownel = document.getElementById('countdown');
			interval = setInterval(() => {
				if (time !== 0) {
					const sec = time % 60;
					countdownel.innerHTML = `${sec}s`;
					// eslint-disable-next-line
					time--;
				} else {
					clearInterval(interval);
					setTimedOut(true);
					countdownel.innerHTML = '';
				}
			}, 1000);

			timer = setTimeout(() => {
				if (inputRef && inputRef.current) {
					inputRef.current.focus();
				}
			}, 500);
		}

		return () => {
			clearInterval(interval);
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
			if (OtpType === 'Login') {
				if (Success.isFirstLogin) {
					history.push('/setpassword');
				} else {
					// dispatch(signInViaOTP(Success.Login));
					dispatch(submitLogin(Success.Login));

					localStorage.setItem('accesstoken', Success.Login.AccessToken);
					localStorage.setItem('refreshtoken', Success.Login.RefreshToken);

					dispatch(actions.reset());
					history.push('/');
					//	history.push('/login');
				}
			} else {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					history.push('/setpassword');
				}, 500);
			}

			dispatch(actions.pageReset());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Success]);

	useEffect(() => {
		if (resendError) {
			const errors = Error.error;
			if (errors) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resendError]);

	useEffect(() => {
		if (resendSuccess) {
			dispatch(
				showMessage({
					message: 'OTP sent',
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);
			dispatch(actions.resendReset());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resendSuccess]);

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

		dispatch(actions.validateOtp(formState.values));
	};

	const requestResendOTP = () => {
		dispatch(actions.resendOtp({ UserName: UserNameForOtp }));
	};

	const hasError = field => !!formState.errors[field];

	return (
		<div className="w-full">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
				<TextField
					className="mb-16"
					name="OTPCode"
					label="OTP"
					inputRef={inputRef}
					value={formState.values.OTPCode || ''}
					type="text"
					onChange={handleChange}
					error={hasError('OTPCode')}
					helperText={hasError('OTPCode') ? formState.errors.OTPCode[0] : null}
					variant="outlined"
					required
					inputProps={{ maxLength: 4 }}
				/>

				<div className="flex flex-row items-center justify-between">
					{!timedOut ? (
						<a href="/login">
							Resend in <span id="countdown">60s</span> Or Back to Login
						</a>
					) : (
						// eslint-disable-next-line
						<span style={{ color: '#61dafb' }} onClick={requestResendOTP} className="cursor-pointer">
							Resend OTP
						</span>
					)}
				</div>

				<Button
					disabled={!!btnLoder}
					className="w-full mx-auto mt-16 normal-case"
					color="primary"
					size="medium"
					type="submit"
					variant="contained">
					Validate
					{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
				</Button>
			</form>
		</div>
	);
};

export default OtpPage;
