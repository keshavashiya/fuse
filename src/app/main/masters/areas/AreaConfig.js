import React from 'react';
import authRoles from '../../../auth/authRoles';

const AreaConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles('Area'), // ['admin']
	routes: [
		{
			path: '/areas',
			component: React.lazy(() => import(/* webpackChunkName: "area" */ './Areas'))
		}
	]
};

export default AreaConfig;
