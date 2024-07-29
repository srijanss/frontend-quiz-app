import store from "../store";
import { navigateTo } from "../history";
import { getAbsolutePath, randomizeList } from "../utils";

export class CategoryListComponent extends HTMLElement {
  connectedCallback() {
    store.reset();
    this.categories = store.categories;
    this.render();
    this.categoryElements = this.querySelectorAll(".category");
    this.categoryElements.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        store.selectedCategory = item.dataset.title;
        this.randomizeQuestions(item.dataset.title);
        const pathname = new URL(e.currentTarget.href).pathname;
        const state = {
          category: item.dataset.title,
          qid: store.currentQuestionIndex + 1,
          currentQuestion: store.questions[store.currentQuestionIndex],
          score: store.score,
          questions: store.questions,
          currentQuestionIndex: store.currentQuestionIndex,
        };
        navigateTo(pathname, state);
      });
    });
  }

  randomizeQuestions(categoryTitle) {
    const questionsList = this.categories.find(
      (item) => item.title.toLowerCase() === categoryTitle
    ).questions;
    store.questions = randomizeList(questionsList);
  }

  render() {
    this.innerHTML = `
    <div>
      <h1>Categories</h1>
      ${this.renderCategories()}
    </div>
    `;
  }

  renderCategories() {
    try {
      return this.categories
        .map(
          (item) =>
            `<div>
              <a class="category" data-title="${item.title.toLowerCase()}" href="${getAbsolutePath(
              "question-page",
              { category: item.title.toLowerCase(), id: 1 }
            )}">
                <img src="${item.icon}" alt="${item.title}" />
                ${item.title}
              </a>
            </div>`
        )
        .join("");
    } catch {
      navigateTo(getAbsolutePath("home-page"));
    }
  }
}
