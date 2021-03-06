/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	Loading: false,
	Error: null,
	Success: null
};

const signInSlice = createSlice({
	name: 'signin',
	initialState,
	reducers: {
		signIn(state) {
			state.Loading = true;
		},
		signInSuccess(state, action) {
			state.Loading = false;
			state.Error = null;
			state.Success = action.payload;
		},
		signInError(state, action) {
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

export const { name, reducer, actions } = signInSlice;
// export default slice.reducer;
