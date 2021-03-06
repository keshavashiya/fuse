/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const addSession = session => async dispatch => {
	// eslint-disable-next-line no-use-before-define
	dispatch(actions.add(session));
};

export const addSessionAck = ack => async dispatch => {
	// eslint-disable-next-line no-use-before-define
	dispatch(actions.addAck(ack));
};

export const initialState = {
	Loading: false,

	addError: null,
	addSuccess: null,

	addAckError: null,
	addAckSuccess: null
};

const slice = createSlice({
	name: 'session',
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
		addAck(state) {
			state.Loading = true;
		},
		addAckSuccess(state, action) {
			state.Loading = false;
			state.addAckError = null;
			state.addAckSuccess = action.payload;
		},
		addAckError(state, action) {
			state.Loading = false;
			state.addAckError = action.payload;
			state.addAckSuccess = null;
		},
		reset(state) {
			state.Loading = false;

			state.addError = null;
			state.addSuccess = null;

			state.addAckError = null;
			state.addAckSuccess = null;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = slice;
// export default slice.reducer;
