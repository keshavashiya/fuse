import React from 'react';

const DashboardConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/dashboard',
			component: React.lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'))
		}
	]
};

export default DashboardConfig;
