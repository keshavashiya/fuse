import { combineReducers } from '@reduxjs/toolkit';
import { reducer as state } from './slice';

const stateReducers = combineReducers({
	state
});

export default stateReducers;
