import store from "./store.js";
import render from "./renderer.js";

export function navigateTo(path, state) {
  path = path.includes(store.baseURL) ? path : store.baseURL + path;
  window.history.pushState(state || {}, "", path);
  render();
}

export function replaceState(path, state) {
  path = path.includes(store.baseURL) ? path : store.baseURL + path;
  window.history.replaceState(state || {}, "", path);
}

export function handleHistoryPopState() {
  window.onpopstate = render;
}
