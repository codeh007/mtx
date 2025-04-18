export const isAbsoluteUrl = (url: string) => {
	return url.startsWith("http://") || url.startsWith("https://");
};
function normalize(_strArray) {
	const resultArray = [];
	if (_strArray.length === 0) {
		return "";
	}

	// Filter out any empty string values.
	const strArray = _strArray.filter((part) => part !== "");

	if (typeof strArray[0] !== "string") {
		throw new TypeError(`Url must be a string. Received ${strArray[0]}`);
	}

	// If the first part is a plain protocol, we combine it with the next part.
	if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
		strArray[0] = strArray.shift() + strArray[0];
	}

	// If the first part is a leading slash, we combine it with the next part.
	if (strArray[0] === "/" && strArray.length > 1) {
		strArray[0] = strArray.shift() + strArray[0];
	}

	// There must be two or three slashes in the file protocol, two slashes in anything else.
	if (strArray[0].match(/^file:\/\/\//)) {
		strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
	} else {
		strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
	}

	for (let i = 0; i < strArray.length; i++) {
		let component = strArray[i];

		if (typeof component !== "string") {
			throw new TypeError(`Url must be a string. Received ${component}`);
		}

		if (i > 0) {
			// Removing the starting slashes for each component but the first.
			component = component.replace(/^[\/]+/, "");
		}
		if (i < strArray.length - 1) {
			// Removing the ending slashes for each component but the last.
			component = component.replace(/[\/]+$/, "");
		} else {
			// For the last component we will combine multiple slashes to a single one.
			component = component.replace(/[\/]+$/, "/");
		}

		if (component === "") {
			continue;
		}

		//@ts-ignore
		resultArray.push(component);
	}

	let str = "";

	for (let i = 0; i < resultArray.length; i++) {
		const part = resultArray[i];

		// Do not add a slash if this is the first part.
		if (i === 0) {
			str += part;
			continue;
		}

		const prevPart = resultArray[i - 1];

		// Do not add a slash if the previous part ends with start of the query param or hash.
		//@ts-ignore
		if (prevPart?.endsWith("?") || prevPart.endsWith("#")) {
			str += part;
			continue;
		}

		str += `/${part}`;
	}
	// Each input component is now separated by a single slash except the possible first plain protocol part.

	// remove trailing slash before parameters or hash
	str = str.replace(/\/(\?|&|#[^!])/g, "$1");

	// replace ? and & in parameters with &
	const [beforeHash, afterHash] = str.split("#");
	const parts = beforeHash.split(/(?:\?|&)+/).filter(Boolean);
	str =
		parts.shift() +
		(parts.length > 0 ? "?" : "") +
		parts.join("&") +
		(afterHash && afterHash.length > 0 ? `#${afterHash}` : "");

	return str;
}

export function urlJoin(...args) {
	const parts = Array.from(Array.isArray(args[0]) ? args[0] : args);
	return normalize(parts);
}


export const isValidUrl = (url: string) => {
	try {
	  new URL(url);
	  return true;
	} catch (e) {
	  return false;
	}
  };
  
  export const getDomainWithoutWWW = (url: string) => {
	if (isValidUrl(url)) {
	  return new URL(url).hostname.replace(/^www\./, "");
	}
	try {
	  if (url.includes(".") && !url.includes(" ")) {
		return new URL(`https://${url}`).hostname.replace(/^www\./, "");
	  }
	} catch (e) {
	  return null;
	}
  };
  
  export function absoluteUrl(path: string) {
	return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
  }
  
  export function capitalize(input: string) {
	return input.charAt(0).toUpperCase() + input.slice(1);
  }
  
  export function cleanSearchParams(urlSearchParams: URLSearchParams) {
	const cleanedParams = urlSearchParams;
	const keysForDel: any[] = [];
  
	for (const [key, value] of urlSearchParams.entries()) {
	  if (value === "null" || value === "undefined" || !value) {
		keysForDel.push(key);
	  }
	}
  
	for (const key of keysForDel) {
	  cleanedParams.delete(key);
	}
  
	return cleanedParams;
  }
  
  export function urlJoinPaths(...paths: string[]) {
	const a = paths.join("/");
	return a.replaceAll("//", "/");
  }
  