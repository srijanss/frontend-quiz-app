import store from "../../store/store";
import { navigateTo } from "../../history";
import { getAbsolutePath, randomizeList } from "../../utils";
import StateManager from "../../store/state_manager";
import css from "./CategoryList.css?inline";

export class CategoryListComponent extends HTMLElement {
  constructor() {
    super();
    store.reset();
    this.categories = store.categories;
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleCategoryClick();
  }

  renderCategories() {
    return this.categories
      .map(
        (item) =>
          `<li>
            <button class="category" data-title="${item.title}">
              <category-icon data-category="${item.title}" style="--ri: 2;"></category-icon>
              <span class="category-name">${item.title}</span>
            </button>
          </li>`
      )
      .join("");
  }

  render() {
    this.shadow.innerHTML = `
    <style>
      ${css}
    </style>
    <article class="quiz-menu">
      <h1><span>Welcome to the</span> <strong>Frontend Quiz!</strong></h1>
      <p>Pick a subject to get started.</p>
      <ul class="category-list">
      ${this.renderCategories()}
      </ul>
    </article>
    `;
  }

  getQuestionsByCategory(category) {
    const questionsList = this.categories.find(
      (item) =>
        item.title.toLowerCase() === store.selectedCategory.toLowerCase()
    ).questions;
    return randomizeList(questionsList);
  }

  _handleCategorySelection(item) {
    store.selectedCategory = item.dataset.title;
    store.questions = this.getQuestionsByCategory(store.selectedCategory);
    const pathname = getAbsolutePath("question-page", {
      category: store.selectedCategory,
      id: store.currentQuestionIndex + 1,
    });
    const state = StateManager.getQuestionPageState(store);
    navigateTo(pathname, state);
  }

  handleCategoryClick() {
    this.categoryElements = this.shadow.querySelectorAll(".category");
    this.categoryElements.forEach((item) => {
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this._handleCategorySelection(e.currentTarget);
      });

      item.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
          this._handleCategorySelection(e.currentTarget);
        }
      });
    });
  }
}
