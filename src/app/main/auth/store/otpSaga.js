import { takeLatest, put, call } from 'redux-saga/effects';
import { actions } from './otpSlice';

import request from '../../../services/request';

/** * APIs */
export const SEND_OTP_URL = '/api/auth/v1/sleepguard/sendotp';
export const RESEND_OTP_URL = '/api/auth/v1/sleepguard/resendotp';
export const VERIFY_OTP_URL = '/api/auth/v1/sleepguard/verifyotp';

function sendOtpApi(data) {
	return request({ url: `${SEND_OTP_URL}`, method: 'POST', data });
}

function resendOtpApi(data) {
	return request({ url: `${RESEND_OTP_URL}`, method: 'POST', data });
}

function validateOtpApi(data) {
	return request({ url: `${VERIFY_OTP_URL}`, method: 'POST', data });
}

/** SAGA */

function* sendOtp(data) {
	try {
		const { payload } = data;

		const res = yield call(sendOtpApi, payload);

		if (res.data) {
			yield put(actions.sendOtpSuccess(res.data));
		} else {
			yield put(actions.sendOtpError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.sendOtpError({
					error: error.data
				})
			);
		}
	}
}

function* resendOtp(data) {
	try {
		const { payload } = data;

		const res = yield call(resendOtpApi, payload);

		if (res.data) {
			yield put(actions.resendOtpSuccess(res.data));
		} else {
			yield put(actions.resendOtpError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.resendOtpError({
					error: error.data
				})
			);
		}
	}
}

function* validateOtp(data) {
	try {
		const { payload } = data;

		const res = yield call(validateOtpApi, payload);

		if (res.data) {
			yield put(actions.validateOtpSuccess(res.data));
		} else {
			yield put(actions.validateOtpError(res.data));
		}
	} catch (error) {
		if (error.data) {
			yield put(
				actions.validateOtpError({
					error: error.data
				})
			);
		}
	}
}

export default function* Saga() {
	yield takeLatest(actions.sendOtp.type, sendOtp);
	yield takeLatest(actions.resendOtp.type, resendOtp);
	yield takeLatest(actions.validateOtp.type, validateOtp);
}
