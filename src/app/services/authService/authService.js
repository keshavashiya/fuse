/* eslint-disable */
import jwtDecode from 'jwt-decode';
import FuseUtils from '../../../@fuse/utils';

class AuthService extends FuseUtils.EventEmitter {
	init() {
		this.handleAuthentication();
	}

	signIn = tokenData => {
		return new Promise((resolve, reject) => {
			const user = {
				role: [tokenData.RoleType],
				from: 'browser',
				data: {
					displayName: tokenData.FirstName + ' ' + tokenData.LastName,
					photoURL:
						tokenData.Files && tokenData.Files[0] && tokenData.Files[0].File ? tokenData.Files[0].File : '',
					email: tokenData.Email,
					ParentCompany: tokenData.ParentCompany,
					UserType: tokenData.UserType,
					settings: tokenData.Settings && tokenData.Settings.Theme ? tokenData.Settings.Theme : {},
					shortcuts:
						tokenData.Settings && tokenData.Settings.Shortcut ? tokenData.Settings.Shortcut.split(',') : []
				}
			};

			// settings:
			// 	tokenData.user_metadata && tokenData.user_metadata.settings
			// 		? tokenData.user_metadata.settings
			// 		: {},
			// shortcuts: tokenData.user_metadata && tokenData.user_metadata.shortcuts
			// 	? tokenData.user_metadata.shortcuts
			// 	: [];

			// localStorage.setItem('accesstoken', login.Success.AccessToken);
			// localStorage.setItem('refreshtoken', login.Success.RefreshToken);

			if (user) {
				this.setSession(tokenData.AccessToken);
				this.setRefreshToken(tokenData.RefreshToken);
				this.setUserSession(JSON.stringify(user));
				this.setAuthRoles(JSON.stringify(tokenData.AuthRoles));
				resolve(user);
			} else {
				reject('user not set');
			}
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			const user = this.getUserData();
			resolve(JSON.parse(user));
		});
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		// const user_data = this.getUserData();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			// this.setSession(access_token);
			// this.setUserSession(JSON.stringify(user_data));
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.setRefreshToken(null);
			this.setUserSession(null);
			this.setAuthRoles(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('accesstoken', access_token);
			// axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('accesstoken');
		}
	};

	setRefreshToken = refresh_token => {
		if (refresh_token) {
			localStorage.setItem('refreshtoken', refresh_token);
			// axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('refreshtoken');
		}
	};

	setUserSession = user_data => {
		if (user_data) {
			localStorage.removeItem('User');
			localStorage.setItem('User', user_data);
		} else {
			localStorage.removeItem('User');
		}
	};

	setAuthRoles = auth_roles => {
		if (auth_roles) {
			localStorage.removeItem('AuthRoles');
			localStorage.setItem('AuthRoles', auth_roles);
		} else {
			localStorage.removeItem('AuthRoles');
		}
	};

	getAuthRoles = () => {
		return new Promise((resolve, reject) => {
			const authroles = this.getAuthRoles();
			resolve(authroles);
		});
	};

	logout = () => {
		this.setSession(null);
		this.setRefreshToken(null);
		this.setUserSession(null);
		this.setAuthRoles(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);

		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('accesstoken');
	};
	getRefreshToken = () => {
		return window.localStorage.getItem('refreshtoken');
	};
	getUserData = () => {
		return window.localStorage.getItem('User');
	};
	getAuthRoles = () => {
		return window.localStorage.getItem('AuthRoles');
	};
}

const instance = new AuthService();

export default instance;
