import CategoryPage from "./pages/index.js";
import QuestionPage from "./pages/question.js";
import ScorePage from "./pages/score.js";

const routes = {
  "/": CategoryPage,
  ":category/question/:id/": QuestionPage,
  ":category/score/": ScorePage,
};

function matchRoute(path) {
  const matchedRoute = { component: CategoryPage };
  for (const route in routes) {
    const re = new RegExp(`^${route.replace(/:\w+/g, "([^/]+)")}$`);
    path = path.length > 1 ? path.replace(/^\//, "") : path;
    if (!path.endsWith("/")) {
      path += "/";
    }
    const match = path.match(re);
    if (match) {
      matchedRoute.component = routes[route];
      const params = match.slice(1);
      if (params.length > 0) {
        matchedRoute.params = params;
      }
      return matchedRoute;
    }
  }
  return matchedRoute;
}

export { matchRoute };
