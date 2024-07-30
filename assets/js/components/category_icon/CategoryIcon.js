import css from "./CategoryIcon.css?inline";
import HtmlIcon from "../../../images/icon-html.svg";
import CssIcon from "../../../images/icon-css.svg";
import JsIcon from "../../../images/icon-js.svg";
import A11yIcon from "../../../images/icon-accessibility.svg";
import store from "../../store/store";

export class CategoryIcon extends HTMLElement {
  constructor() {
    super();
    this.categories = {
      html: { icon: HtmlIcon, class: "html" },
      css: { icon: CssIcon, class: "css" },
      javascript: { icon: JsIcon, class: "js" },
      accessibility: { icon: A11yIcon, class: "a11y" },
    };
    this.category = this.getCategory();
    this.categoryIcon = this.getCategoryIcon(this.category.toLowerCase());
    store.subscribe((data) => this.update(data));
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  getCategory() {
    const categoryData = this.getAttribute("data-category");
    if (categoryData) {
      return categoryData.toLowerCase();
    }

    return store.selectedCategory ? store.selectedCategory.toLowerCase() : "";
  }

  getCategoryIcon(categoryName) {
    return this.categories[categoryName]
      ? this.categories[categoryName].icon
      : "";
  }

  getCategoryClass(categoryName) {
    return this.categories[categoryName]
      ? this.categories[categoryName].class
      : "";
  }

  update(data) {
    this.category = data.selectedCategory;
    if (!this.category) {
      this.categoryIcon = "";
      const categoryIconWrapper = this.shadow.querySelector(
        ".category-icon-wrapper"
      );
      if (categoryIconWrapper) {
        categoryIconWrapper.setAttribute("style", "visibility: hidden");
      }
      return;
    }
    this.categoryIcon = this.getCategoryIcon(this.category.toLowerCase());
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
    <style>
      ${css}
    </style>
    <div class="category-icon-wrapper ${this.getCategoryClass(
      this.category.toLowerCase()
    )}">
      <img src="${this.categoryIcon}" alt="${this.category}" />
    </div>
    `;
  }
}
