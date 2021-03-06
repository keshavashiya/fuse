import { combineReducers } from '@reduxjs/toolkit';
import { reducer as session } from './slice';

const sessionReducers = combineReducers({
	session
});

export default sessionReducers;
