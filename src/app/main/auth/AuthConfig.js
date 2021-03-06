import AuthTab from './AuthTab';
import SignOut from './components/SignOut';

const AuthConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	// auth: authRoles.onlyGuest,
	routes: [
		{
			path: ['/login', '/setpassword', '/sendotp', '/otp'],
			component: AuthTab
		},
		{
			path: '/signout',
			component: SignOut
		}
	]
};

export default AuthConfig;
