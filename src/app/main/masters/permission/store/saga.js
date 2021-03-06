import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './slice';

import request from '../../../../services/request';

/** * APIs */
const API_PATH = 'permissions';
const MODULE_ID = 'idPermissions';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_WEF_URL = `/api/v1/${API_PATH}`;
const GET_DISTINCT_URL = `/api/v1/permissionsdistinct`;

// const GET_PLCOMPANY_URL = `/api/v1/pricelistcompanies`;
// const ADD_PLCOMPANY_URL = `/api/v1/pricelistcompanies`;

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

function addApi(data) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}

function editApi(data) {
	return request({ url: `${EDIT_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

function deleteApi(data) {
	return request({ url: `${DELETE_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
}

function getOneApi(data) {
	return request({ url: `${GET_ONE_URL}/${data[MODULE_ID]}`, method: 'GET' });
}

// function addCompanyApi(data) {
// 	return request({ url: `${ADD_PLCOMPANY_URL}`, method: 'POST', data });
// }

// function getCompanyApi(data) {
// 	return request({ url: `${GET_PLCOMPANY_URL}/${data.idPriceList}`, method: 'GET' });
// }

function getWefApi(data) {
	const { idPriceList, WefDate } = data;
	return request({ url: `${GET_WEF_URL}/${idPriceList}/${WefDate}`, method: 'GET' });
}

function getDistinctApi() {
	return request({
		url: `${GET_DISTINCT_URL}`,
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

function* getOne(data) {
	try {
		const { payload } = data;

		const res = yield call(getOneApi, payload);

		if (res.data) {
			yield put(actions.getOneSuccess(res.data));
		} else {
			yield put(actions.getOneError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.getOneError({
					error: error.data
				})
			);
		}
	}
}

function* getDistinct() {
	try {
		const res = yield call(getDistinctApi);

		if (res.data) {
			yield put(actions.getDistinctSuccess(res.data));
		} else {
			yield put(actions.getDistinctError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.getDistinctError({
					error: error.data
				})
			);
		}
	}
}

// function* getCompany(data) {
// 	try {
// 		const { payload } = data;

// 		const res = yield call(getCompanyApi, payload);

// 		if (res.data) {
// 			yield put(actions.getCompanySuccess(res.data));
// 		} else {
// 			yield put(actions.getCompanyError(res.data));
// 		}
// 	} catch (error) {
// 		if (error.data) {
// 			yield put(
// 				actions.getCompanyError({
// 					error: error.data
// 				})
// 			);
// 		}
// 	}
// }

// function* addCompany(data) {
// 	try {
// 		const { payload } = data;

// 		const res = yield call(addCompanyApi, payload);

// 		if (res.data) {
// 			yield put(actions.addCompanySuccess(res.data));
// 		} else {
// 			yield put(actions.addCompanyError(res.data));
// 		}
// 	} catch (error) {
// 		if (error.data) {
// 			yield put(
// 				actions.addCompanyError({
// 					error: error.data
// 				})
// 			);
// 		}
// 	}
// }

function* getWef(data) {
	try {
		const { payload } = data;

		const res = yield call(getWefApi, payload);

		if (res.data) {
			yield put(actions.getWefSuccess(res.data));
		} else {
			yield put(actions.getWefError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.getWefError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.get.type, get);
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);

	// yield takeLatest(actions.getCompany.type, getCompany);
	// yield takeLatest(actions.addCompany.type, addCompany);

	yield takeLatest(actions.getWef.type, getWef);
	yield takeLatest(actions.getDistinct.type, getDistinct);
}
