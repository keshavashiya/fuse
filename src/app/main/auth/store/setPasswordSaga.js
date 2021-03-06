import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './setPasswordSlice';

import request from '../../../services/request';

/** * APIs */

const SET_PASSWORD_URL = '/api/auth/v1/sleepguard/setpassword';

function setPasswordApi(data) {
	return request({ url: SET_PASSWORD_URL, method: 'POST', data });
}

/** SAGA */

function* setPassword(data) {
	try {
		const { payload } = data;

		const res = yield call(setPasswordApi, payload);

		if (res.data) {
			yield put(actions.setPasswordSuccess(res.data));
		} else {
			yield put(actions.setPasswordError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.setPasswordError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.setPassword.type, setPassword);
}
