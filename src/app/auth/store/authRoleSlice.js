/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const setAuthRoles = () => async (dispatch, getState) => {
	const permissions = await authService.getAuthRoles();
	dispatch(setPermissions(JSON.parse(permissions)));
};

const initialState = {
	permission: {} // guest
};

const authRoleSlice = createSlice({
	name: 'auth/authrole',
	initialState,
	reducers: {
		setPermissions: (state, action) => action.payload,
		clearPermissions: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setPermissions, clearPermissions } = authRoleSlice.actions;

export default authRoleSlice.reducer;
