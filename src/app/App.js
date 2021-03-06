import MomentUtils from '@date-io/moment';
import { createGenerateClassName, jssPreset, StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import React from 'react';
import Provider from 'react-redux/es/components/Provider';
import { ConfirmProvider } from 'material-ui-confirm';
import { Router } from 'react-router-dom';
import FuseTheme from '../@fuse/core/FuseTheme';
import FuseLayout from '../@fuse/core/FuseLayout';
import FuseAuthorization from '../@fuse/core/FuseAuthorization';
import AppContext from './AppContext';
import { Auth } from './auth';
import routes from './configs/routesConfig';
import store from './store';
import history from '../history';

const jss = create({
	...jssPreset(),
	plugins: [...jssPreset().plugins, jssExtend(), rtl()],
	insertionPoint: document.getElementById('jss-insertion-point')
});

const generateClassName = createGenerateClassName();

const App = () => {
	return (
		<AppContext.Provider
			value={{
				routes
			}}>
			<StylesProvider jss={jss} generateClassName={generateClassName}>
				<Provider store={store}>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<Auth>
							<Router history={history}>
								<FuseAuthorization>
									<FuseTheme>
										<ConfirmProvider
											defaultOptions={{ confirmationButtonProps: { autoFocus: true } }}>
											<FuseLayout />
										</ConfirmProvider>
									</FuseTheme>
								</FuseAuthorization>
							</Router>
						</Auth>
					</MuiPickersUtilsProvider>
				</Provider>
			</StylesProvider>
		</AppContext.Provider>
	);
};

export default App;
