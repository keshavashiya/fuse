import { combineReducers } from '@reduxjs/toolkit';
import { reducer as role } from './slice';

const roleReducers = combineReducers({
	role
});

export default roleReducers;
