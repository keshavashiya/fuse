import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './signInSlice';

import request from '../../../services/request';

/** * APIs */
export const SIGNIN_URL = '/api/auth/v1/sleepguard/login';

function signInApi(data) {
	return request({ url: SIGNIN_URL, method: 'POST', data });
}

/** SAGA */

function* signIn(data) {
	try {
		const { payload } = data;

		const res = yield call(signInApi, payload);

		if (res.data) {
			yield put(actions.signInSuccess(res.data));
		} else {
			yield put(actions.signInError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.signInError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.signIn.type, signIn);
}
