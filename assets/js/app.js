import { matchRoute } from "./router.js";

// get the base URL from the vite.config.js
const baseURL = import.meta.env.BASE_URL;

function navigateTo(path) {
  window.history.pushState({}, "", baseURL + path);
  render();
}

function render() {
  const path = window.location.pathname;
  const pathWithoutBase = path.replace(baseURL, "/");
  const match = matchRoute(pathWithoutBase);
  if (match.params) {
    document.body.innerHTML = match.component(...Object.values(match.params));
  } else {
    document.body.innerHTML = match.component();
  }
}

window.onpopstate = render;

render();
