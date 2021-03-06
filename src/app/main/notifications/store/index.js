import { combineReducers } from '@reduxjs/toolkit';
import { reducer as notificationPermission } from './slice';
import { reducer as notifications } from './fetchSlice';

const notificationPermissionReducers = combineReducers({
	notificationPermission,
	notifications
});

export default notificationPermissionReducers;
