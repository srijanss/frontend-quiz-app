export default class StateManager {
  static getQuestionPageState(store) {
    return {
      category: store.selectedCategory,
      qid: store.currentQuestionIndex + 1,
      currentQuestion: store.questions[store.currentQuestionIndex],
      score: store.score,
      questions: store.questions,
      currentQuestionIndex: store.currentQuestionIndex,
    };
  }

  static getScorePageState(store) {
    return {
      category: store.selectedCategory,
      score: store.score,
    };
  }

  static handleSystemDefaultMode(store) {
    const root = document.documentElement;
    const systemDefaultMode =
      getComputedStyle(root).getPropertyValue("--system-mode");
    if (systemDefaultMode) {
      root.classList.add("dark-mode");
      store.currentMode = store.mode["dark-mode"];
    } else {
      root.classList.remove("dark-mode");
      store.currentMode = store.mode["light-mode"];
    }
  }

  static toggleMode(store) {
    const root = document.documentElement;
    if (store.currentMode === store.mode["light-mode"]) {
      root.classList.add("dark-mode");
      store.currentMode = store.mode["dark-mode"];
    } else {
      root.classList.remove("dark-mode");
      store.currentMode = store.mode["light-mode"];
    }
  }
}
