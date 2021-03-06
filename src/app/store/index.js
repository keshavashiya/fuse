import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';

import reduxLogger from 'redux-logger';

import { persistStore } from 'redux-persist';

import createSagaMiddleware from 'redux-saga';
import createReducer from './rootReducer';

const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
const { run: runSaga } = sagaMiddleware;

const middlewares =
	process.env.NODE_ENV === 'production'
		? [thunk, sagaMiddleware, routeMiddleware]
		: [reduxLogger, thunk, sagaMiddleware, routeMiddleware];

const enhancers = [
	createInjectorsEnhancer({
		createReducer,
		runSaga
	})
];

const store = configureStore({
	reducer: createReducer(),
	middleware: [
		...getDefaultMiddleware({
			serializableCheck: false
			// serializableCheck: {
			// 	// Ignore these action types
			// 	ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			// }
		}),
		...middlewares
	],
	preloadedState: {},
	devTools: process.env.NODE_ENV !== 'production',
	enhancers
});

store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
	if (store.asyncReducers[key]) {
		return false;
	}

	store.asyncReducers[key] = reducer;
	store.replaceReducer(createReducer(store.asyncReducers));
	return store;
};

export const persistor = persistStore(store);

// Make reducers hot reloadable, see http://mxs.is/googmo
/* istanbul ignore next */
// if (module.hot) {
// 	module.hot.accept('./reducers', () => {
// 		forceReducerReload(store);
// 	});
// }

export default store;
