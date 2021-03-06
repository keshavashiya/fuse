/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	Loading: false,
	Error: null,
	Success: null
};

const setPasswordSlice = createSlice({
	name: 'setpassword',
	initialState,
	reducers: {
		setPassword(state) {
			state.Loading = true;
		},
		setPasswordSuccess(state, action) {
			state.Loading = false;
			state.Error = null;
			state.Success = action.payload;
		},
		setPasswordError(state, action) {
			state.Loading = false;
			state.Error = action.payload;
			state.Success = null;
		},

		reset(state) {
			state.Loading = false;
			state.Error = null;
			state.Success = null;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = setPasswordSlice;
// export default slice.reducer;
