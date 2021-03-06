import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './fetchSlice';

import request from '../../../services/request';

/** * APIs */
const API_PATH = 'notifications';
// const MODULE_ID = 'idTicket';

const GET_URL = `/api/v1/${API_PATH}`;

function getApi(data) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_URL}`,
		method: 'GET'
	});
}

/** SAGA */

function* get(data) {
	try {
		const { payload } = data;

		const res = yield call(getApi, payload);

		if (res.data) {
			yield put(actions.getSuccess(res.data));
		} else {
			yield put(actions.getError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.getError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.get.type, get);
}
