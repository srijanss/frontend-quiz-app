import css from "./ProgressBar.css?inline";

export class ProgressBarComponent extends HTMLElement {
  constructor() {
    super();
    this.maxValue = this.getAttribute("data-max");
    this.currentValue = this.getAttribute("data-value");
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <label for="quiz-progress" hidden>Quiz Progress</label>
      <progress id="quiz-progress" max="${this.maxValue}" value="${this.currentValue}"></progress>
    `;
  }
}
