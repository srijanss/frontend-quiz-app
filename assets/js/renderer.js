import store from "./store";
import { matchRoute } from "./router.js";

export default function render() {
  console.log(window.history);
  const path = window.location.pathname;
  const pathWithoutBase = path.replace(store.baseURL, "/");
  const match = matchRoute(pathWithoutBase);
  if (match.params) {
    document.body.innerHTML = match.component(...Object.values(match.params));
  } else {
    document.body.innerHTML = match.component();
  }
}
