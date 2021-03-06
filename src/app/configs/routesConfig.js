import React from 'react';
import { Redirect } from 'react-router-dom';

/** Auth */
import AuthConfig from '../main/auth/AuthConfig';

/** User */
import UserConfig from '../main/users/users/UserConfig';
import RoleConfig from '../main/users/roles/RoleConfig';
import ChangePasswordConfig from '../main/users/changepassword/ChangePasswordConfig';

/** Masters */
import CountryConfig from '../main/masters/countries/CountryConfig';
import StatesConfig from '../main/masters/states/StateConfig';
import CityConfig from '../main/masters/cities/CityConfig';
import AreaConfig from '../main/masters/areas/AreaConfig';

/** Notification */
import NotificationConfig from '../main/notifications/NotificationConfig';

/** Pages */
import pagesConfigs from '../main/pages/pagesConfigs';

/** Fuse */
import FuseUtils from '../../@fuse/utils';

/** Permissions */
import PermissionsConfig from '../main/masters/permission/PermissionsConfig';
import AddPermissionConfig from '../main/masters/permission/components/AddPermissionConfig';

/** Dashboard */
import DashboardConfig from '../main/dashboard/DashboardConfig';

const routeConfigs = [
	/** Auth */
	AuthConfig,

	/** User */
	UserConfig,
	RoleConfig,
	ChangePasswordConfig,

	/** Masters */
	CountryConfig,
	StatesConfig,
	CityConfig,
	AreaConfig,

	/** Notification */
	NotificationConfig,

	/** Pages */
	...pagesConfigs,

	/** Permissions */
	PermissionsConfig,
	AddPermissionConfig,

	/** Dashboard */
	DashboardConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/dashboard" />
	},
	{
		component: () => <Redirect to="/pages/errors/error-404" />
	}
];

export default routes;
