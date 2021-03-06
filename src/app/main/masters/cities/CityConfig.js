import React from 'react';
import authRoles from '../../../auth/authRoles';

const CityConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles('City'),
	routes: [
		{
			path: '/cities',
			component: React.lazy(() => import(/* webpackChunkName: "city" */ './Cities'))
		}
	]
};

export default CityConfig;
