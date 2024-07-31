import store from "../../store/store";
import { navigateTo, replaceState, navigateByReplace } from "../../history";
import { escapeHtml, randomizeList, getAbsolutePath } from "../../utils";
import StateManager from "../../store/state_manager";
import css from "./Question.css?inline";

export class QuestionComponent extends HTMLElement {
  connectedCallback() {
    this.category = this.getAttribute("data-category");
    this.questionID = this.getAttribute("data-qid");
    this.historyState = history.state;
    if (this.historyState && Object.keys(this.historyState).length > 0) {
      if (store.questions.length === 0) {
        this.rehydrateStore(this.historyState);
      }
      this.currentQuestion = this.historyState.currentQuestion;
      this.currentQuestion.options = randomizeList(
        this.currentQuestion.options
      );
      this.render();
      this.handleFormSubmit();
    } else {
      navigateTo(getAbsolutePath("home-page"));
    }
  }

  renderOptions() {
    return this.currentQuestion.options
      .map(
        (option, index) =>
          `
          <input
            type="radio"
            id="option-${index}"
            name="quiz-answer"
            value="${escapeHtml(option)}"
          />
          <label for="option-${index}">${escapeHtml(option)}</label>
      `
      )
      .join("");
  }

  render() {
    this.innerHTML = `
    <style>
      ${css}
    </style>
    <article class="question-container">
      <p>Question ${this.questionID} of ${store.questions.length}</p>
      <h1>${escapeHtml(this.currentQuestion.question)}</h1>
      <progress-bar data-max="${store.questions.length}" data-value="${
      this.questionID
    }"></progress-bar>
      <form id="quiz-form">
        <fieldset>
          <legend>Select anser:</legend>
          ${this.renderOptions()} 
        </fieldset>
        <input type="submit" value="Submit answer" />
      </form>
      <button type="button" id="next-btn" hidden>Next Question</button>
      <p class="error-message" hidden>Please select an answer</p>
    </article>
    `;
  }

  rehydrateStore(state) {
    store.score = state.score;
    store.currentQuestionIndex = state.currentQuestionIndex;
    store.questions = state.questions;
    store.selectedCategory = state.category;
  }

  validateForm(data, errorMessageEl) {
    // Check if data is empty object
    if (Object.keys(data).length === 0) {
      errorMessageEl.hidden = false;
      return false;
    }
    return true;
  }

  handleFormSubmit() {
    const quizForm = this.querySelector("#quiz-form");
    const nextBtn = this.querySelector("#next-btn");
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = e.target.querySelector("input[type=submit]");
      const errorMessageEl = this.querySelector(".error-message");
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      if (!this.validateForm(data, errorMessageEl)) {
        return;
      }
      errorMessageEl.hidden = true;
      if (data["quiz-answer"] === this.currentQuestion.answer) {
        store.score += 1;
      }
      store.currentQuestionIndex += 1;
      submitBtn.hidden = true;
      nextBtn.hidden = false;
      this.handleNextButtonClick(nextBtn);
    });
  }

  handleNextButtonClick(nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      if (store.currentQuestionIndex < store.questions.length) {
        const pathname = getAbsolutePath("question-page", {
          category: this.category,
          id: store.currentQuestionIndex + 1,
        });
        const newState = StateManager.getQuestionPageState(store);
        navigateByReplace(pathname, newState);
      } else {
        replaceState(window.location.pathname, null);
        const scorePagePath = getAbsolutePath("score-page", {
          category: this.category,
        });
        navigateTo(scorePagePath, StateManager.getScorePageState(store));
      }
    });
  }
}
