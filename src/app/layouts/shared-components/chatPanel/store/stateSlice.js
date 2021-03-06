import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
	name: 'chatPanel/state',
	initialState: false,
	reducers: {
		toggleChatPanel: state => !state,
		openChatPanel: () => true,
		closeChatPanel: () => false
	},
	extraReducers: {}
});

export const { toggleChatPanel, openChatPanel, closeChatPanel } = stateSlice.actions;

export default stateSlice.reducer;
