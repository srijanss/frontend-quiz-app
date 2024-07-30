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
}
