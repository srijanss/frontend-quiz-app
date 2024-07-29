import { CategoryListComponent } from "./components/CategoryList.js";
import { QuestionComponent } from "./components/Question.js";
import { ScoreComponent } from "./components/Score.js";
import { navigateTo, handleHistoryPopState } from "./history.js";
import store from "./store.js";

customElements.define("category-component", CategoryListComponent);
customElements.define("question-component", QuestionComponent);
customElements.define("score-component", ScoreComponent);

navigateTo(store.baseURL);
handleHistoryPopState();
