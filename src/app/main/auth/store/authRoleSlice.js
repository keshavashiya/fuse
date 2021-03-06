/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	Loading: false,
	Error: null,
	Success: null
};

const authRoleSlice = createSlice({
	name: 'authrole',
	initialState,
	reducers: {
		authRole(state) {
			state.Loading = true;
		},
		authRoleSuccess(state, action) {
			state.Loading = false;
			state.Error = null;
			state.Success = action.payload;
		},
		authRoleError(state, action) {
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

export const { name, reducer, actions } = authRoleSlice;
// export default slice.reducer;
