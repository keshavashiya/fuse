/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@material-ui/core';

import { useInjectSaga } from 'redux-injectors';
import { useConfirm } from 'material-ui-confirm';

import saga from './store/userRolesSaga';
import { name, actions } from './store/userRolesSlice';

function MultiSelectMenu(props) {
	useInjectSaga({ key: name, saga });

	const confirm = useConfirm();

	const dispatch = useDispatch();
	const { Reducer } = useSelector(
		reducer => ({
			Reducer: reducer.permissions.roles
		}),
		shallowEqual
	);

	const { selectedIds } = props;

	const { Loading, deleteSuccess, deleteError } = Reducer;

	const [anchorEl, setAnchorEl] = useState(null);

	function openSelectedMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedMenu() {
		setAnchorEl(null);
	}

	const remove = ids => {
		confirm({ description: 'Do you want to delete roles?' })
			.then(() => {
				ids.forEach(id => {
					dispatch(actions.delete({ idPriceList: id }));
				});
			})
			.catch(() => {
				//	console.log('Escape');
			});
	};

	useEffect(() => {
		if (Loading) {
			// Delete loader
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Loading]);

	useEffect(() => {
		if (deleteError) {
			// Error while delete
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteError]);

	useEffect(() => {
		if (deleteSuccess) {
			// Delete Success
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteSuccess]);

	return (
		<>
			<IconButton
				className="p-0"
				aria-owns={anchorEl ? 'selectedMenu' : null}
				aria-haspopup="true"
				onClick={openSelectedMenu}>
				<Icon>more_horiz</Icon>
			</IconButton>
			<Menu id="selectedMenu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeSelectedMenu}>
				<MenuList>
					<MenuItem
						onClick={() => {
							// dispatch(remove(selectedIds));
							remove(selectedIds);
							closeSelectedMenu();
						}}>
						<ListItemIcon className="min-w-40">
							<Icon>delete</Icon>
						</ListItemIcon>
						<ListItemText primary="Remove" />
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	);
}

export default MultiSelectMenu;
