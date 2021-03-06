import Notification from './Notification';
import NotificationPermission from './NotificationPermission';

const NotificationConfig = {
	routes: [
		{
			path: ['/notifications'],
			component: Notification
		},
		{
			path: ['/notificationpermission'],
			component: NotificationPermission
		}
	]
};

export default NotificationConfig;
