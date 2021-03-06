/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

// import { makeStyles } from '@material-ui/styles';
import { Button, Typography, IconButton, Avatar, Icon, Tooltip } from '@material-ui/core';
import {
	AddOutlined as AddOutlinedIcon,
	DeleteOutlined as DeleteOutlinedIcon,
	EditOutlined as EditOutlinedIcon,
	RestoreOutlined as RestoreOutlinedIcon
} from '@material-ui/icons';

import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import { useConfirm } from 'material-ui-confirm';

import saga from './store/saga';
import { name, actions } from './store/slice';
import MultiSelectMenu from './MultiSelectMenu';

import FusePageCarded from '../../../../@fuse/core/FusePageCarded';
import FuseAnimate from '../../../../@fuse/core/FuseAnimate';
import { showMessage } from '../../../store/fuse/messageSlice';

import { ObjecttoQueryString } from '../../../helpers/utils';

import { CustomDrawer, PaginationTable, Search, CustomDialog } from '../../../components';

import User from './components/User';
import ResetPassword from './components/ResetPassword';

// const useStyles = makeStyles(theme => ({
// 	content: {
// 		marginTop: theme.spacing(2)
// 	}
// }));

let filterParam = {};

const Users = () => {
	useInjectSaga({ key: name, saga });

	// const classes = useStyles();
	const confirm = useConfirm();

	const dispatch = useDispatch();
	const { Reducer, user } = useSelector(
		reducer => ({
			Reducer: reducer.user.user,
			user: reducer.auth.user
		}),
		shallowEqual
	);

	const { ParentCompany } = user.data;

	const { getSuccess, getLoading, deleteSuccess, deleteError } = Reducer;

	const initParams = {
		page: 1,
		limit: 10,
		order: 'ASC',
		pagination: 'yes'
	};

	if (user.data.UserType !== 'Aggregator') {
		initParams.ParentCompany = ParentCompany;
	}

	const [data, setData] = useState([]);
	const [initialized, setInitialized] = useState(true);
	const [openAddDrawer, setOpenAddDrawer] = useState(false);
	const [openEditDrawer, setOpenEditDrawer] = useState(false);
	const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
	const [selectedData, setSelectedData] = useState('');
	const [loading, setLoading] = useState(true);
	const [pageCount, setPageCount] = useState(0);

	const fetchIdRef = React.useRef(0);

	const getData = async obj => {
		const queryParams = { ...initParams, ...obj };
		const queryStirng = ObjecttoQueryString(queryParams);

		dispatch(actions.get({ QueryParams: queryStirng }));
	};

	const fetchData = useCallback(({ pageSize, pageIndex }) => {
		// eslint-disable-next-line no-plusplus
		const fetchId = ++fetchIdRef.current;

		setLoading(true);

		// Only update the data if this is the latest fetch
		if (fetchId === fetchIdRef.current) {
			initParams.page = pageIndex + 1;
			initParams.limit = pageSize;

			const queryParams = { ...initParams, ...filterParam };
			const queryStirng = ObjecttoQueryString(queryParams);

			dispatch(actions.get({ QueryParams: queryStirng }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getLoading]);

	useEffect(() => {
		if (getSuccess) {
			setData(getSuccess.data);
			setPageCount(Math.ceil(getSuccess.meta.totalItems));
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getSuccess]);

	useEffect(() => {
		if (deleteError) {
			const errors = deleteError.error;
			if (errors) {
				if (!errors.error) {
					dispatch(
						showMessage({
							message: errors.message,
							autoHideDuration: 5000,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'center'
							},
							variant: 'error'
						})
					);
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteError]);

	useEffect(() => {
		if (deleteSuccess) {
			dispatch(
				showMessage({
					message: 'User delete successfully',
					autoHideDuration: 5000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);
			getData(filterParam);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteSuccess]);

	const handleClickAdd = () => {
		setOpenAddDrawer(true);
	};

	const onEditClick = rowObj => {
		setSelectedData(rowObj);
		setOpenEditDrawer(true);
	};

	const onDeleteClick = rowObj => {
		confirm({ description: 'Do you want to delete user?' })
			.then(() => {
				dispatch(actions.delete(rowObj));
			})
			.catch(() => {
				//	console.log('Escape');
			});
	};

	const onResetPasswordClick = rowObj => {
		setSelectedData(rowObj);
		setOpenResetPasswordDialog(true);
	};

	// eslint-disable-next-line no-unused-vars
	const onStatusClick = rowObj => {
		// console.log(rowObj);
	};

	const closeDrawer = () => {
		setOpenAddDrawer(false);
		setOpenEditDrawer(false);
	};

	const searchProps = obj => {
		filterParam = obj;
		if (!initialized) {
			fetchData({ pageSize: initParams.limit, pageIndex: 0 });
		}
		setInitialized(false);
	};

	const childProps = obj => {
		if (obj.type === 'EDIT') {
			dispatch(
				showMessage({
					message: 'User edit successfully',
					autoHideDuration: 3000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				})
			);
		}
		getData(filterParam);
	};

	// eslint-disable-next-line no-unused-vars
	const childPropsDialog = obj => {
		setOpenResetPasswordDialog(false);
	};

	const closeDialog = () => {
		setOpenResetPasswordDialog(false);
	};

	const columns = useMemo(
		() => [
			{
				// eslint-disable-next-line react/prop-types
				Header: ({ selectedFlatRows }) => {
					// eslint-disable-next-line react/prop-types
					const selectedRowIds = selectedFlatRows.map(row => row.original.idUser);
					// eslint-disable-next-line react/prop-types
					return selectedFlatRows.length > 0 && <MultiSelectMenu selectedIds={selectedRowIds} />;
				},
				accessor: 'avatar',
				// eslint-disable-next-line react/prop-types
				Cell: ({ row }) => {
					return (
						// eslint-disable-next-line react/prop-types
						row.original.Files && row.original.Files[0] ? (
							<Avatar
								className=""
								// eslint-disable-next-line react/prop-types
								alt={row.original.Files[0].File}
								// eslint-disable-next-line react/prop-types
								src={row.original.Files[0].File}
							/>
						) : (
							// eslint-disable-next-line react/prop-types
							<Avatar className="">{row.original.FirstName.slice(0, 1).toUpperCase()}</Avatar>
						)
					);
				},
				className: 'justify-center',
				sortable: false
			},
			{
				Header: 'Name',
				accessor: 'Name',
				width: '25%'
			},
			{
				Header: 'Phone',
				accessor: 'MobileNumber',
				width: '10%'
			},
			{
				Header: 'Email',
				accessor: 'Email',
				width: '20%'
			},
			{
				Header: 'Role',
				accessor: 'RoleType',
				width: '10%'
			},
			{
				Header: 'Company',
				accessor: 'Company',
				width: '15%'
			},

			{
				Header: 'User Type',
				accessor: 'UserType',
				width: '15%'
			},

			{
				Header: 'Status',
				accessor: 'Status',
				width: '5%'
			},
			{
				id: 'action',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<IconButton
							size="small"
							onClick={ev => {
								ev.stopPropagation();
								onEditClick(row.original);
							}}>
							<EditOutlinedIcon />
						</IconButton>

						<IconButton
							size="small"
							onClick={ev => {
								ev.stopPropagation();
								onDeleteClick(row.original);
							}}>
							<DeleteOutlinedIcon />
						</IconButton>

						<Tooltip title="Reset password">
							<IconButton
								size="small"
								onClick={ev => {
									ev.stopPropagation();
									onResetPasswordClick(row.original);
								}}>
								<RestoreOutlinedIcon />
							</IconButton>
						</Tooltip>

						<Tooltip title="Active">
							<IconButton
								size="small"
								onClick={ev => {
									ev.stopPropagation();
									onStatusClick(row.original);
								}}>
								{row.original.Status === 'Active' ? (
									<Icon className="text-green text-20">check_circle</Icon>
								) : (
									<Icon className="text-red text-20">remove_circle</Icon>
								)}
							</IconButton>
						</Tooltip>
					</div>
				)
			}
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<div>
			<FusePageCarded
				// classes={{
				// 	toolbar: 'p-0',
				// 	header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				// }}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<div className="flex items-center">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
											Users
										</Typography>
									</FuseAnimate>
								</div>
							</FuseAnimate>
						</div>
						<Search passProps={searchProps} />
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap normal-case"
								variant="contained"
								color="secondary"
								onClick={handleClickAdd}>
								<AddOutlinedIcon style={{ marginRight: '7px' }} /> Add
							</Button>
						</FuseAnimate>
					</div>
				}
				content={
					<div
					// className={classes.content}
					>
						<FuseAnimate animation="transition.slideUpIn" delay={300}>
							<PaginationTable
								columns={columns}
								data={data}
								fetchData={fetchData}
								loading={loading}
								pageCount={pageCount}
								onRowClick={(ev, row) => {
									if (row) {
										// eslint-disable-next-line react/prop-types
										onEditClick(row.original);
									}
								}}
							/>
						</FuseAnimate>
					</div>
				}
				innerScroll
			/>

			{openAddDrawer && (
				<CustomDrawer
					title="User"
					component={User}
					onDrawerClose={closeDrawer}
					onCloseDrawer={closeDrawer}
					passProps={childProps}
					edit={false}
					width={30}
				/>
			)}

			{openEditDrawer && (
				<CustomDrawer
					title={selectedData && selectedData.Name ? selectedData.Name : 'User'}
					component={User}
					onDrawerClose={closeDrawer}
					onCloseDrawer={closeDrawer}
					selectedData={selectedData}
					passProps={childProps}
					edit
					width={30}
				/>
			)}

			{openResetPasswordDialog && (
				<CustomDialog
					title="Reset password."
					Component={ResetPassword}
					onDialogClose={closeDialog}
					onCloseDialog={closeDialog}
					selectedData={selectedData}
					resetpassword
					disableEscapeKeyDown
					passProps={childPropsDialog}
				/>
			)}
		</div>
	);
};

export default Users;
