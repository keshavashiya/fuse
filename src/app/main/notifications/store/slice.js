/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	Loading: false,

	addError: null,
	addSuccess: null,

	errorError: null,
	errorSuccess: null,

	deleteError: null,
	deleteSuccess: null,

	subscribeTopicError: null,
	subscribeTopicSuccess: null,

	unSubscribeTopicError: null,
	unSubscribeTopicSuccess: null
};

const slice = createSlice({
	name: 'notification/permission',
	initialState,
	reducers: {
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
		subscribeTopic(state) {
			state.Loading = true;
		},
		subscribeTopicSuccess(state, action) {
			state.Loading = false;
			state.subscribeTopicError = null;
			state.subscribeTopicSuccess = action.payload;
		},
		subscribeTopicError(state, action) {
			state.Loading = false;
			state.subscribeTopicError = action.payload;
			state.subscribeTopicSuccess = null;
		},
		unSubscribeTopic(state) {
			state.Loading = true;
		},
		unSubscribeTopicSuccess(state, action) {
			state.Loading = false;
			state.unSubscribeTopicError = null;
			state.unSubscribeTopicSuccess = action.payload;
		},
		unSubscribeTopicError(state, action) {
			state.Loading = false;
			state.unSubscribeTopicError = action.payload;
			state.unSubscribeTopicSuccess = null;
		},
		showNotification(state, action) {
			state.showNotification = action.payload;
		},
		reset(state) {
			state.Loading = false;

			state.addError = null;
			state.addSuccess = null;

			state.deleteError = null;
			state.deleteSuccess = null;

			state.subscribeTopicError = null;
			state.subscribeTopicSuccess = null;

			state.unSubscribeTopicError = null;
			state.unSubscribeTopicSuccess = null;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = slice;
// export default slice.reducer;
