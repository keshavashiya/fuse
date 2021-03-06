import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './slice';

import request from '../../../services/request';

/** * APIs */
const API_PATH = 'fcm';

const ADD_URL = `/api/v1/${API_PATH}/storetoken`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const SUBSCRIBE_URL = `/api/v1/${API_PATH}/subscribe`;
const UNSUBSCRIBE_URL = `/api/v1/${API_PATH}/unsubscribe`;

function addApi(data) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}

function deleteApi(data) {
	return request({ url: `${DELETE_URL}/${data.FcmToken}`, method: 'DELETE' });
}

function subscribeTopicApi(data) {
	return request({ url: `${SUBSCRIBE_URL}`, method: 'POST', data });
}

function unSubscribeTopicApi(data) {
	return request({ url: `${UNSUBSCRIBE_URL}`, method: 'POST', data });
}

/** SAGA */

function* add(data) {
	try {
		const { payload } = data;

		const res = yield call(addApi, payload);

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

function* del(data) {
	try {
		const { payload } = data;

		const res = yield call(deleteApi, payload);

		if (res.data) {
			yield put(actions.deleteSuccess(res.data));
		} else {
			yield put(actions.deleteError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.deleteError({
					error: error.data
				})
			);
		}
	}
}

function* subscribeTopic(data) {
	try {
		const { payload } = data;

		const res = yield call(subscribeTopicApi, payload);

		if (res.data) {
			yield put(actions.subscribeTopicSuccess(res.data));
		} else {
			yield put(actions.subscribeTopicError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.subscribeTopicError({
					error: error.data
				})
			);
		}
	}
}

function* unSubscribeTopic(data) {
	try {
		const { payload } = data;

		const res = yield call(unSubscribeTopicApi, payload);

		if (res.data) {
			yield put(actions.unSubscribeTopicSuccess(res.data));
		} else {
			yield put(actions.unSubscribeTopicError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.unSubscribeTopicError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.subscribeTopic.type, subscribeTopic);
	yield takeLatest(actions.unSubscribeTopic.type, unSubscribeTopic);
}
