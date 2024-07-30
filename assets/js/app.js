import { CategoryIcon } from "./components/category_icon/CategoryIcon.js";
import { HeaderComponent } from "./components/header/Header.js";
import { CategoryListComponent } from "./components/CategoryList.js";
import { QuestionComponent } from "./components/Question.js";
import { ScoreComponent } from "./components/Score.js";
import { handleHistoryPopState } from "./history.js";
import render from "./renderer.js";

customElements.define("category-icon", CategoryIcon);
customElements.define("header-component", HeaderComponent);
customElements.define("category-component", CategoryListComponent);
customElements.define("question-component", QuestionComponent);
customElements.define("score-component", ScoreComponent);

render();
handleHistoryPopState();
