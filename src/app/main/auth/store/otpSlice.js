/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	Loading: false,
	Error: null,
	Success: null,

	resendError: null,
	resendSuccess: null,

	OtpType: null,
	UserNameForOtp: null
};

const otpSlice = createSlice({
	name: 'otp',
	initialState,
	reducers: {
		sendOtpType(state, action) {
			state.OtpType = action.payload;
		},
		sendOtp(state) {
			state.Loading = true;
		},
		sendOtpSuccess(state, action) {
			state.Loading = false;
			state.Error = null;
			state.Success = action.payload;
		},
		sendOtpError(state, action) {
			state.Loading = false;
			state.Error = action.payload;
			state.Success = null;
		},
		resendOtp(state) {
			state.Loading = true;
		},
		resendOtpSuccess(state, action) {
			state.Loading = false;
			state.resendError = null;
			state.resendSuccess = action.payload;
		},
		resendOtpError(state, action) {
			state.Loading = false;
			state.resendError = action.payload;
			state.resendSuccess = null;
		},
		validateOtp(state) {
			state.Loading = true;
		},
		validateOtpSuccess(state, action) {
			state.Loading = false;
			state.Error = null;
			state.Success = action.payload;
		},
		validateOtpError(state, action) {
			state.Loading = false;
			state.Error = action.payload;
			state.Success = null;
		},
		sendUserNameForOtp(state, action) {
			state.UserNameForOtp = action.payload;
		},

		pageReset(state) {
			state.Loading = false;
			state.Error = null;
			state.Success = null;

			state.resendError = null;
			state.resendSuccess = null;
		},

		resendReset(state) {
			state.Loading = false;
			state.resendError = null;
			state.resendSuccess = null;
		},

		reset(state) {
			state.Loading = false;
			state.Error = null;
			state.Success = null;

			state.resendError = null;
			state.resendSuccess = null;

			state.OtpType = null;
			state.UserNameForOtp = null;
		}
	},
	extraReducers: {}
});

export const { name, reducer, actions } = otpSlice;
// export default slice.reducer;
