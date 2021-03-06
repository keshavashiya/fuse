/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import { Grid, Paper, Typography } from '@material-ui/core';

import CheckboxItem from './CheckboxItem/CheckboxItem';
// import "./CheckboxGroup.scss";

const CheckboxGroup = props => {
	const [parentCheckboxChecked, setParentCheckboxChecked] = useState(false);

	const { id } = props;

	const handleParentCheckboxChange = isChecked => {
		const { checkboxes, onCheckboxGroupChange } = props;
		const newCheckState = checkboxes.map(aCheckbox => ({
			...aCheckbox,
			checked: isChecked
		}));

		// onCheckboxGroupChange(newCheckState);
		onCheckboxGroupChange(newCheckState, props);
	};

	// eslint-disable-next-line no-shadow
	const updateParentWithChildren = props => {
		const { checkboxes } = props;
		let allChecked = false;
		for (let i = 0; i < checkboxes.length; i += 1) {
			if (checkboxes[i].checked) {
				allChecked = true;
			} else {
				allChecked = false;
				break;
			}
		}
		setParentCheckboxChecked(allChecked);
	};

	useEffect(() => {
		updateParentWithChildren(props);
		return () => {
			// console.log("Goodbye!!");
		};
	}, [props]);

	const handleChildCheckboxChange = (isChecked, index) => {
		const { checkboxes } = props;

		const { onCheckboxGroupChange } = props;
		const newCheckState = checkboxes.map((aCheckbox, i) =>
			index === i ? { ...aCheckbox, checked: isChecked } : aCheckbox
		);
		onCheckboxGroupChange(newCheckState, props);
	};

	const renderCheckboxes = () => {
		const { checkboxes } = props;
		if (!checkboxes) {
			return null;
		}
		return checkboxes.map((aCheckbox, index) => (
			<CheckboxItem
				// eslint-disable-next-line react/no-array-index-key
				key={index}
				// checkboxLabel={aCheckbox.label}
				checkboxValue={aCheckbox.value}
				checked={aCheckbox.checked}
				disabled={aCheckbox.disabled}
				checkboxChangeCallback={checkStatus => handleChildCheckboxChange(checkStatus, index)}
			/>
		));
	};

	return (
		// <div className="checkbox-wrapper">
		<Grid item xs={12}>
			<FormGroup row>
				<Grid item container direction="column" sm={4}>
					<Grid item>
						<Paper variant="outlined" square elevation={0} style={{ height: '5vh' }}>
							<Typography style={{ margin: 10 }}>{id}</Typography>
						</Paper>
					</Grid>
				</Grid>
				<CheckboxItem
					style={{ margin: 0 }}
					//	checkboxLabel="All"
					checkboxValue="all"
					checked={parentCheckboxChecked}
					checkboxChangeCallback={handleParentCheckboxChange}
				/>
				{renderCheckboxes()}

				{/* <div className="checkbox-children">{renderCheckboxes()}</div> */}
			</FormGroup>
		</Grid>
		// </div>
	);
};

export default CheckboxGroup;
