/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useEffect, useRef } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import CustomTableCell from './CustomTableCell';
import PaginationActions from './PaginationActions';

const useStyles = makeStyles(() => ({
	rowHeight: {
		height: '40px!important',
		padding: '5px!important'
	}
}));

// eslint-disable-next-line react/prop-types
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
	const defaultRef = useRef();
	const resolvedRef = ref || defaultRef;

	useEffect(() => {
		resolvedRef.current.indeterminate = indeterminate;
	}, [resolvedRef, indeterminate]);

	return (
		<>
			<Checkbox ref={resolvedRef} {...rest} />
		</>
	);
});

const EnhancedTable = ({ columns, data, fetchData, onRowClick, pageCount: controlledPageCount }) => {
	const classes = useStyles();

	const {
		getTableProps,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		setPageSize,
		// getTableBodyProps,
		// canPreviousPage,
		// canNextPage,
		// pageOptions,
		pageCount,
		// nextPage,
		// previousPage,
		state: { pageIndex, pageSize }
	} = useTable(
		{
			columns,
			data,
			// autoResetPage: true
			initialState: { pageIndex: 0 }, // Pass our hoisted table state
			manualPagination: true, // Tell the usePagination
			// hook that we'll handle our own data fetching
			// This means we'll also have to provide our own
			// pageCount.
			pageCount: controlledPageCount,
			autoResetSortBy: false,
			autoResetPage: false
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect,
		hooks => {
			hooks.allColumns.push(_columns => [
				// Let's make a column for selection
				{
					id: 'selection',
					sortable: false,
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox.  Pagination is a problem since this will select all
					// rows even though not all rows are on the current page.  The solution should
					// be server side pagination.  For one, the clients should not download all
					// rows in most cases.  The client should only download data for the current page.
					// In that case, getToggleAllRowsSelectedProps works fine.
					// eslint-disable-next-line react/prop-types
					Header: ({ getToggleAllRowsSelectedProps }) => (
						<div>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</div>
					),
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
					// eslint-disable-next-line react/prop-types
					Cell: ({ row }) => (
						<div>
							<IndeterminateCheckbox
								// eslint-disable-next-line react/prop-types
								{...row.getToggleRowSelectedProps()}
								onClick={ev => ev.stopPropagation()}
							/>
						</div>
					)
				},
				..._columns
			]);
		}
	);

	// Listen for changes in pagination and use the state to fetch our new data
	React.useEffect(() => {
		fetchData({ pageIndex, pageSize });
	}, [fetchData, pageIndex, pageSize]);

	const handleChangePage = (event, newPage) => {
		gotoPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setPageSize(Number(event.target.value));
	};

	// Render the UI for your table
	return (
		<div className="flex flex-col min-h-full sm:border-1 sm:rounded-16 overflow-hidden">
			<TableContainer className="flex flex-1">
				<Table {...getTableProps()} stickyHeader style={{ width: '100%' }}>
					<TableHead>
						{headerGroups.map(headerGroup => (
							<TableRow {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => {
									return (
										<TableCell
											style={{ width: column.width }}
											// className="whitespace-no-wrap p-12"
											className={clsx('whitespace-no-wrap p-12', classes.rowHeight)}
											{...(!column.sortable
												? column.getHeaderProps()
												: column.getHeaderProps(column.getSortByToggleProps()))}>
											{column.render('Header')}
											{column.sortable ? (
												<TableSortLabel
													active={column.isSorted}
													// react-table has a unsorted state which is not treated here
													direction={column.isSortedDesc ? 'desc' : 'asc'}
												/>
											) : null}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{page.map(row => {
							// , i
							prepareRow(row);
							return (
								<CustomTableCell
									key={row.id}
									row={row}
									onRowClick={onRowClick}
									className="truncate cursor-pointer"
								/>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				classes={{
					root: 'overflow-hidden flex-shrink-0 border-0',
					spacer: 'w-0 max-w-0'
				}}
				rowsPerPageOptions={[10, 20, 30, 40, 50, { label: 'All', value: pageCount + 1 }]}
				colSpan={5}
				count={pageCount}
				rowsPerPage={pageSize}
				page={pageIndex}
				SelectProps={{
					inputProps: { 'aria-label': 'rows per page' },
					native: false
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				ActionsComponent={PaginationActions}
			/>
		</div>
	);
};

EnhancedTable.propTypes = {
	columns: PropTypes.instanceOf(Array).isRequired,
	data: PropTypes.instanceOf(Array).isRequired,
	fetchData: PropTypes.instanceOf(Object).isRequired,
	onRowClick: PropTypes.func,
	pageCount: PropTypes.number.isRequired
};

EnhancedTable.defaultProps = {
	onRowClick: null
};

export default EnhancedTable;
