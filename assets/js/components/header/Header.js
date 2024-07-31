import store from "../../store/store";
import css from "./Header.css?inline";
import StateManager from "../../store/state_manager";

export class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.categoryName = "";
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    store.subscribe((data) => this.update(data));
    StateManager.handleSystemDefaultMode(store);
    this.render();
  }
  update(data) {
    this.categoryName = this.getSelectedCategory(data.selectedCategory);
    this.render();
  }

  getSelectedCategory(categoryName) {
    return categoryName || "";
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
      <toggle-switch data-mode="${store.currentMode}"></toggle-switch>
    </header>
    `;
  }
}
