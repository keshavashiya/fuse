import React from 'react';

const PermissionsConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/permissions',
			component: React.lazy(() => import('./Permissions'))
		}
	]
};

export default PermissionsConfig;
