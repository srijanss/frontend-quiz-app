import css from "./ToggleSwitch.css?inline";
import MoonDarkIcon from "../../../images/icon-moon-dark.svg";
import MoonLightIcon from "../../../images/icon-moon-light.svg";
import SunDarkIcon from "../../../images/icon-sun-dark.svg";
import SunLightIcon from "../../../images/icon-sun-light.svg";
import StateManager from "../../store/state_manager";
import store from "../../store/store";

export class ToggleSwitch extends HTMLElement {
  constructor() {
    super();
    this.root = document.documentElement;
    this.mode = this.getAttribute("data-mode");
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleModeChange();
  }

  handleModeChange() {
    const checkbox = this.shadow.getElementById("mode-change");
    checkbox.addEventListener("change", () => StateManager.toggleMode(store));
    checkbox.addEventListener("click", (e) => {
      // e.preventDefault();
      checkbox.blur();
    });
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <div class="toggle-switch-block">
        <div class="light-mode-icon">
          <img src="${
            this.mode ? SunDarkIcon : SunLightIcon
          }" alt="Light Icon" />
        </div>
        <label for="mode-change">
          <input type="checkbox" id="mode-change" ${
            this.mode ? "checked" : ""
          }/>
          <div class="toggle-switch"></div>
        </label>
        <div class="dark-mode-icon">
          <img src="${
            this.mode ? MoonDarkIcon : MoonLightIcon
          }" alt="Dark Icon" />
        </div>
      </div>
      `;
  }
}
