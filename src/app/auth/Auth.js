/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import authService from '../services/authService';
import FuseSplashScreen from '../../@fuse/core/FuseSplashScreen';
import { hideMessage, showMessage } from '../store/fuse/messageSlice';

import { setUserDataFirebase, setUserDataAuth0, setUserData, logoutUser } from './store/userSlice';
// Get AuthRoles from localstorage and set as a state
import { setAuthRoles } from './store/authRoleSlice';

class Auth extends Component {
	state = {
		waitAuthCheck: true
	};

	componentDidMount() {
		return Promise.all([this.authCheck()]).then(() => {
			this.setState({ waitAuthCheck: false });
		});
	}

	authCheck = () =>
		new Promise(resolve => {
			authService.on('onAutoLogin', () => {
				/**
				 * Sign in and retrieve user data from Api
				 */
				authService
					.signInWithToken()
					.then(user => {
						this.props.setUserData(user);
						this.props.setAuthRoles();

						resolve();
					})
					.catch(error => {
						this.props.showMessage({ message: error.message });

						resolve();
					});
			});

			authService.on('onAutoLogout', message => {
				if (message) {
					this.props.showMessage({ message });
				}

				this.props.logout();

				resolve();
			});

			authService.on('onNoAccessToken', () => {
				resolve();
			});

			authService.init();

			return Promise.resolve();
		});

	render() {
		return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: logoutUser,
			setUserData,
			setUserDataAuth0,
			setUserDataFirebase,
			showMessage,
			hideMessage,
			setAuthRoles
		},
		dispatch
	);
}

export default connect(null, mapDispatchToProps)(Auth);
