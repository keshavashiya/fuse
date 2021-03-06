import React from 'react';

const AddPermissionConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/addpermission',
			component: React.lazy(() => import(/* webpackChunkName: "addpricing" */ './AddPermission'))
		}
	]
};

export default AddPermissionConfig;
