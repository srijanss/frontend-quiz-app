import data from "../../data.json" assert { type: "json" };

class Store {
  constructor() {
    this._baseURL = import.meta.env.BASE_URL;
    this._categories = data.quizzes;
    this._selectedCategory = null;
    this._questions = [];
    this._currentQuestionIndex = 0;
    this._score = 0;
  }

  get baseURL() {
    return this._baseURL;
  }

  get categories() {
    return this._categories;
  }

  get selectedCategory() {
    return this._selectedCategory;
  }

  set selectedCategory(category) {
    this._selectedCategory = category;
  }

  get questions() {
    return this._questions;
  }

  setQuestions(categoryTitle) {
    const questionsList = this._categories.find(
      (item) => item.title.toLowerCase() === categoryTitle
    ).questions;
    this._questions = questionsList.sort(() => Math.random() - 0.5);
  }

  get currentQuestionIndex() {
    return this._currentQuestionIndex;
  }

  set currentQuestionIndex(index) {
    this._currentQuestionIndex = index;
  }

  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value;
  }

  reset() {
    this._selectedCategory = null;
    this._questions = [];
    this._currentQuestionIndex = 0;
    this._score = 0;
  }
}

const storeSingleton = new Store();
export default storeSingleton;
