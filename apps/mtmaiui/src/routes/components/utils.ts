import type { IStatus } from "./datamodel";

export function setLocalStorage(name: string, value: any, stringify = true) {
  if (stringify) {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
}

export function getLocalStorage(name: string, stringify = true): any {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(name);
    try {
      if (stringify) {
        return JSON.parse(value!);
      }
      return value;
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}

export function fetchJSON(
  url: string | URL,
  payload: any = {},
  onSuccess: (data: any) => void,
  onError: (error: IStatus) => void,
  onFinal: () => void = () => {},
) {
  return fetch(url, payload)
    .then((response) => {
      if (response.status !== 200) {
        console.log(
          `Looks like there was a problem. Status Code: ${response.status}`,
          response,
        );
        response.json().then((data) => {
          console.log("Error data", data);
        });
        onError({
          status: false,
          message: `Connection error ${response.status} ${response.statusText}`,
        });
        return;
      }
      return response.json().then((data) => {
        onSuccess(data);
      });
    })
    .catch((err) => {
      console.log("Fetch Error :-S", err);
      onError({
        status: false,
        message: `There was an error connecting to server. (${err}) `,
      });
    })
    .finally(() => {
      onFinal();
    });
}

export function eraseCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function truncateText(text: string, length = 50) {
  if (text.length > length) {
    return `${text.substring(0, length)} ...`;
  }
  return text;
}
