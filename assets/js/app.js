import { CategoryIcon } from "./components/category_icon/CategoryIcon.js";
import { ToggleSwitch } from "./components/toggle_switch/ToggleSwitch.js";
import { HeaderComponent } from "./components/header/Header.js";
import { CategoryListComponent } from "./components/category_list/CategoryList.js";
import { ProgressBarComponent } from "./components/progress_bar/ProgressBar.js";
import { QuestionComponent } from "./components/question_item/Question.js";
import { ScoreComponent } from "./components/Score.js";
import { handleHistoryPopState } from "./history.js";
import render from "./renderer.js";

customElements.define("category-icon", CategoryIcon);
customElements.define("toggle-switch", ToggleSwitch);
customElements.define("header-component", HeaderComponent);
customElements.define("category-component", CategoryListComponent);
customElements.define("progress-bar", ProgressBarComponent);
customElements.define("question-component", QuestionComponent);
customElements.define("score-component", ScoreComponent);

render();
handleHistoryPopState();
