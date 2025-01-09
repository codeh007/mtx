// This is a module worker, so we can use imports (in the browser too!)
// import pi from "./utils/pi";

// import { pi } from "./lib";

addEventListener("message", (event: MessageEvent<number>) => {
	// postMessage(pi(event.data));
});

//---------------------------------------------------------------
const installEvent = () => {
	self.addEventListener("install", () => {
		console.log("service worker installed");
	});
};
installEvent();

const activateEvent = () => {
	self.addEventListener("activate", () => {
		console.log("service worker activated");
	});
};
activateEvent();

const cacheName = "v3";

const cacheClone = async (e) => {
	const res = await fetch(e.request);
	const resClone = res.clone();

	const cache = await caches.open(cacheName);
	await cache.put(e.request, resClone);
	return res;
};

const fetchEvent = () => {
	console.log("setup service worker fetch event");
	self.addEventListener("fetch", (e) => {
		console.log("fetch event@serviceworker", e);
		e.respondWith(new Response("hello response"));
		// e.respondWith(
		//   cacheClone(e)
		//     .catch(() => caches.match(e.request))
		//     .then((res) => res)
		// );
	});
};

fetchEvent();
