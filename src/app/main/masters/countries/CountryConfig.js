// import ContactType from './ContactType';
import React from 'react';

const CountryConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/countries',
			component: React.lazy(() => import(/* webpackChunkName: "country" */ './Countries'))
		}
	]
};

export default CountryConfig;
