import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { API_BASE } from '../apiurl/baseurl';

const client = axios.create({
	baseURL: API_BASE,
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 100000
});

// Function that will be called to refresh authorization
// eslint-disable-next-line consistent-return
const refreshAuthLogic = failedRequest =>
	axios
		.post(`${API_BASE}/api/auth/v1/token/refresh`, {
			RefreshToken: localStorage.getItem('refreshtoken')
		})
		.then(tokenRefreshResponse => {
			localStorage.setItem('accesstoken', tokenRefreshResponse.data.AccessToken);
			localStorage.setItem('refreshtoken', tokenRefreshResponse.data.RefreshToken);

			// eslint-disable-next-line no-param-reassign
			failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.AccessToken}`;
			return Promise.resolve();
		});

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(client, refreshAuthLogic, { skipWhileRefreshing: false });

client.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accesstoken');

		if (token) {
			// eslint-disable-next-line no-param-reassign
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	}
);

client.interceptors.response.use(
	response => {
		// Return a successful response back to the calling service
		return response;
	},
	// eslint-disable-next-line consistent-return
	error => {
		const isRefresh = error.config.url.indexOf('/api/auth/v1/token/refresh');
		if (isRefresh > -1) {
			// if (error.response.data.message === 'INVALID_REFRESH_TOKEN') {
			// }
			window.location.href = '/signout';
		}
		if (error && error.response && error.response.status === 401) {
			if (error.response.data.message === 'TOKEN_EXPIRED') {
				window.location.href = '/signout?expired';
			} else {
				return Promise.reject(error);
			}
		}

		if (error && error.response && error.response.status === 403) {
			window.location.href = '/notfound';
		}

		// Return any error which is not due to authentication back to the calling service
		if (error.response.status !== 401) {
			return new Promise((resolve, reject) => {
				reject(error);
			});
		}
	}
);

/**
 * Request Wrapper with default success/error actions
 */
const request = async options => {
	const onSuccess = response => {
		// console.log("Request Successful!", response);
		return response;
	};

	const onError = error => {
		// console.log("Request Failed:", error.config);
		if (error.response) {
			// console.log("Status:", error.response.status);
			// console.log("Data:", error.response.data);
			// console.log("Headers:", error.response.headers);
		} else {
			// console.log("Error Message:", error.message);
		}
		return Promise.reject(error.response || error.message);
	};

	try {
		const response = await client(options);
		return onSuccess(response);
	} catch (error) {
		return onError(error);
	}
};

export default request;
