import { combineReducers } from '@reduxjs/toolkit';
import { reducer as permissions } from './slice';
import { reducer as roles } from './userRolesSlice';

const permissionsReducers = combineReducers({
	permissions,
	roles
});

export default permissionsReducers;
