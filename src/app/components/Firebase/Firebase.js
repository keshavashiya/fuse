import firebase from 'firebase/app';
import 'firebase/messaging';

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

// eslint-disable-next-line import/no-mutable-exports
let messaging;

// we need to check if messaging is supported by the browser
if (firebase.messaging.isSupported()) {
	messaging = firebase.messaging();
}

// register service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
			updateViaCache: 'none'
		});
		messaging.useServiceWorker(registration);
		messaging.usePublicVapidKey(
			'BC1CAnjyiEIjwY_rOat-f66Lp0GlJaPVKM-iIM4xfThK7TPDokGGvdkqKRhJMp3aoQBfJ8QWdrJlZWNv9onx1wI'
		);
	});
}

// eslint-disable-next-line import/prefer-default-export
export { messaging };
