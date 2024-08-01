import store from "./store/store.js";
import { matchRoute } from "./router.js";

export default function render() {
  const path = window.location.pathname;
  const pathWithoutBase = path.replace(store.baseURL, "/");
  const match = matchRoute(pathWithoutBase);
  const appDiv = document.getElementById("app");
  if (match.params) {
    appDiv.innerHTML = match.component(...Object.values(match.params));
  } else {
    appDiv.innerHTML = match.component();
  }
}
