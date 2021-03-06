import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

function Clock() {
	const [time, setTime] = useState(moment());
	const intervalRef = useRef();

	function update() {
		setTime(moment());
	}

	useEffect(() => {
		intervalRef.current = setInterval(update, 1000);
		return () => {
			clearInterval(intervalRef.current);
		};
	});

	return (
		<Paper className="w-full rounded-8 shadow-1">
			<div className="flex items-center justify-between px-4 pt-4">
				<Typography className="text-16 px-12">{time.format('dddd, HH:mm:ss')}</Typography>
				<IconButton aria-label="more">
					<Icon>more_vert</Icon>
				</IconButton>
			</div>
			<div className="text-center px-24 py-32">
				<Typography className="text-24 leading-tight" color="textSecondary">
					{time.format('MMMM')}
				</Typography>
				<Typography className="text-72 leading-tight" color="textSecondary">
					{time.format('D')}
				</Typography>
				<Typography className="text-24 leading-tight" color="textSecondary">
					{time.format('Y')}
				</Typography>
			</div>
		</Paper>
	);
}

export default React.memo(Clock);

// import React, { useState, useEffect } from 'react';
// import { Card, Typography, Divider } from '@material-ui/core';
// import moment from 'moment';

// import FuseAnimate from '../../../../@fuse/core/FuseAnimate';

// function Clock() {
// 	const [date, setDate] = useState(new Date());

// 	useEffect(() => {
// 		const timer = setInterval(() => setDate(new Date()), 1000);
// 		return () => {
// 			clearInterval(timer);
// 		};
// 	}, []);

// 	return (
// 		<Card className="w-full rounded-8 shadow-1">
// 			<div className="p-16 px-4 flex flex-row items-center justify-between">
// 				<Typography className="h1 px-12">Clock</Typography>
// 			</div>
// 			<Divider className="card-divider w-full" />

// 			<table className="simple clickable">
// 				{/* <thead>
// 					<tr>
// 						<th />
// 					</tr>
// 				</thead> */}
// 				<tbody>
// 					<tr>
// 						<td>
// 							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
// 								<Typography container="true">{moment(date).format('dddd, Do MMM yyyy')}</Typography>
// 							</FuseAnimate>
// 						</td>
// 					</tr>
// 					<tr>
// 						<td>
// 							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
// 								<Typography container="true">{moment(date).format('HH:mm:ss A')}</Typography>
// 							</FuseAnimate>
// 						</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 		</Card>
// 	);
// }

// export default Clock;
