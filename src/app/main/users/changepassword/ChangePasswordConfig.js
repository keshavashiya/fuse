import React from 'react';

const ChangePasswordConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/changepassword',
			component: React.lazy(() => import(/* webpackChunkName: "changepassword" */ './ChangePassword'))
		}
	]
};

export default ChangePasswordConfig;
