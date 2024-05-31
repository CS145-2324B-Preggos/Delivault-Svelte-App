/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files  // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

self.addEventListener(
	'push', async (event) => {
		if (!(self.Notification && self.Notification.permission === "granted")) return
		console.log(`Received event with data.text ${event.data?.text()}`)

		const data = event.data?.json() ?? {}

		const notificationTitle = data.title ?? "DeliVault Notification"
		const notificationBody = data.options.body ?? "With love, from DeliVault!"

		const thisWorker = await self.registration

		event.waitUntil(
			thisWorker.showNotification(
				notificationTitle,
				{
					lang: 'en',
					body: notificationBody,
					vibrate: [500, 500, 500],
					icon: 'favicon.png'
				}
			).then(console.log("Notification sent!")
			)
		)
	}
)

// this code taken from an MDN web docs example
self.addEventListener("notificationclick", (event) => {
	console.log("On notification click: ", event.notification.tag);
	event.notification.close();
  
	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(
	  clients
		.matchAll({
		  type: "window",
		})
		.then((clientList) => {
		  for (const client of clientList) {
			if (client.url === "/" && "focus" in client) return client.focus();
		  }
		  if (clients.openWindow) return clients.openWindow("/");
		}),
	);
  });