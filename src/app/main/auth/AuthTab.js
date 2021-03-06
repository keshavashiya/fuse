/* eslint-disable */
import React from 'react';

import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';

import FuseAnimate from '../../../@fuse/core/FuseAnimate';

import Login from './components/Login';
import SendOtp from './components/SendOtp';
import OtpPage from './components/OtpPage';
import SetPassowrd from './components/SetPassword';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

const AuthTab = props => {
	const classes = useStyles();

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}>
			<FuseAnimate animation="transition.expandIn">
				<div className="flex w-full max-w-400 rounded-12 shadow-2xl overflow-hidden">
					<Card
						className={clsx(
							classes.leftSection,
							'flex flex-col w-full max-w-sm items-center p-24 justify-center'
						)}
						square
						elevation={0}>
						<CardContent className="flex flex-col items-center justify-center w-full max-w-320">
							<FuseAnimate delay={300}>
								<div className="flex items-center mb-32">
									<img
										className="logo-icon w-48"
										src="public/assets/images/logos/speedup.png"
										alt="logo"
									/>
								</div>
							</FuseAnimate>
							{props.location.pathname === '/login' ? (
								<Login />
							) : props.location.pathname === '/setpassword' ? (
								<SetPassowrd />
							) : props.location.pathname === '/sendotp' ? (
								<SendOtp />
							) : props.location.pathname === '/otp' ? (
								<OtpPage />
							) : (
								<Login />
							)}
						</CardContent>
					</Card>
				</div>
			</FuseAnimate>
		</div>
	);
};

export default AuthTab;
