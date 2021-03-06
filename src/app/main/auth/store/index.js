import { combineReducers } from '@reduxjs/toolkit';
import { reducer as signin } from './signInSlice';
import { reducer as otp } from './otpSlice';
import { reducer as setpassword } from './setPasswordSlice';
import { reducer as authrole } from './authRoleSlice';

const signInReducers = combineReducers({
	signin,
	otp,
	setpassword,
	authrole
});

export default signInReducers;
