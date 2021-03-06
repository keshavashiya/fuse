/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	getLoading: false,
	getError: null,
	getSuccess: null,

	Loading: false
};

const fetchSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		get(state) {
			state.getLoading = true;
		},
		getSuccess(state, action) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		reset(state) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = null;

			state.Loading = false;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = fetchSlice;
// export default slice.reducer;
