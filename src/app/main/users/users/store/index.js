import { combineReducers } from '@reduxjs/toolkit';
import { reducer as user } from './slice';
import { reducer as resetpassword } from './resetPasswordSlice';

const userReducers = combineReducers({
	user,
	resetpassword
});

export default userReducers;
