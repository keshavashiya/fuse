import { combineReducers } from '@reduxjs/toolkit';
import { reducer as setting } from './slice';

const settingReducers = combineReducers({
	setting
});

export default settingReducers;
