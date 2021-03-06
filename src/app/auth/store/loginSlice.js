/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

import { setUserData } from './userSlice';
import { setAuthRoles } from './authRoleSlice';

export const submitLogin = userData => async dispatch => {
	return authService
		.signIn(userData)
		.then(user => {
			dispatch(setUserData(user));
			// Set from localstorage
			dispatch(setAuthRoles()); // userData.AuthRoles

			return dispatch(loginSuccess());
		})
		.catch(error => {
			return dispatch(loginError(error));
		});
};

const initialState = {
	success: false,
	error: {
		username: null,
		password: null
	}
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
