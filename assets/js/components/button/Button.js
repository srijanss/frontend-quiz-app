import css from "./Button.css?inline";

export class ButtonComponent extends HTMLElement {
  constructor() {
    super();
    this.text = this.getAttribute("data-text");
    this.type = this.getAttribute("data-type");
  }

  set onClick(callback) {
    this._onClick = callback;
  }

  setFocus() {
    const button = this.shadow.querySelector("button");
    button.focus();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleButtonClick();
  }

  handleButtonClick() {
    const button = this.shadow.querySelector("button");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (this._onClick) {
        this._onClick(e);
      }
    });
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <button class="primary-btn type="${this.type}"><slot></slot></button>
    `;
  }
}
