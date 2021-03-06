import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './resetPasswordSlice';

import request from '../../../../services/request';

/** * APIs */
const API_PATH = 'resetpassword';
// const MODULE_ID = 'idUser';

const RESET_PASSWORD_URL = `/api/v1/${API_PATH}`;

function resetPasswordApi(data) {
	return request({ url: `${RESET_PASSWORD_URL}`, method: 'POST', data });
}

/** SAGA */

function* resetPassword(data) {
	try {
		const { payload } = data;

		const res = yield call(resetPasswordApi, payload);

		if (res.data) {
			yield put(actions.resetPasswordSuccess(res.data));
		} else {
			yield put(actions.resetPasswordError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.resetPasswordError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.resetPassword.type, resetPassword);
}
