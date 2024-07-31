import store from "../../store/store";
import { navigateTo, replaceState, navigateByReplace } from "../../history";
import { escapeHtml, randomizeList, getAbsolutePath } from "../../utils";
import StateManager from "../../store/state_manager";
import css from "./Question.css?inline";
import ErrorIcon from "../../../images/icon-error.svg";

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
      this.quizForm = this.querySelector("#quiz-form");
      this.errorMessageBlockEl = this.querySelector(".error-message-block");
      this.handleOptionClick(this.quizForm, this.errorMessageBlockEl);
      this.handleFormSubmit(this.quizForm, this.errorMessageBlockEl);
    } else {
      navigateTo(getAbsolutePath("home-page"));
    }
  }

  renderOptions() {
    return this.currentQuestion.options
      .map(
        (option, index) =>
          `<label for="option-${index}">
            <input
              type="radio"
              id="option-${index}"
              name="quiz-answer"
              value="${escapeHtml(option)}"
            />
            <option-item data-id="${index}" data-value="${option}"></option-item>
          </label>
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
        <input type="submit" class="primary-btn" value="Submit answer" />
      </form>
      <button type="button" class="primary-btn" id="next-btn" hidden>Next Question</button>
      <div class="error-message-block hidden">
        <div class="error-icon-wrapper">
          <img src="${ErrorIcon}" alt="Error Icon" />
        </div>
        <p class="error-message">Please select an answer</p>
      </div>
    </article>
    `;
  }

  rehydrateStore(state) {
    store.score = state.score;
    store.currentQuestionIndex = state.currentQuestionIndex;
    store.questions = state.questions;
    store.selectedCategory = state.category;
  }

  validateForm(data, errorMessageBlockEl) {
    if (Object.keys(data).length === 0) {
      errorMessageBlockEl.classList.remove("hidden");
      return false;
    }
    return true;
  }

  getOptionStatusList(selectedAnswer) {
    const optionStatusList = [];
    for (const option of this.currentQuestion.options) {
      if (option === this.currentQuestion.answer) {
        optionStatusList.push("correct");
      } else {
        if (option === selectedAnswer) {
          optionStatusList.push("incorect");
        } else {
          optionStatusList.push(null);
        }
      }
    }
    return optionStatusList;
  }

  highlightCorrectAnswer(optionItems, selectedAnswer) {
    const optionStatusList = this.getOptionStatusList(selectedAnswer);
    Array.from(optionItems).forEach((optionItem, index) => {
      if (optionStatusList[index] === "correct") {
        optionItem.correct = true;
      } else {
        optionItem.correct = false;
      }
    });
  }

  highlightIncorrectAnswer(optionItems, selectedAnswer) {
    const optionStatusList = this.getOptionStatusList(selectedAnswer);
    Array.from(optionItems).forEach((optionItem, index) => {
      if (optionStatusList[index] === "correct") {
        optionItem.showCorrect = true;
      } else if (optionStatusList[index] === "incorect") {
        optionItem.incorrect = true;
      }
    });
  }

  disableForm(quizForm) {
    quizForm.querySelector("input[type=submit]").disabled = true;
    for (const option of quizForm.querySelectorAll("input[type=radio]")) {
      option.checked = false;
      option.disabled = true;
    }
  }

  checkAnswer(quizForm, data) {
    const selectedAnswer = data["quiz-answer"];
    const OptionItems = quizForm.querySelectorAll("option-item");
    if (selectedAnswer === this.currentQuestion.answer) {
      store.score += 1;
      this.highlightCorrectAnswer(OptionItems, selectedAnswer);
    } else {
      this.highlightIncorrectAnswer(OptionItems, selectedAnswer);
    }
    this.disableForm(quizForm);
  }

  handleOptionClick(quizForm, errorMessageBlockEl) {
    const radioInputs = quizForm.querySelectorAll("input[type=radio]");
    Array.from(radioInputs).forEach((radioInput) => {
      radioInput.addEventListener("click", (e) => {
        errorMessageBlockEl.classList.add("hidden");
      });
    });
  }

  handleFormSubmit(quizForm, errorMessageBlockEl) {
    const nextBtn = this.querySelector("#next-btn");
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = e.target.querySelector("input[type=submit]");
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      if (!this.validateForm(data, errorMessageBlockEl)) {
        return;
      }
      errorMessageBlockEl.classList.add("hidden");
      this.checkAnswer(quizForm, data);
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
