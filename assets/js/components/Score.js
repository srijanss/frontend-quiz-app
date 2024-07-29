import { navigateTo } from "../history";
import store from "../store";

export class ScoreComponent extends HTMLElement {
  connectedCallback() {
    this.category = this.getAttribute("data-category");
    const state = history.state;
    if (state) {
      store.score = state.score;
    }
    this.render();
    this.backButton = this.querySelector(".category");
    this.backButton.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(store.baseURL);
    });
  }
  render() {
    this.innerHTML = `<h1>${this.category} Score page</h1>
    <h2>Your score is ${store.score}</h2>
    <a href="${store.baseURL}" class="category">Back to Categories</a>
    `;
  }
}
