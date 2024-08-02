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

  set onKeyDown(callback) {
    this._onKeyDown = callback;
  }

  setFocus() {
    const button = this.shadow.querySelector("button");
    button.focus();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleButtonClick();
    this.handleKeyDown();
  }

  handleButtonClick() {
    const button = this.shadow.querySelector("button");
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (this._onClick) {
        this._onClick(e);
      }
    });
  }

  handleKeyDown() {
    const button = this.shadow.querySelector("button");
    button.addEventListener("keydown", (e) => {
      if (this._onKeyDown && e.code === "Space") {
        this._onKeyDown(e);
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
