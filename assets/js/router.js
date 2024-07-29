import CategoryPage from "./pages/index.js";
import QuestionPage from "./pages/question.js";
import ScorePage from "./pages/score.js";

const routes = {
  "/": { component: CategoryPage, name: "home-page" },
  ":category/question/:id/": { component: QuestionPage, name: "question-page" },
  ":category/score/": { component: ScorePage, name: "score-page" },
};

function matchRoute(path) {
  const matchedRoute = routes["/"].component;
  for (const route in routes) {
    const re = new RegExp(`^${route.replace(/:\w+/g, "([^/]+)")}$`);
    path = path.length > 1 ? path.replace(/^\//, "") : path;
    if (!path.endsWith("/")) {
      path += "/";
    }
    const match = path.match(re);
    if (match) {
      matchedRoute.component = routes[route].component;
      const params = match.slice(1);
      if (params.length > 0) {
        matchedRoute.params = params;
      }
      return matchedRoute;
    }
  }
  return matchedRoute;
}

export { routes, matchRoute };
