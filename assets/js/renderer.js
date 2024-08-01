import store from "./store/store.js";
import { matchRoute } from "./router.js";
import { getAbsolutePath } from "./utils.js";
import { navigateByReplace, replaceState } from "./history.js";

export default function render() {
  const path = window.location.pathname;
  if (!path.endsWith("/")) {
    replaceState(`${path}/`);
  }
  const pathWithoutBase = path.replace(store.baseURL, "/");
  const match = matchRoute(pathWithoutBase);
  const appDiv = document.getElementById("app");
  try {
    if (match.params) {
      appDiv.innerHTML = match.component(...Object.values(match.params));
    } else {
      appDiv.innerHTML = match.component();
    }
  } catch {
    navigateByReplace(getAbsolutePath("home-page"));
  }
}
