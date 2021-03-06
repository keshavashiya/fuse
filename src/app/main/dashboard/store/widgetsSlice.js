/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'; // , createEntityAdapter

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgetsEntities, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.widgets.widgets
);

const widgetsSlice = createSlice({
	name: 'widgets',
	initialState: widgetsAdapter.getInitialState({}),
	// initialState,
	reducers: {
		get(state) {
			state.getLoading = true;
		},
		getSuccess(state, action) {
			state.getLoading = false;
			state.getError = null;
			widgetsAdapter.setAll(state, action.payload.widgets);
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
		}
	},
	extraReducers: {}
});

export default widgetsSlice.reducer;

export const { name, actions } = widgetsSlice;
