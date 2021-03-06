/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const updateUserSetting = theme => async dispatch => {
	const setting = { AppType: 'Browser', Theme: theme };

	// eslint-disable-next-line no-use-before-define
	dispatch(actions.edit(setting));
};

export const initialState = {
	Loading: false,

	errorError: null,
	errorSuccess: null
};

const slice = createSlice({
	name: 'setting',
	initialState,
	reducers: {
		edit(state) {
			state.Loading = true;
		},
		editSuccess(state, action) {
			state.Loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action) {
			state.Loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		reset(state) {
			state.Loading = false;

			state.editError = null;
			state.editSuccess = null;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = slice;
// export default slice.reducer;
