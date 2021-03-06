import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './slice';

import request from '../../../../services/request';

/** * APIs */
const API_PATH = 'usersettings';

const EDIT_URL = `/api/v1/${API_PATH}`;

function editApi(data) {
	return request({ url: `${EDIT_URL}`, method: 'PUT', data });
}

/** SAGA */

function* edit(data) {
	try {
		const { payload } = data;

		const res = yield call(editApi, payload);

		if (res.data) {
			yield put(actions.editSuccess(res.data));
		} else {
			yield put(actions.editError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.editError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.edit.type, edit);
}
