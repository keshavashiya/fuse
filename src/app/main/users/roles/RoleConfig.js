import React from 'react';

const RoleConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/roles',
			component: React.lazy(() => import(/* webpackChunkName: "role" */ './Roles'))
		}
	]
};

export default RoleConfig;
