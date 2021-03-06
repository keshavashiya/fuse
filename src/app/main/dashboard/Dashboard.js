import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Typography, Icon } from '@material-ui/core';
import { useInjectSaga } from 'redux-injectors'; // useInjectReducer
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FuseAnimateGroup from '../../../@fuse/core/FuseAnimateGroup';
import FusePageSimple from '../../../@fuse/core/FusePageSimple';
import _ from '../../../@lodash';
import withReducer from '../../store/withReducer';

// import FusePageCarded from '../../../@fuse/core/FusePageCarded';
// import FuseAnimate from '../../../@fuse/core/FuseAnimate';

import reducer from './store';
// import { selectWidgetsEntities, getWidgets } from './store/widgetsSlice';

import { name, actions, selectWidgetsEntities } from './store/widgetsSlice';
import saga from './store/saga';
import Anniversary from './widgets/Anniversary';
import Birthday from './widgets/Birthday';
import Clock from './widgets/Clock';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
	selectedProject: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '8px 0 0 0'
	},
	projectMenuButton: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '0 8px 0 0',
		marginLeft: 1
	}
}));

const Dashboard = props => {
	useInjectSaga({ key: name, saga });

	const dispatch = useDispatch();
	const widgets = useSelector(selectWidgetsEntities);
	const classes = useStyles(props);

	useEffect(() => {
		dispatch(actions.get());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	if (_.isEmpty(widgets)) {
		return null;
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-160 h-160',
				toolbar: 'min-h-48 h-48',
				rightSidebar: 'w-288',
				content: classes.content
			}}
			header={
				<div className="flex flex-col justify-between flex-1 px-24 pt-24">
					<div className="flex justify-between items-start">
						<Typography className="py-0 sm:py-24" variant="h4">
							Welcome back, Dharmesh!
						</Typography>
						{/* <Hidden lgUp>
							<IconButton
								onClick={ev => pageLayout.current.toggleRightSidebar()}
								aria-label="open left sidebar"
								color="inherit">
								<Icon>menu</Icon>
							</IconButton>
						</Hidden> */}
					</div>
					{/* <div className="flex items-end">
						<div className="flex items-center">
							<div className={clsx(classes.selectedProject, 'flex items-center h-40 px-16 text-16')}>
								{_.find(projects, ['id', selectedProject.id]).name}
							</div>
							<IconButton
								className={clsx(classes.projectMenuButton, 'h-40 w-40 p-0')}
								aria-owns={selectedProject.menuEl ? 'project-menu' : undefined}
								aria-haspopup="true"
								onClick={handleOpenProjectMenu}>
								<Icon>more_horiz</Icon>
							</IconButton>
							<Menu
								id="project-menu"
								anchorEl={selectedProject.menuEl}
								open={Boolean(selectedProject.menuEl)}
								onClose={handleCloseProjectMenu}>
								{projects &&
									projects.map(project => (
										<MenuItem
											key={project.id}
											onClick={ev => {
												handleChangeProject(project.id);
											}}>
											{project.name}
										</MenuItem>
									))}
							</Menu>
						</div>
					</div> */}
				</div>
			}
			// contentToolbar={
			// 	<Tabs
			// 		value={tabValue}
			// 		onChange={handleChangeTab}
			// 		indicatorColor="secondary"
			// 		textColor="secondary"
			// 		variant="scrollable"
			// 		scrollButtons="off"
			// 		className="w-full px-24">
			// 		<Tab className="text-14 font-600 normal-case" label="Home" />
			// 		<Tab className="text-14 font-600 normal-case" label="Budget Summary" />
			// 		<Tab className="text-14 font-600 normal-case" label="Team Members" />
			// 	</Tabs>
			// }
			content={
				<div className="p-12">
					{/* {widgets.Anniversary.rows.length && ( */}
					<div className="widget flex w-full sm:w-1/3 p-16">
						{/* <FuseAnimate delay={600}>
	 										<Typography className="px-16 pb-8 text-18 font-300 lg:pt-0">
	 											What are your top campaigns?
	 										</Typography>
	 									</FuseAnimate> */}

						<div className="widget w-full p-16">
							<Anniversary data={widgets.Anniversary} />
						</div>
						{/* {widgets.BirthDay.rows.length && ( */}
						{/* <div className="widget flex w-full sm:w-1/3 p-16"> */}
						{/* <FuseAnimate delay={600}>
	 										<Typography className="px-16 pb-8 text-18 font-300 lg:pt-0">
	 											What are your top campaigns?
	 										</Typography>
	 									</FuseAnimate> */}
						<div className="widget w-full p-16">
							<Birthday data={widgets.BirthDay} />
						</div>
						{/* </div> */}
						{/* )} */}
					</div>
					{/* )} */}

					{/* {tabValue === 0 && (
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: 'transition.slideUpBigIn'
							}}>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget1 widget={widgets.widget1} />
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget2 widget={widgets.widget2} />
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget3 widget={widgets.widget3} />
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget4 widget={widgets.widget4} />
							</div>
							<div className="widget flex w-full p-12">
								<Widget5 widget={widgets.widget5} />
							</div>
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget6 widget={widgets.widget6} />
							</div>
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget7 widget={widgets.widget7} />
							</div>
						</FuseAnimateGroup>
					)}
					{tabValue === 1 && (
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: 'transition.slideUpBigIn'
							}}>
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget8 widget={widgets.widget8} />
							</div>
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget9 widget={widgets.widget9} />
							</div>
							<div className="widget flex w-full p-12">
								<Widget10 widget={widgets.widget10} />
							</div>
						</FuseAnimateGroup>
					)}
					{tabValue === 2 && (
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: 'transition.slideUpBigIn'
							}}>
							<div className="widget flex w-full p-12">
								<Widget11 widget={widgets.widget11} />
							</div>
						</FuseAnimateGroup>
					)} */}
				</div>
			}
			rightSidebarContent={
				<FuseAnimateGroup
					className="w-full"
					enter={{
						animation: 'transition.slideUpBigIn'
					}}>
					<div className="widget w-full p-12">
						<Clock />
					</div>
					{/* <div className="widget w-full p-12">
						<WidgetWeather widget={widgets.weatherWidget} />
					</div> */}
				</FuseAnimateGroup>
			}
			// ref={pageLayout}
		/>
	);

	// return (
	// 	<div>
	// 		<div className="widget flex w-full sm:w-1/3 p-16">
	// 			{/* <FuseAnimate delay={600}>
	// 										<Typography className="px-16 pb-8 text-18 font-300 lg:pt-0">
	// 											What are your top campaigns?
	// 										</Typography>
	// 									</FuseAnimate> */}
	// 			<div className="widget w-full p-16">
	// 				<Anniversary data={widgets.Anniversary} />
	// 			</div>
	// 		</div>

	// 		<div className="widget flex w-full sm:w-1/3 p-16">
	// 			{/* <FuseAnimate delay={600}>
	// 										<div className="px-16 pb-8 text-18 font-300">Clock</div>
	// 									</FuseAnimate> */}
	// 			<div className="widget w-full p-16">
	// 				<Clock />
	// 			</div>
	// 		</div>
	// 	</div>
	// );

	// return (
	// 	<div>
	// 		<FusePageCarded
	// 			classes={{
	// 				toolbar: 'p-0',
	// 				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
	// 			}}
	// 			header={
	// 				<div className="flex flex-1 w-full items-center justify-between">
	// 					<div className="flex flex-col items-start max-w-full">
	// 						<div className="flex items-center max-w-full">
	// 							<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
	// 								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
	// 									<Typography className="text-32 sm:text-32 truncate">Dashboard</Typography>
	// 								</FuseAnimate>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			}
	// 			content={
	// 				<div className="w-full">
	// 					<FuseAnimate animation="transition.slideUpIn" delay={200}>
	// 						<div className="flex flex-col md:flex-row sm:p-8 container">
	// 							<div className="flex flex-wrap w-full md:w-320 pt-16">
	// 								<div className="mb-32 w-full sm:w-1/2 md:w-full">
	// 									<FuseAnimate delay={600}>
	// 										<Typography className="px-16 pb-8 text-18 font-300 lg:pt-0">
	// 											What are your top campaigns?
	// 										</Typography>
	// 									</FuseAnimate>
	// 									<div className="widget w-full p-16">
	// 										<Anniversary data={widgets.Anniversary} />
	// 									</div>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</FuseAnimate>
	// 				</div>
	// 			}
	// 		/>
	// 	</div>
	// );
};

export default withReducer('Dashboard', reducer)(Dashboard);
// export default Dashboard;
