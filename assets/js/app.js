import { CategoryListComponent } from "./components/CategoryList.js";
import { QuestionComponent } from "./components/Question.js";
import { ScoreComponent } from "./components/Score.js";
import { handleHistoryPopState } from "./history.js";
import render from "./renderer.js";

customElements.define("category-component", CategoryListComponent);
customElements.define("question-component", QuestionComponent);
customElements.define("score-component", ScoreComponent);

render();
handleHistoryPopState();
