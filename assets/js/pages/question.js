export default (categoryName, questionID) =>
  `<question-component
    data-category="${categoryName}"
    data-qid="${questionID}">
  </question-component>`;
