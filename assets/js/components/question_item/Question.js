import store from "../../store/store";
import { navigateTo, replaceState, navigateByReplace } from "../../history";
import { escapeHtml, randomizeList, getAbsolutePath } from "../../utils";
import StateManager from "../../store/state_manager";
import css from "./Question.css?inline";
import ErrorIcon from "../../../images/icon-error.svg";

export class QuestionComponent extends HTMLElement {
  constructor() {
    super();
    this.category = this.getAttribute("data-category");
    this.questionID = this.getAttribute("data-qid");
  }

  connectedCallback() {
    this.historyState = history.state;
    if (this.historyState && Object.keys(this.historyState).length > 0) {
      if (store.questions.length === 0) {
        this.rehydrateStore(this.historyState);
      }
      this.currentQuestion = this.historyState.currentQuestion;
      this.currentQuestion.options = randomizeList(
        this.currentQuestion.options
      );
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
      this.quizForm = this.shadow.querySelector("#quiz-form");
      this.errorMessageBlockEl = this.shadow.querySelector(
        ".error-message-block"
      );
      this.handleOptionEvents(this.quizForm, this.errorMessageBlockEl);
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
    this.shadow.innerHTML = `
    <style>
      ${css}
    </style>
    <article class="question-container">
      <p>Question ${this.questionID} of ${store.questions.length}</p>
      <h1>${escapeHtml(this.currentQuestion.question)}</h1>
      <progress-bar data-max="${store.questions.length}" data-value="${
      this.questionID
    }"></progress-bar>
      <form id="quiz-form" name="quiz-form" novalidate>
        <fieldset>
          <legend>Select anser:</legend>
          ${this.renderOptions()} 
        </fieldset>
        <button-component id="submit-btn" data-type="submit">Submit answer</button-component>
        <button-component id="next-btn" data-type="button" hidden>Next Question</button-component>
        <div class="error-message-block hidden">
          <div class="error-icon-wrapper">
            <img src="${ErrorIcon}" alt="Error Icon" />
          </div>
          <p class="error-message">Please select an answer</p>
        </div>
      </form>
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
    quizForm.querySelector("button-component#submit-btn").disabled = true;
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

  highlightSelectedOption(radioInput) {
    const optionItems = this.shadow.querySelectorAll("option-item");
    Array.from(optionItems).forEach((item) => {
      item.removeSelected();
    });
    const optionItem = radioInput.nextElementSibling;
    optionItem.setSelected();
  }

  focusSelectedOption(radioInput) {
    const optionItems = this.shadow.querySelectorAll("option-item");
    Array.from(optionItems).forEach((item) => {
      item.removeFocus();
    });
    const optionItem = radioInput.nextElementSibling;
    optionItem.setFocus();
  }

  handleOptionEvents(quizForm, errorMessageBlockEl) {
    const radioInputs = quizForm.querySelectorAll("input[type=radio]");
    Array.from(radioInputs).forEach((radioInput) => {
      radioInput.addEventListener("click", (e) => {
        errorMessageBlockEl.classList.add("hidden");
        this.highlightSelectedOption(radioInput);
      });
      radioInput.addEventListener("focus", (e) => {
        this.focusSelectedOption(radioInput);
      });
    });
  }

  handleFormSubmit(quizForm, errorMessageBlockEl) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    const nextBtn = this.shadow.querySelector("button-component#next-btn");
    const submitBtn = this.shadow.querySelector("button-component#submit-btn");
    submitBtn.onClick = (e) => {
      e.preventDefault();
      const formData = new FormData(quizForm);
      const data = Object.fromEntries(formData.entries());
      if (!this.validateForm(data, errorMessageBlockEl)) {
        return;
      }
      errorMessageBlockEl.classList.add("hidden");
      this.checkAnswer(quizForm, data);
      store.currentQuestionIndex += 1;
      submitBtn.hidden = true;
      nextBtn.hidden = false;
      nextBtn.setFocus();
      this.handleNextButtonClick(nextBtn);
    };
    return;
  }

  handleNextButtonClick(nextBtn) {
    nextBtn.onClick = (e) => {
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
    };
  }
}
