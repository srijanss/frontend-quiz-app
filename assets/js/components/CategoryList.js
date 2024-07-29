import store from "../store";
import { navigateTo } from "../history";

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
        store.setQuestions(item.dataset.title);
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

  render() {
    this.innerHTML = `
    <div>
      <h1>Categories</h1>
      ${this.renderCategories()}
    </div>
    `;
  }

  renderCategories() {
    return this.categories
      .map(
        (category) =>
          `<div>
            <a class="category" data-title="${category.title.toLowerCase()}" href="/${category.title.toLowerCase()}/question/${
            store.currentQuestionIndex + 1
          }/">
              <img src="${category.icon}" alt="${category.title}" />
              ${category.title}
            </a>
          </div>`
      )
      .join("");
  }
}
