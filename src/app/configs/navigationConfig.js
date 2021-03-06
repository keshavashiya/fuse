import authRoles from '../auth/authRoles';

const navigationConfig = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		type: 'item',
		icon: 'dashboard',
		// auth: authRoles('Dashboard'),
		url: '/dashboard'
	},
	{
		id: 'parent-master',
		title: 'Master',
		type: 'collapse',
		icon: 'business',
		children: [
			{
				id: 'crm-masters-states',
				title: 'State',
				type: 'item',
				auth: authRoles('State'),
				icon: 'domain',
				url: '/states'
			},
			{
				id: 'crm-masters-cities',
				title: 'City',
				type: 'item',
				auth: authRoles('City'),
				icon: 'location_city',
				url: '/cities'
			},
			{
				id: 'crm-masters-areas',
				title: 'Area',
				type: 'item',
				auth: authRoles('Area'),
				icon: 'crop_portrait',
				url: '/areas'
			}
		]
	},
	{
		id: 'parent-user-management',
		title: 'User Management',
		type: 'collapse',
		icon: 'supervised_user_circle',
		children: [
			{
				id: 'user-management-user',
				title: 'User',
				type: 'item',
				icon: 'format_list_bulleted',
				auth: authRoles('User'),
				url: '/users'
			}
		]
	}
];

export default navigationConfig;
