import React from 'react';

const UserConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/users',
			component: React.lazy(() => import(/* webpackChunkName: "user" */ './Users'))
		}
	]
};

export default UserConfig;
