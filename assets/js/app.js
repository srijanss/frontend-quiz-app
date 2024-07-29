import { CategoryListComponent } from "./components/CategoryList.js";
import { QuestionComponent } from "./components/Question.js";
import { ScoreComponent } from "./components/Score.js";
import render from "./renderer.js";

customElements.define("category-component", CategoryListComponent);
customElements.define("question-component", QuestionComponent);
customElements.define("score-component", ScoreComponent);

// get the base URL from the vite.config.js

window.onpopstate = render;
// document.addEventListener("click", (event) => {
//   if (event.target.tagName !== "A") return;
//   event.preventDefault();
//   // get only the pathnane from href
//   const pathname = new URL(event.target.href).pathname;
//   const state = {
//     category: event.target.dataset.category,
//     qid: event.target.dataset.qid,
//   };
//   navigateTo(pathname, state);
// });

render();
