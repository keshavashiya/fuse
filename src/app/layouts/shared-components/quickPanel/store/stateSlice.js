import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
	name: 'quickPanel/state',
	initialState: false,
	reducers: {
		toggleQuickPanel: state => !state,
		openQuickPanel: () => true,
		closeQuickPanel: () => false
	}
});

export const { toggleQuickPanel, openQuickPanel, closeQuickPanel } = stateSlice.actions;

export default stateSlice.reducer;
