/** @type {Object} */
const defaults = {
	/** @type {Number[]} */
	statusCodes: [
		401 // Unauthorized
	]
};
// patch
// let refreshProcessEnable = true;

/**
 * Creates an authentication refresh interceptor that binds to any error response.
 * If the response code is 401, interceptor tries to call the refreshTokenCall which must return a Promise.
 * While refreshTokenCall is running, all new requests are intercepted and waiting for it to resolve.
 * After Promise is resolved/rejected the authentication refresh interceptor is revoked.
 * @param {AxiosInstance|Function} axios - axios instance
 * @param {Function} refreshTokenCall - refresh token call which must return a Promise
 * @param {Object} options - options for the interceptor @see defaultOptions
 * @return {AxiosInstance}
 */
function createAuthRefreshInterceptor(axios, refreshTokenCall, options = {}) {
	const id = axios.interceptors.response.use(
		res => res,
		error => {
			// patch
			// if (!refreshProcessEnable) {
			//   return Promise.reject(error);
			// }
			// Reject promise if the error status is not in options.ports or defaults.ports
			const statusCodes =
				// eslint-disable-next-line no-prototype-builtins
				options.hasOwnProperty('statusCodes') && options.statusCodes.length
					? options.statusCodes
					: defaults.statusCodes;
			if (!error.response || (error.response.status && statusCodes.indexOf(+error.response.status) === -1)) {
				return Promise.reject(error);
			}

			// patch
			// refreshProcessEnable = false;

			// Remove the interceptor to prevent a loop
			// in case token refresh also causes the 401
			axios.interceptors.response.eject(id);

			const refreshCall = refreshTokenCall(error);

			// Create interceptor that will bind all the others requests
			// until refreshTokenCall is resolved
			const requestQueueInterceptorId = axios.interceptors.request.use(request =>
				refreshCall.then(() => request)
			);

			// When response code is 401 (Unauthorized), try to refresh the token.
			return refreshCall
				.then(() => {
					axios.interceptors.request.eject(requestQueueInterceptorId);
					return axios(error.response.config);
				})
				.catch(err => {
					axios.interceptors.request.eject(requestQueueInterceptorId);
					return Promise.reject(err);
				})
				.finally(() => {
					createAuthRefreshInterceptor(axios, refreshTokenCall, options);
					// patch refreshProcessEnable = true;
				});
		}
	);
	return axios;
}
export default createAuthRefreshInterceptor;
