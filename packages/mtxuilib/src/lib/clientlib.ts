"use client";
// ESM is still a nightmare with Next.js so I'm just gonna copy the package code in
// https://github.com/gregberge/react-merge-refs
// Copyright (c) 2020 Greg Bergé
export function mergeRefs<T>(
	refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
	return (value) => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref != null) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	};
}

export function getCookie(name: string) {
	const cookieArr = document.cookie.split(";");
	for (let i = 0; i < cookieArr.length; i++) {
		const cookiePair = cookieArr[i].split("=");
		if (name === cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
}

export function deleteAllCookies() {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	}
}

export function setCookie(name: string, value, path = "/", domain?: string) {
	let cookieString = `${name}=${value};path=${path}`;
	if (domain) {
		cookieString += `;domain=${domain}`;
	}
	document.cookie = cookieString;
}

export function deleteCookie(name: string, path = "/", domain?: string) {
	// 提示: http only cookie 无法通过脚本删除
	let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;

	if (domain) {
		cookieString += `;domain=${domain}`;
	}

	document.cookie = cookieString;
}
