import { combineReducers } from '@reduxjs/toolkit';
import { reducer as country } from './slice';

const countryReducers = combineReducers({
	country
});

export default countryReducers;
