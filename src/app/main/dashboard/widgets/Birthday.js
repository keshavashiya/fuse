/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Card, Typography, Divider } from '@material-ui/core';
// import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';

function Birthday(props) {
	return (
		<Card className="rounded-8 shadow-1" style={{ width: 'max-content' }}>
			<div className="p-16 px-4 flex flex-row items-center justify-between">
				<Typography className="h1 px-12">Today's Birthday </Typography>

				{/* <div>
					<IconButton aria-label="more">
						<Icon>more_vert</Icon>
					</IconButton>
				</div> */}
			</div>
			{/* <Divider className="card-divider w-full" /> */}

			{props.data.rows.length < 1 && (
				<>
					<Divider className="card-divider w-full" />
					<div>
						<img
							style={{ maxWidth: '5.6rem', margin: 'auto', paddingBottom: '5px', paddingTop: '5px' }}
							src="public/assets/cake.png"
							alt="logo"
						/>
						{/* <div>
					<IconButton aria-label="more">
						<Icon>more_vert</Icon>
					</IconButton>
				</div> */}
					</div>
				</>
			)}

			<table className="simple clickable">
				<thead>{/* <tr>
						<th aria-label="Name" />
						<th className="text-left" />
					</tr> */}</thead>
				<tbody>
					{props.data.rows.map(row => (
						<tr key={row.Name}>
							<td>{row.Name}</td>
							<td className="text-left">{row.Day}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* <Divider className="card-divider w-full" /> */}

			{/* <div className="p-8 pt-16 flex flex-row items-center">
				<Button>GO TO CAMPAIGNS</Button>
			</div> */}
		</Card>
	);
}

export default React.memo(Birthday);
