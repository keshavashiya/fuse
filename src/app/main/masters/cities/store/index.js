import { combineReducers } from '@reduxjs/toolkit';
import { reducer as city } from './slice';

const cityReducers = combineReducers({
	city
});

export default cityReducers;
