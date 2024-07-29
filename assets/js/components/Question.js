import store from "../store";
import { navigateTo, replaceState } from "../history";
import { escapeHtml, randomizeList } from "../utils";

export class QuestionComponent extends HTMLElement {
  connectedCallback() {
    this.category = this.getAttribute("data-category");
    this.questionID = this.getAttribute("data-qid");
    const state = history.state;
    console.log(state);
    if (state && Object.keys(state).length > 0) {
      if (store.questions.length === 0) {
        this.rehydrateStore(state);
      }
      this.currentQuestion = state.currentQuestion;
      this.currentQuestion.options = randomizeList(
        this.currentQuestion.options
      );
      this.render();
      this.quizForm = this.querySelector("#quiz-form");
      this.quizForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        // Add validation
        if (data["quiz-answer"] === this.currentQuestion.answer) {
          store.score += 1;
        }
        store.currentQuestionIndex += 1;
        if (store.currentQuestionIndex < store.questions.length) {
          let pathname = window.location.pathname;
          pathname = `${pathname.split("/").slice(0, -2).join("/")}/${
            store.currentQuestionIndex + 1
          }/`;
          const newState = state;
          newState.qid = store.currentQuestionIndex + 1;
          newState.currentQuestion =
            store.questions[store.currentQuestionIndex];
          newState.score = store.score;
          newState.currentQuestionIndex = store.currentQuestionIndex;
          replaceState(window.location.pathname, null);
          navigateTo(pathname, newState);
        } else {
          replaceState(window.location.pathname, null);
          const scorePagePath = `${store.baseURL}${this.category}/score/`;
          navigateTo(scorePagePath, {
            category: this.category,
            score: store.score,
          });
        }
      });
    } else {
      navigateTo(`${store.baseURL}`);
    }
  }

  rehydrateStore(state) {
    store.score = state.score;
    store.currentQuestionIndex = state.currentQuestionIndex;
    store.questions = state.questions;
    store.selectedCategory = state.category;
  }

  render() {
    this.innerHTML = `
      <h1>${escapeHtml(this.currentQuestion.question)}</h1>
      <form id="quiz-form">
        <fieldset>
          <legend>Select anser:</legend>
          ${this.renderOptions()} 
        </fieldset>
        <input type="submit" value="Submit" />
      </form>
    `;
  }

  renderOptions() {
    return this.currentQuestion.options
      .map(
        (option, index) =>
          `
        <div>
          <input
            type="radio"
            id="option-${index}"
            name="quiz-answer"
            value="${escapeHtml(option)}"
          />
          <label for="option-${index}">${escapeHtml(option)}</label>
        </div>
      `
      )
      .join("");
  }
}
