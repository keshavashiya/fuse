import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './slice';

import request from '../../../../services/request';

/** * APIs */
const API_PATH = 'sessions';

const SESSION_URL = `/api/v1/${API_PATH}`;
const SESSION_ACK_URL = `/api/v1/${API_PATH}/ack`;

function sessionApi(data) {
	return request({ url: `${SESSION_URL}`, method: 'POST', data });
}

function sessionAckApi(data) {
	return request({ url: `${SESSION_ACK_URL}`, method: 'POST', data });
}

/** SAGA */

function* add(data) {
	try {
		const { payload } = data;

		const res = yield call(sessionApi, payload);

		if (res.data) {
			yield put(actions.addSuccess(res.data));
		} else {
			yield put(actions.addError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.addError({
					error: error.data
				})
			);
		}
	}
}

function* addAck(data) {
	try {
		const { payload } = data;

		const res = yield call(sessionAckApi, payload);

		if (res.data) {
			yield put(actions.addAckSuccess(res.data));
		} else {
			yield put(actions.addAckError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.addAckError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.addAck.type, addAck);
}
