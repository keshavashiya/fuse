import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { TextField, Button, Icon, IconButton, InputAdornment, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';
import history from '../../../../history';

import { showMessage } from '../../../store/fuse/messageSlice';

import saga from '../store/otpSaga';
import { name, actions } from '../store/otpSlice';

// import { sendOtp, sendUserAfterOtp } from '../../../../src/actions/auth/auth';

const schema = {
	UserName: {
		presence: { allowEmpty: false, message: "doesn't look like a valid username" },
		format: {
			pattern: '([0-9]{12})|[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,15}',
			flags: 'i',
			message: 'is not valid Email/Mobile No.'
		},
		length: {
			maximum: 40
		}
	}
};

const useStyles = makeStyles(() => ({
	buttonProgress: {
		color: green[500],
		position: 'absolute'
	}
}));

const SendOtp = () => {
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

	const { Loading, Success, Error, OtpType } = Reducer;

	const InitialState = {
		isValid: true,
		values: {},
		touched: {},
		errors: {}
	};

	const [formState, setFormState] = useState(InitialState);
	const [btnLoder, setBtnLoader] = useState(false);

	useEffect(() => {
		let timer;
		if (!OtpType) {
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
			// dispatch(action.sendUserAfterOtp(Success.UserName));

			const timer = setTimeout(() => {
				clearTimeout(timer);
				history.push('/otp');
			}, 500);

			dispatch(actions.sendUserNameForOtp(Success.UserName));

			dispatch(actions.pageReset());
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
		if (formState.values.UserName.length === 10 && formState.values.UserName.match(/^[0-9]+$/)) {
			formState.values.UserName = 91 + formState.values.UserName;
		}
		const errors = validate(formState.values, schema);

		setFormState(frmState => ({
			...frmState,
			isValid: !errors,
			errors: errors || {}
		}));

		if (errors) return;

		dispatch(actions.sendOtp(formState.values));
	};

	const hasError = field => !!formState.errors[field];

	return (
		<div>
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit} noValidate autoComplete="off">
				<TextField
					className="mb-16"
					name="UserName"
					label="Email/Mobile"
					inputRef={inputRef}
					value={formState.values.UserName || ''}
					type="text"
					onChange={handleChange}
					error={hasError('UserName')}
					helperText={hasError('UserName') ? formState.errors.UserName[0] : null}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton>
									<Icon className="text-20" color="action">
										person
									</Icon>
								</IconButton>
							</InputAdornment>
						),
						maxLength: 40
					}}
					variant="outlined"
					required
				/>

				<div className="flex justify-between items-center">
					<Button
						disabled={!!btnLoder}
						className="mx-auto mt-8 normal-case"
						color="primary"
						size="medium"
						type="submit"
						variant="contained">
						Send OTP
						{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
					</Button>

					{OtpType === 'Login' && (
						<div className="mt-10">
							<span className="mx-10">OR</span>
							<a href="/login" style={{ color: '#122230' }}>
								Login Via Password
							</a>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default SendOtp;
