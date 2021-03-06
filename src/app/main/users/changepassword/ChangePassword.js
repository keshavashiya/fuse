import React from 'react';

import { Typography } from '@material-ui/core';

import FusePageCarded from '../../../../@fuse/core/FusePageCarded';
import FuseAnimate from '../../../../@fuse/core/FuseAnimate';

import ResetPassword from '../users/components/ResetPassword';

const ChangePassword = () => {
	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				<div className="flex flex-1 w-full items-center justify-between">
					<div className="flex flex-col items-start max-w-full">
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<div className="flex items-center">
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
										Change Password
									</Typography>
								</FuseAnimate>
							</div>
						</FuseAnimate>
					</div>
				</div>
			}
			content={
				<div className="max-w-sm ml-8">
					<ResetPassword />
				</div>
			}
			innerScroll
		/>
	);
};

export default ChangePassword;
