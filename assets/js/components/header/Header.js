import store from "../../store/store";
import css from "./Header.css?inline";

export class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.root = document.documentElement;
    this.categoryName = "";
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    store.subscribe((data) => this.update(data));
    this.handleSystemDefaultMode();
    this.handleRender();
  }
  update(data) {
    this.categoryName = this.getSelectedCategory(data.selectedCategory);
    this.handleRender();
  }

  handleRender() {
    this.render();
    this.handleModeChange();
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
    } else {
      this.root.classList.remove("dark-mode");
    }
  }

  handleModeChange() {
    const checkbox = this.shadow.getElementById("mode-change");
    checkbox.addEventListener("change", () => this.toggleMode());
  }

  toggleMode() {
    console.log("toggleMode");
    if (this.root.classList.contains("dark-mode")) {
      this.root.classList.remove("dark-mode");
    } else {
      this.root.classList.add("dark-mode");
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
      <input id="mode-change" type="checkbox" />
    </header>
    `;
  }
}
