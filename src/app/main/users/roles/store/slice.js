/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	getLoading: false,
	getError: null,
	getSuccess: null,

	Loading: false,

	addError: null,
	addSuccess: null,

	errorError: null,
	errorSuccess: null,

	deleteError: null,
	deleteSuccess: null,

	getOneLoading: false,
	getOneError: null,
	getOneSuccess: null
};

const slice = createSlice({
	name: 'role',
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
		add(state) {
			state.Loading = true;
		},
		addSuccess(state, action) {
			state.Loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action) {
			state.Loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
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
		delete(state) {
			state.Loading = true;
		},
		deleteSuccess(state, action) {
			state.Loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action) {
			state.Loading = false;
			state.deleteError = action.payload;
			state.deleteSuccess = null;
		},
		getOne(state) {
			state.getOneLoading = true;
		},
		getOneSuccess(state, action) {
			state.getOneLoading = false;
			state.getOneError = null;
			state.getOneSuccess = action.payload;
		},
		getOneError(state, action) {
			state.getOneLoading = false;
			state.getOneError = action.payload;
			state.getOneSuccess = null;
		},
		reset(state) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = null;

			state.Loading = false;

			state.addError = null;
			state.addSuccess = null;

			state.editError = null;
			state.editSuccess = null;

			state.deleteError = null;
			state.deleteSuccess = null;

			state.getOneLoading = false;
			state.getOneError = null;
			state.getOneSuccess = null;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = slice;
// export default slice.reducer;
