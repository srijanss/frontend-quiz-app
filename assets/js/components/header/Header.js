import store from "../../store/store";
import css from "./Header.css?inline";

export class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.root = document.documentElement;
    this.categoryName = "";
    this.mode = {
      "light-mode": 0,
      "dark-mode": 1,
    };
    this.currentMode = this.mode["light-mode"];
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    store.subscribe((data) => this.update(data));
    this.handleSystemDefaultMode();
    this.render();
  }
  update(data) {
    this.categoryName = this.getSelectedCategory(data.selectedCategory);
    this.render();
  }

  getSelectedCategory(categoryName) {
    return categoryName || "";
  }

  handleSystemDefaultMode() {
    const currentMode = getComputedStyle(this.root).getPropertyValue(
      "--style-mode"
    );
    if (currentMode) {
      this.root.classList.add("dark-mode");
      this.currentMode = this.mode["dark-mode"];
    } else {
      this.root.classList.remove("dark-mode");
      this.currentMode = this.mode["light-mode"];
    }
  }

  render() {
    this.shadow.innerHTML = `
    <style>
      ${css} 
    </style>
    <header>
      <div class="category-block">
        <category-icon></category-icon>
        <span class="category-name">${this.categoryName}</span>
      </div>
      <toggle-switch data-mode="${this.currentMode}"></toggle-switch>
    </header>
    `;
  }
}
