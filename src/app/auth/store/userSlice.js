/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';
import _ from '../../../@lodash';
import authService from '../../services/authService';
import { setInitialSettings, setDefaultSettings } from '../../store/fuse/settingsSlice';
import { clearNavigation } from '../../store/fuse/navigationSlice';
import history from '../../../history';

import { updateUserSetting } from '../../main/users/settings/store/slice';

export const setUserData = user => async (dispatch, getState) => {
	/*
        You can redirect the logged-in user to a specific route depending on his role
         */

	history.location.state = {
		redirectUrl: user.redirectUrl // for example 'apps/academy'
	};

	/*
    Set User Settings
     */
	dispatch(setDefaultSettings(user.data.settings));

	dispatch(setUser(user));
};

export const updateUser = updateData => async (dispatch, getState) => {
	const { user } = getState().auth;

	const newUser = {
		...user,
		data: {
			...user.data,
			displayName: updateData.FirstName + ' ' + updateData.LastName,
			email: updateData.Email,
			photoURL:
				updateData.Files && updateData.Files[0] && updateData.Files[0].File ? updateData.Files[0].File : ''
		}
	};

	dispatch(setUser(newUser));
	// Set User to localstorage
	authService.setUserSession(JSON.stringify(newUser));
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	// dispatch(updateUserData(user));
	dispatch(updateUserSetting(settings));
	// Set User to localstorage
	authService.setUserSession(JSON.stringify(user));
	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
			shortcuts
		}
	};

	// dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = redirect => async (dispatch, getState) => {
	const { user } = getState().auth;

	// if (!user.role || user.role.length === 0) {
	// 	// is guest
	// 	return null;
	// }

	if (redirect) {
		history.push({
			pathname: redirect
		});
	} else {
		history.push({
			pathname: '/login'
		});
	}

	authService.logout();

	dispatch(setInitialSettings());

	dispatch(userLoggedOut());

	dispatch(clearNavigation());
};

const initialState = {
	role: [], // guest
	data: {
		displayName: 'User',
		photoURL: 'public/assets/images/avatars/Velazquez.jpg',
		email: 'Role',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	}
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => action.payload,
		userLoggedOut: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setUser, setUserDataAuth0, setUserDataFirebase, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
