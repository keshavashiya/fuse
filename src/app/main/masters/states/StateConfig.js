import React from 'react';
import authRoles from '../../../auth/authRoles';

const StateConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles('State'), // ['admin']
	routes: [
		{
			path: '/states',
			component: React.lazy(() => import(/* webpackChunkName: "state" */ './States'))
		}
	]
};

export default StateConfig;
