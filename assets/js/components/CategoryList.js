import store from "../store/store";
import { navigateTo } from "../history";
import { getAbsolutePath, randomizeList } from "../utils";
import StateManager from "../store/state_manager";

export class CategoryListComponent extends HTMLElement {
  connectedCallback() {
    store.reset();
    this.categories = store.categories;
    this.render();
    this.handleCategoryClick();
  }

  renderCategories() {
    return this.categories
      .map(
        (item) =>
          `<button class="category" data-title="${item.title}">
            <img src="${item.icon}" alt="${item.title}" />
            ${item.title}
          </button>
          `
      )
      .join("");
  }

  render() {
    this.innerHTML = `
    <div>
      <h1>Categories</h1>
      ${this.renderCategories()}
    </div>
    `;
  }

  getQuestionsByCategory(category) {
    const questionsList = this.categories.find(
      (item) =>
        item.title.toLowerCase() === store.selectedCategory.toLowerCase()
    ).questions;
    return randomizeList(questionsList);
  }

  handleCategoryClick() {
    this.categoryElements = this.querySelectorAll(".category");
    this.categoryElements.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        store.selectedCategory = item.dataset.title;
        store.questions = this.getQuestionsByCategory(store.selectedCategory);
        const pathname = getAbsolutePath("question-page", {
          category: store.selectedCategory,
          id: store.currentQuestionIndex + 1,
        });
        const state = StateManager.getQuestionPageState(store);
        navigateTo(pathname, state);
      });
    });
  }
}
