import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './authRoleSlice';

import request from '../../../services/request';

/** * APIs */
export const GET_AUTHROLE_URL = '/api/auth/v1/authroles';

function getAuthRoleApi() {
	return request({ url: GET_AUTHROLE_URL, method: 'GET' });
}

/** SAGA */

function* getAuthRole() {
	try {
		const res = yield call(getAuthRoleApi);

		if (res.data) {
			yield put(actions.authRoleSuccess(res.data));
		} else {
			yield put(actions.authRoleError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.authRoleError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.authRole.type, getAuthRole);
}
