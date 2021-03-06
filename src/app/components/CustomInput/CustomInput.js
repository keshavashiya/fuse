import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
	Tooltip
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DateFnsUtils from '@date-io/date-fns';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(theme => ({
	formControl: {
		width: '100%',
		marginTop: 8,
		marginBottom: 4,
		background: theme.palette.background.paper
	},
	textField: {
		fontSize: '1.4rem',
		backgroundColor: theme.palette.background.paper
	},
	inputField: {
		fontSize: '1.4rem'
	},
	selectInput: {
		fontSize: '1.4rem'
	},
	menuLabel: {
		fontSize: '1.4rem'
	},
	checkIcon: {
		fontSize: 16
	},
	errorMessage: {
		color: 'red'
	},
	placeholder: {
		color: 'inherit'
	},
	placeholderError: {
		color: 'red'
	}
}));

function CustomInput(props) {
	const classes = useStyles();
	const {
		// eslint-disable-next-line react/prop-types
		labelWidth,
		// eslint-disable-next-line react/prop-types
		id,
		// eslint-disable-next-line react/prop-types
		label,
		// eslint-disable-next-line react/prop-types
		value,
		// eslint-disable-next-line react/prop-types
		isRequired = false,
		// eslint-disable-next-line react/prop-types
		itemType,
		// options = [],
		// eslint-disable-next-line react/prop-types
		multiple = false,
		// eslint-disable-next-line react/prop-types
		isEditable = true,
		// eslint-disable-next-line react/prop-types
		rows = 1,
		// eslint-disable-next-line react/prop-types
		onHandleChange,
		// eslint-disable-next-line react/prop-types
		type,
		// eslint-disable-next-line react/prop-types
		options,
		// eslint-disable-next-line react/prop-types
		onHandleDropdownChange,
		// eslint-disable-next-line react/prop-types
		parentItemType,
		// eslint-disable-next-line react/prop-types
		onHandleGroupFieldsChange = () => null,
		// eslint-disable-next-line react/prop-types
		parentItemId,
		// eslint-disable-next-line react/prop-types
		autoCompleteOptions = [],
		// eslint-disable-next-line react/prop-types
		onHandleFormCheckboxChange,
		// eslint-disable-next-line react/prop-types
		onHandleDateChange,
		// eslint-disable-next-line react/prop-types
		error,
		// eslint-disable-next-line react/prop-types
		helperText,
		// eslint-disable-next-line react/prop-types
		inputValue,
		// eslint-disable-next-line react/prop-types
		onHandleAutoCompleteChange,
		// eslint-disable-next-line react/prop-types
		onHandleAutocompleteInputChange,
		// eslint-disable-next-line react/prop-types
		disabled,
		// eslint-disable-next-line react/prop-types
		inputRef,
		// eslint-disable-next-line react/prop-types
		onAutoCompleteFocus = () => null,
		// eslint-disable-next-line react/prop-types
		addNew
	} = props;

	const [showPassword, setShowPassword] = useState(false);

	const getItemType = fieldType => {
		if (fieldType === 'password') {
			return showPassword ? 'text' : 'password';
		}
		return fieldType;
	};

	const filter = createFilterOptions();
	// const filterOptions = createFilterOptions({
	// 	matchFrom: 'any',
	// 	stringify: option => option.label
	// });

	const togglePasswordVisibility = () => {
		setShowPassword(prevVal => !prevVal);
	};

	const handleMouseDownPassword = e => {
		e.preventDefault();
	};

	const onChangeHandler = property => event => {
		onHandleChange(event, property);
	};

	const onDropdownChangeHandler = property => event => {
		onHandleDropdownChange(event, property);
	};

	const onHandleGroupFieldsChangeHandler = property => event => {
		onHandleGroupFieldsChange(event, property);
	};

	const onCheckboxChangeHandler = fieldId => event => {
		onHandleFormCheckboxChange(event, fieldId);
	};

	// eslint-disable-next-line no-shadow
	const onAutoCompleteFocusChange = (event, id) => {
		onAutoCompleteFocus(event, id);
	};

	// eslint-disable-next-line consistent-return
	const hanldeAcOnKeyDown = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
			return false;
		}
	};

	return (
		<>
			{itemType !== 'checkbox' &&
				itemType !== 'date' &&
				itemType !== 'autocomplete' &&
				itemType !== 'select' &&
				itemType !== 'radio' &&
				itemType !== 'switch' &&
				itemType !== 'label' &&
				itemType !== 'disableInput' &&
				itemType !== 'disableRadio' &&
				itemType !== 'selectOnType' && (
					<FormControl
						className={classes.formControl}
						error={error}
						variant="outlined"
						disabled={disabled}
						fullWidth
						margin="dense">
						<InputLabel htmlFor={id} className={classes.textField}>
							{label}
						</InputLabel>
						<OutlinedInput
							inputRef={inputRef}
							className={classes.inputField}
							labelWidth={labelWidth}
							id={id}
							name={id}
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...(multiple ? { multiline: true, rows } : {})}
							required={isRequired}
							onChange={
								parentItemType !== 'group'
									? onChangeHandler(type)
									: onHandleGroupFieldsChangeHandler({ type, parentId: parentItemId })
							}
							type={getItemType(itemType) || 'text'}
							value={value || ''}
							autoComplete="off"
							readOnly={!isEditable}
							aria-describedby={`${id}-error-text`}
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...(itemType === 'password'
								? {
										endAdornment: (
											<InputAdornment position="end">
												<Tooltip
													title={showPassword ? 'Hide Password' : 'Show Password'}
													placement="bottom"
													enterDelay={200}
													disableFocusListener
													size="small">
													<IconButton
														aria-label="toggle passowrd visibility"
														onClick={togglePasswordVisibility}
														onMouseDown={handleMouseDownPassword}
														edge="end">
														{showPassword ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</Tooltip>
											</InputAdornment>
										)
								  }
								: {})}
						/>
						{error && helperText && (
							<FormHelperText className={classes.errorMessage} id={`${id}-error-text`}>
								{helperText}
							</FormHelperText>
						)}
					</FormControl>
				)}
			{itemType === 'select' && (
				<FormControl
					variant="outlined"
					className={classes.formControl}
					disabled={disabled}
					fullWidth
					margin="dense">
					<InputLabel htmlFor={id} className={classes.textField}>
						{label}
					</InputLabel>
					<Select
						className={classes.selectInput}
						value={value || ''}
						onChange={onDropdownChangeHandler({ type, id })}
						input={<OutlinedInput labelWidth={labelWidth} name={id} id={id} />}>
						{options &&
							// eslint-disable-next-line react/prop-types
							options.map(item => (
								<MenuItem value={item.value} key={item.value}>
									<span className={classes.menuLabel}>{item.label}</span>
								</MenuItem>
							))}
						{/* eslint-disable-next-line react/prop-types */}
						{(!options || options.length < 1) && (
							<MenuItem value="none">
								<span className={classes.menuLabel}>None</span>
							</MenuItem>
						)}
					</Select>
				</FormControl>
			)}
			{itemType === 'checkbox' && (
				<FormControlLabel
					disabled={disabled}
					control={
						<Checkbox
							checkedIcon={<CheckBoxIcon className={classes.checkIcon} />}
							icon={<CheckBoxOutlineBlankIcon className={classes.checkIcon} />}
							indeterminateIcon={<IndeterminateCheckBoxIcon className={classes.checkIcon} />}
							checked={value || false}
							onChange={onCheckboxChangeHandler(id)}
							color="secondary"
						/>
					}
					label={label}
				/>
			)}
			{itemType === 'autocomplete' && (
				// <Autocomplete
				// 	disabled={disabled}
				// 	getOptionSelected={(option, val) => option.label === val.label}
				// 	getOptionLabel={option => option.label}
				// 	options={autoCompleteOptions}
				// 	onChange={(event, newValue) => {
				// 		onHandleAutoCompleteChange(event, newValue, id);
				// 	}}
				// 	value={value || null}
				// 	filterOptions={filterOptions}
				// 	autoHighlight
				// 	openOnFocus
				// 	renderInput={params => (
				// 		<TextField
				// 			// eslint-disable-next-line react/jsx-props-no-spreading
				// 			{...params}
				// 			autoComplete="off"
				// 			value={inputValue}
				// 			error={error}
				// 			helperText={helperText}
				// 			label={label}
				// 			variant="outlined"
				// 			onKeyDown={e => hanldeAcOnKeyDown(e)}
				// 			onChange={e => onHandleAutocompleteInputChange(e, id)}
				// 			margin="dense"
				// 		/>
				// 	)}
				// />
				<Autocomplete
					disabled={disabled}
					value={value || null}
					onChange={(event, newValue) => {
						onHandleAutoCompleteChange(event, newValue, id);
					}}
					// eslint-disable-next-line no-shadow
					filterOptions={(options, params) => {
						const filtered = filter(options, params);

						// Suggest the creation of a new value
						if (params.inputValue !== '') {
							if (addNew) {
								const result = filtered.map(a => a.label);
								const found = result.includes(params.inputValue);
								if (!found) {
									filtered.push({
										inputValue: params.inputValue,
										label: `Add "${params.inputValue}"`
									});
								}
							} else {
								filtered.push({
									inputValue: null,
									label: `Not found`
								});
							}
						}

						return filtered;
					}}
					// filterOptions={filterOptions}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					freeSolo
					forcePopupIcon
					options={autoCompleteOptions}
					getOptionLabel={option => {
						// Value selected with enter, right from the input
						if (typeof option === 'string') {
							return option;
						}
						// Add "xxx" option created dynamically
						if (option.inputValue) {
							return option.inputValue;
						}
						// Regular option
						return option.label;
					}}
					renderOption={option => option.label}
					getOptionSelected={(option, val) => option.label === val.label}
					autoHighlight
					openOnFocus
					renderInput={params => (
						<TextField
							// eslint-disable-next-line
							{...params}
							autoComplete="off"
							value={inputValue}
							label={label}
							variant="outlined"
							margin="dense"
							onKeyDown={e => hanldeAcOnKeyDown(e)}
							onChange={e => onHandleAutocompleteInputChange(e, id)}
							error={error}
							helperText={helperText}
							// InputProps={{
							// 	...params.InputProps,
							// 	// endAdornment: (
							// 	// 	<>
							// 	// 		{cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
							// 	// 		{params.InputProps.endAdornment}
							// 	// 	</>
							// 	// )
							// }}
							onFocus={e => {
								onAutoCompleteFocusChange(e, id);
							}}
						/>
						//		<TextField
						// 			// eslint-disable-next-line react/jsx-props-no-spreading
						// 			{...params}
						// 			autoComplete="off"
						// 			value={inputValue}
						// 			error={error}
						// 			helperText={helperText}
						// 			label={label}
						// 			variant="outlined"
						// 			onKeyDown={e => hanldeAcOnKeyDown(e)}
						// 			onChange={e => onHandleAutocompleteInputChange(e, id)}
						// 			margin="dense"
						// 		/>
					)}
				/>
			)}
			{itemType === 'date' && (
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<KeyboardDatePicker
						disabled={disabled}
						autoOk
						disableToolbar
						helperText=""
						error={false}
						variant="inline"
						margin="dense"
						inputVariant="outlined"
						format="dd/MM/yyyy"
						id={id}
						label={label}
						value={value}
						onChange={onHandleDateChange(id)}
						KeyboardButtonProps={{
							'aria-label': 'change date'
						}}
					/>
				</MuiPickersUtilsProvider>
			)}
		</>
	);
}

CustomInput.propTypes = {
	// eslint-disable-next-line react/require-default-props
	classes: PropTypes.instanceOf(Object),
	addNew: PropTypes.bool
};

CustomInput.defaultProps = {
	addNew: true
};

export default CustomInput;
