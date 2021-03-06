/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	Loading: false,
	Error: null,
	Success: null
};

const resetPasswordSlice = createSlice({
	name: 'resetpassword',
	initialState,
	reducers: {
		resetPassword(state) {
			state.Loading = true;
		},
		resetPasswordSuccess(state, action) {
			state.Loading = false;
			state.Error = null;
			state.Success = action.payload;
		},
		resetPasswordError(state, action) {
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

export const { name, reducer, actions } = resetPasswordSlice;
// export default slice.reducer;
