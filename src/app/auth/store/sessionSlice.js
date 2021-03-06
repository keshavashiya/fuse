/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

export const setSessionData = data => async (dispatch, getState) => {
	if (data.Notification) {
		dispatch(setNotification(data));
	} else if (data.AuthRole) {
		dispatch(setAuthRole(data));
	}
};

export const clearSessionData = type => async (dispatch, getState) => {
	if (type === 'Notification') {
		dispatch(clearNotification());
	} else if (type === 'AuthRole') {
		dispatch(clearAuthRole());
	}

	dispatch(clearSession());
};

const initialState = {};

const sessionSlice = createSlice({
	name: 'auth/session',
	initialState,
	reducers: {
		setNotification: (state, action) => action.payload,
		setAuthRole: (state, action) => action.payload,
		clearNotification: (state, action) => initialState,
		clearAuthRole: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setNotification, setAuthRole, clearNotification, clearAuthRole } = sessionSlice.actions;

export default sessionSlice.reducer;
