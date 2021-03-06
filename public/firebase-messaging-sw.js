/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// import firebase scripts inside service worker js script
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

const firebaseConfig = {
	apiKey: 'AIzaSyCAvx6dpnJp3G0pXZtoh5xwT4dluLELvIY',
	authDomain: 'push-notification-projec-411a3.firebaseapp.com',
	databaseURL: 'https://push-notification-projec-411a3.firebaseio.com',
	projectId: 'push-notification-projec-411a3',
	storageBucket: 'push-notification-projec-411a3.appspot.com',
	messagingSenderId: '842398158029',
	appId: '1:842398158029:web:9d5153a6f65bcf2a2bad84',
	measurementId: 'G-7X3XH285SE'
};
firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-unused-vars
const messaging = firebase.messaging();

messaging.usePublicVapidKey('BC1CAnjyiEIjwY_rOat-f66Lp0GlJaPVKM-iIM4xfThK7TPDokGGvdkqKRhJMp3aoQBfJ8QWdrJlZWNv9onx1wI');

// eslint-disable-next-line func-names
messaging.setBackgroundMessageHandler(function (payload) {
	// Customize notification here
	const promiseChain = clients
		.matchAll({
			type: 'window',
			includeUncontrolled: true
		})
		.then(windowClients => {
			for (let i = 0; i < windowClients.length; i += 1) {
				const windowClient = windowClients[i];

				windowClient.postMessage(payload);
			}
		})
		.then(() => {
			const notificationTitle = payload.data.title;
			const notificationOptions = {
				body: payload.data.body,
				icon: 'http://pluspng.com/img-png/free-tag-png-free-png-clipart-406.png',
				data: {
					time: new Date(Date.now()).toString(),
					message: 'Hello, World!'
				},
				actions: [
					{
						action: 'coffee-action',
						title: 'Coffee',
						icon: '/images/demos/action-1-128x128.png'
					},
					{
						action: 'doughnut-action',
						title: 'Doughnut',
						icon: '/images/demos/action-2-128x128.png'
					},
					{
						action: 'gramophone-action',
						title: 'gramophone',
						icon: '/images/demos/action-3-128x128.png'
					},
					{
						action: 'atom-action',
						title: 'Atom',
						icon: '/images/demos/action-4-128x128.png'
					}
				]
			};

			// eslint-disable-next-line no-restricted-globals
			return self.registration.showNotification(notificationTitle, notificationOptions);
		});

	return promiseChain;
});

function firstWindowClient() {
	return clients.matchAll({ type: 'window' }).then(function (windowClients) {
		// eslint-disable-next-line prefer-promise-reject-errors
		return windowClients.length ? windowClients[0] : Promise.reject('No clients');
	});
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclick', event => {
	const { notification } = event;

	if (event.action) {
		clients.openWindow(event.action);
	}
	event.notification.close();
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclose', event => {
	const { notification } = event;

	// eslint-disable-next-line no-prototype-builtins
	if (!notification.data.hasOwnProperty('options')) return;

	const { options } = notification.data;

	// Available settings for |options.notificationCloseEvent| are:
	//  true: alert will be raised in the client to show the event firing.
	//  flase: no message will be sent back to the client
	if (!options.notificationCloseEvent) return;

	const message = `Closed "${notification.title}"`;
});
