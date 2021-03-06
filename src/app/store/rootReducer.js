import { combineReducers } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';

import auth from '../auth/store';
import fuse from './fuse';

/** Auth */
import signInReducers from '../main/auth/store';

/** User */
import userReducers from '../main/users/users/store';

/** Role */
import roleReducers from '../main/users/roles/store';

/** Setting */
import settingReducers from '../main/users/settings/store';

/** Session */
import sessionReducers from '../main/users/sessions/store';

/** Notification Permission */
import notificationPermissionReducers from '../main/notifications/store';

/** Masters */
import countryReducers from '../main/masters/countries/store';
import stateReducers from '../main/masters/states/store';
import cityReducers from '../main/masters/cities/store';
import areaReducers from '../main/masters/areas/store';

/** Permissions */
import permissionsReducers from '../main/masters/permission/store';

/** Widgets */
import widgetsReducers from '../main/dashboard/store';

const history = createBrowserHistory();

const createReducer = asyncReducers =>
	combineReducers({
		router: connectRouter(history),
		auth,
		fuse,
		...asyncReducers,

		/** User */
		user: userReducers,
		role: roleReducers,

		/** User Setting */
		setting: settingReducers,

		/** Session */
		session: sessionReducers,

		/** Notification Permission */
		notificationPermission: notificationPermissionReducers,

		/** Auth */
		signin: signInReducers,

		/** Masters */
		country: countryReducers,
		state: stateReducers,
		city: cityReducers,
		area: areaReducers,
		// ...AppReducer

		/** Permissions */
		permissions: permissionsReducers,

		/** Widgets */
		widgets: widgetsReducers
	});

export default createReducer;
