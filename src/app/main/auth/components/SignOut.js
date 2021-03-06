import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { actions as otpAction } from '../store/otpSlice';

import { logoutUser } from '../../../auth/store/userSlice';

const SignOut = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.search === '?expired') {
			dispatch(otpAction.sendOtpType('Login'));
			dispatch(logoutUser('/sendotp'));
		} else {
			dispatch(logoutUser());
		}
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div className="w-full" />;
};

export default SignOut;
