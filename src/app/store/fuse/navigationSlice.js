/* eslint-disable */
import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import navigationConfig from '../../configs/navigationConfig';
import FuseUtils from '../../../@fuse/utils';

const navigationAdapter = createEntityAdapter();
const emptyInitialState = navigationAdapter.getInitialState();
const initialState = navigationAdapter.upsertMany(emptyInitialState, navigationConfig);

export const appendNavigationItem = (item, parentId) => (dispatch, getState) => {
	const navigation = selectNavigation(getState());

	return dispatch(setNavigation(FuseUtils.appendNavItem(navigation, item, parentId)));
};

export const prependNavigationItem = (item, parentId) => (dispatch, getState) => {
	const navigation = selectNavigation(getState());

	return dispatch(setNavigation(FuseUtils.prependNavItem(navigation, item, parentId)));
};

export const updateNavigationItem = (id, item) => (dispatch, getState) => {
	const navigation = selectNavigation(getState());

	return dispatch(setNavigation(FuseUtils.updateNavItem(navigation, id, item)));
};

export const removeNavigationItem = id => (dispatch, getState) => {
	const navigation = selectNavigation(getState());

	return dispatch(setNavigation(FuseUtils.removeNavItem(navigation, id)));
};

export const setNewNavigation = createAsyncThunk('navigation/setNewNavigation', async () => {
	delete require.cache[require.resolve('../../configs/navigationConfig')];
	const navConfig = require('../../configs/navigationConfig');
	return navConfig.default;
});

export const {
	selectAll: selectNavigation,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors(state => state.fuse.navigation);

const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		setNavigation: navigationAdapter.setAll,
		resetNavigation: (state, action) => initialState,
		clearNavigation: (state, action) => navigationAdapter.upsertMany(emptyInitialState, [])
	},
	extraReducers: {
		[setNewNavigation.fulfilled]: navigationAdapter.setAll
	}
});

export const { setNavigation, resetNavigation, clearNavigation } = navigationSlice.actions;

export default navigationSlice.reducer;
