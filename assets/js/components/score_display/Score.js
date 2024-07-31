import { navigateTo } from "../../history";
import store from "../../store/store";
import { getAbsolutePath } from "../../utils";
import css from "./Score.css?inline";

export class ScoreComponent extends HTMLElement {
  constructor() {
    super();
    this.category = this.getAttribute("data-category");
  }
  connectedCallback() {
    const historyState = history.state;
    if (historyState) {
      if (store.score === 0) {
        this.rehydrateStore(historyState);
      }
    }
    this.render();
    this.handleBackButtonClick();
  }

  handleBackButtonClick() {
    const backButton = this.querySelector(".play-again-btn");
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(getAbsolutePath("home-page"));
    });
  }

  rehydrateStore(state) {
    store.score = state.score;
    store.selectedCategory = state.category;
  }
  render() {
    this.innerHTML = `
    <style>
      ${css}
    </style>
    <article class="score-container">
      <h1>Quiz completed</h1>
      <h2>You scored...</h2>
      <div class="score-block">
        <div class="category-block">
          <category-icon></category-icon>
          <span class="category-name">${store.selectedCategory}</span>
        </div>
        <div class="score-text"><p class="points-scored">${store.score}</p><p class="score-out-of">out of 10</p></div>
      </div>
      <button class="primary-btn play-again-btn">Play again</button>
    </article>
    `;
  }
}
