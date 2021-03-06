/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
	TextField,
	Button,
	Icon,
	IconButton,
	InputAdornment,
	FormControlLabel,
	Checkbox,
	CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import validate from 'validate.js';
import history from '../../../../history';

import { showMessage } from '../../../store/fuse/messageSlice';

import saga from '../store/signInSaga';
import { name, actions } from '../store/signInSlice';
import { actions as otpAction } from '../store/otpSlice';

import { submitLogin } from '../../../auth/store/loginSlice';

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
	},
	Password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 20
		}
	}
};

const useStyles = makeStyles(() => ({
	buttonProgress: {
		color: green[500],
		position: 'absolute'
	},
	otpLogin: {
		marginTop: '10px',
		color: '#122230'
	}
}));

const Login = () => {
	useInjectSaga({ key: name, saga });

	const classes = useStyles();
	const dispatch = useDispatch();
	const { Reducer } = useSelector(
		reducer => ({
			Reducer: reducer.signin.signin
		}),
		shallowEqual
	);

	const inputRef = useRef(null);

	const { Loading, Success, Error } = Reducer;

	const InitialState = {
		isValid: true,
		values: { Serial: '1', AppType: 'Browser' },
		touched: {},
		errors: {}
	};

	const [formState, setFormState] = useState(InitialState);
	const [btnLoder, setBtnLoader] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);

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
			dispatch(submitLogin(Success));

			const timer = setTimeout(() => {
				clearTimeout(timer);
				history.push('/dashboard');
			}, 500);

			dispatch(actions.reset());
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

		dispatch(actions.signIn(formState.values));
	};

	const ViaOTP = (e, redirect) => {
		e.preventDefault();
		dispatch(otpAction.sendOtpType(redirect === 'forgotpassword' ? 'Forgot Password' : 'Login'));
		history.push('/sendotp');
	};

	const hasError = field => !!formState.errors[field];

	return (
		<div className="w-full">
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
						maxLength: 2
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					name="Password"
					label="Password"
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
						),
						maxLength: 4
					}}
					variant="outlined"
					required
				/>

				<div className="flex flex-row items-center justify-between">
					<FormControlLabel
						control={
							<Checkbox
								checked={rememberMe || false}
								onChange={() => setRememberMe(!rememberMe)}
								value="RememberMe"
								color="primary"
							/>
						}
						label="Remember me!"
					/>
					<div>
						<a href="#" onClick={e => ViaOTP(e, 'forgotpassword')} style={{ color: '#122230' }}>
							Forgot Password?
						</a>
					</div>
				</div>
				<Button
					disabled={!!btnLoder}
					className="w-full mx-auto mt-16 normal-case"
					color="primary"
					size="medium"
					type="submit"
					variant="contained">
					Sign In
					{btnLoder && <CircularProgress size={24} className={classes.buttonProgress} />}
				</Button>

				<div className={classes.otpLogin}>
					<a href="#" onClick={e => ViaOTP(e, 'sendotp')} style={{ color: '#122230' }}>
						Login via OTP?
					</a>
				</div>
			</form>
		</div>
	);
};

export default Login;
