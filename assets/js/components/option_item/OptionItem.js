import css from "./OptionItem.css?inline";
import { escapeHtml } from "../../utils";
import CorrectIcon from "../../../images/icon-correct.svg";
import InCorrectIcon from "../../../images/icon-incorrect.svg";

export class OptionItemComponent extends HTMLElement {
  constructor() {
    super();
    this.optionID = this.getAttribute("data-id");
    this.optionValue = this.getAttribute("data-value");
    this.optionsLabels = ["A", "B", "C", "D"];
    this._internals = this.attachInternals();
  }

  get correct() {
    return this._internals.states.has("correct");
  }

  set correct(flag) {
    if (flag) {
      this._internals.states.add("correct");
    } else {
      this._internals.states.delete("correct");
    }
  }

  get incorrect() {
    return this._internals.states.has("incorrect");
  }

  set incorrect(flag) {
    if (flag) {
      this._internals.states.add("incorrect");
    } else {
      this._internals.states.delete("incorrect");
    }
  }

  get showCorrect() {
    return this._internals.states.has("show-correct");
  }

  set showCorrect(flag) {
    if (flag) {
      this._internals.states.add("show-correct");
    }
  }

  setSelected() {
    const optionItem = this.shadow.querySelector(".option-item");
    optionItem.classList.add("selected");
  }
  removeSelected() {
    const optionItem = this.shadow.querySelector(".option-item");
    optionItem.classList.remove("selected");
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  getOptionLabel(id) {
    try {
      return this.optionsLabels[id];
    } catch {
      return "-";
    }
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <div class="option-item">
        <div class="option-icon-wrapper">
          ${this.getOptionLabel(this.optionID)}
        </div>
        <p class="option-value">${escapeHtml(this.optionValue)}</p>
        <div class="option-status">
          <img src="${CorrectIcon}" alt="Correct Icon" class="correct-icon" hidden />
          <img src="${InCorrectIcon}" alt="InCorrect Icon" class="incorrect-icon" hidden />
        </div>
      </div>
    `;
  }
}
