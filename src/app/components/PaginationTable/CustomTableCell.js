/* eslint-disable no-nested-ternary */
import { TableCell, TableRow } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	rowHeight: {
		height: '40px!important',
		padding: '5px!important'
	},
	hoverRow: {
		position: 'absolute',
		backgroundColor: theme.palette.secondary.main,
		margin: '5px',
		right: 0
	},
	hideColumn: {
		display: 'none'
	}
}));

function CustomTableCell(props) {
	const classes = useStyles();

	const { row, onRowClick, className } = props;
	const [hover, setHover] = useState(false);

	return (
		<TableRow
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...row.getRowProps()}
			onMouseEnter={e => {
				e.preventDefault();
				setHover(true);
			}}
			onMouseLeave={e => {
				e.preventDefault();
				setHover(false);
			}}
			onClick={ev => onRowClick(ev, row)}
			hover
			className={className}>
			{row.cells.map(cell => {
				return (
					<TableCell
						key={cell.column.id}
						className={
							cell.column.id === 'action'
								? hover
									? clsx(classes.hoverRow, classes.rowHeight)
									: clsx(classes.hideColumn, classes.rowHeight)
								: clsx(classes.rowHeight)
						}>
						{cell.render('Cell')}
					</TableCell>
				);
			})}
		</TableRow>
	);
}

CustomTableCell.propTypes = {
	row: PropTypes.instanceOf(Object).isRequired,
	onRowClick: PropTypes.func,
	className: PropTypes.string.isRequired
};

CustomTableCell.defaultProps = {
	onRowClick: null
};

export default CustomTableCell;

// import { TableCell, TableRow } from '@material-ui/core';
// import PropTypes from 'prop-types';
// import React, { useState } from 'react';
// import clsx from 'clsx';

// function CustomTableCell(props) {
// 	const { row, onRowClick, className } = props;
// 	const [hover, setHover] = useState(false);

// 	const getLastColumnId = id => {
// 		if (row.cells[row.cells.length - 2].column.id === id) {
// 			return id;
// 		}
// 		return null;
// 	};

// 	const newRow = !hover
// 		? row.cells.filter(item => item.column.id !== 'action')
// 		: row.cells.filter(
// 				// eslint-disable-next-line no-unused-vars
// 				item =>
// 					![
// 						'Status',
// 						'City',
// 						'AppAccess',
// 						'AccountNumber',
// 						'PriceListOn',
// 						'ProductCategory',
// 						'Product',
// 						'State',
// 						'Country',
// 						'Conversion',
// 						'Thickness',
// 						'DOB',
// 						'Anniversary',
// 						'AppAccess',
// 						'StatusType',
// 						'SubCategory'
// 					].includes(getLastColumnId(item.column.id))
// 		  );
// 	return (
// 		<TableRow
// 			// eslint-disable-next-line react/jsx-props-no-spreading
// 			{...row.getRowProps()}
// 			onMouseEnter={e => {
// 				e.preventDefault();
// 				setHover(true);
// 			}}
// 			onMouseLeave={e => {
// 				e.preventDefault();
// 				setHover(false);
// 			}}
// 			onClick={ev => onRowClick(ev, row)}
// 			hover
// 			className={className}>
// 			{!hover &&
// 				newRow.map(cell => (
// 					// eslint-disable-next-line react/jsx-props-no-spreading
// 					<TableCell
// 						// eslint-disable-next-line react/jsx-props-no-spreading
// 						{...(cell.column.id === 'Status' ? { align: 'center' } : {})}
// 						style={{
// 							width: ['Status', 'City', 'AccountNumber', 'DOB', 'Anniversary', 'AppAccess'].includes(
// 								cell.column.id
// 							)
// 								? 145
// 								: 'auto',
// 							height: 75
// 						}}
// 						key={cell.column.id}
// 						// eslint-disable-next-line react/jsx-props-no-spreading
// 						{...cell.getCellProps()}
// 						className={clsx('p-12', cell.column.className)}>
// 						{cell.render('Cell')}
// 					</TableCell>
// 				))}
// 			{hover &&
// 				newRow.map(cell => (
// 					// eslint-disable-next-line react/jsx-props-no-spreading
// 					<TableCell
// 						// eslint-disable-next-line react/jsx-props-no-spreading
// 						{...(cell.column.id === 'Status' ? { align: 'center' } : {})}
// 						style={{ height: 75 }}
// 						// eslint-disable-next-line react/jsx-props-no-spreading
// 						{...cell.getCellProps()}
// 						key={cell.column.id}
// 						className={clsx('p-12', cell.column.className)}>
// 						{cell.render('Cell')}
// 					</TableCell>
// 				))}
// 		</TableRow>
// 	);
// }

// CustomTableCell.propTypes = {
// 	row: PropTypes.instanceOf(Object).isRequired,
// 	onRowClick: PropTypes.func,
// 	className: PropTypes.string.isRequired
// };

// CustomTableCell.defaultProps = {
// 	onRowClick: null
// };

// export default CustomTableCell;
