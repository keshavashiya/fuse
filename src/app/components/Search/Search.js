import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Paper, Input, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import FuseAnimate from '../../../@fuse/core/FuseAnimate';

import useThrottle from '../../hooks/useThrottle';

const useStyles = makeStyles(theme => ({
	paper: {
		backgroundColor: theme.palette.primary[150],
		color: theme.palette.primary[250],
		border: '1px solid #a9a9a9'
	},
	input: {
		color: theme.palette.primary[250]
	}
}));

const Search = props => {
	const classes = useStyles();
	const { passProps, queryParams, type } = props;

	const InitialSearch = {
		q: ''
	};

	const [search, setSearch] = useState(InitialSearch);

	const [inputSearch, setInputSearch] = React.useState('');
	const throttledSearch = useThrottle(inputSearch, 400);

	useEffect(() => {
		const searchObj = { ...search, ...queryParams };

		Object.keys(searchObj).forEach(key => searchObj[key] === '' && delete searchObj[key]);

		passProps(searchObj);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search.q]);

	const handleSearchChange = event => {
		event.persist();
		setInputSearch(event.target.value);
	};

	useEffect(() => {
		setSearch(frmState => ({
			...frmState,
			q: throttledSearch.trim()
		}));

		return () => {};
	}, [throttledSearch]);

	return (
		<div
			className={
				['Dealer', 'Distributor', 'Customer'].includes(type)
					? 'flex flex-1 items-center'
					: 'flex flex-1 items-center justify-center px-8 sm:px-12'
			}>
			<FuseAnimate animation="transition.slideLeftIn" delay={300}>
				<Paper
					className="flex p-4 items-center w-full max-w-512 h-32 px-8 py-4 rounded-8"
					elevation={0}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...(['Dealer', 'Distributor', 'Customer'].includes(type)
						? { classes: { root: classes.paper } }
						: {})}>
					<Icon color="inherit">search</Icon>

					<Input
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...(['Dealer', 'Distributor', 'Customer'].includes(type)
							? { classes: { root: classes.input } }
							: {})}
						name="input_search_text"
						placeholder="Search"
						className="flex flex-1 px-16"
						disableUnderline
						fullWidth
						value={inputSearch || ''}
						inputProps={{
							'aria-label': 'Search',
							autoComplete: 'off'
						}}
						onChange={e => handleSearchChange(e)}
					/>
				</Paper>
			</FuseAnimate>
		</div>
	);
};

Search.propTypes = {
	passProps: PropTypes.func,
	queryParams: PropTypes.instanceOf(Object),
	type: PropTypes.string,
	hasParent: PropTypes.bool
};

Search.defaultProps = {
	passProps: null,
	queryParams: null,
	type: '',
	hasParent: undefined
};

export default Search;
