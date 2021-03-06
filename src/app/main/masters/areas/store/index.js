import { combineReducers } from '@reduxjs/toolkit';
import { reducer as area } from './slice';

const areaReducers = combineReducers({
	area
});

export default areaReducers;
