import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import session from './sessionSlice';
import authroles from './authRoleSlice';

const authReducers = combineReducers({
	user,
	login,
	register,
	authroles,
	session
});

export default authReducers;
