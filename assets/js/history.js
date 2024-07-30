import store from "./store/store.js";
import render from "./renderer.js";

export function navigateTo(path, state) {
  const newPath = path.includes(store.baseURL) ? path : store.baseURL + path;
  window.history.pushState(state || {}, "", newPath);
  render();
}

export function navigateByReplace(path, state) {
  const newPath = path.includes(store.baseURL) ? path : store.baseURL + path;
  window.history.replaceState(state || {}, "", newPath);
  render();
}

export function replaceState(path, state) {
  const newPath = path.includes(store.baseURL) ? path : store.baseURL + path;
  window.history.replaceState(state || {}, "", newPath);
}

export function handleHistoryPopState() {
  window.onpopstate = render;
}
