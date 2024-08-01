import { routes } from "./router.js";
import store from "./store/store.js";

export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function randomizeList(list) {
  return list.sort(() => Math.random() - 0.5);
}

export function getAbsolutePath(pathname, params) {
  const route = Object.keys(routes).find(
    (key) => routes[key].name === pathname
  );
  const path = route.replace(/:\w+/g, (match) => {
    const key = match.replace(":", "");
    return params[key];
  });
  if (path === "/") {
    return `${store.baseURL}/`;
  }
  return `${store.baseURL}/${path}`;
}
