import {prompt} from 'inquirer';

export default async function (questions, decisions = {}) {
  const {filteredQuestions, providedAnswers} = questions.reduce((acc, question) => {
    if (undefined !== decisions[question.name]) {
      return {
        filteredQuestions: acc.filteredQuestions,
        providedAnswers: {...acc.providedAnswers, [question.name]: decisions[question.name]}
      };
    }

    return {
      filteredQuestions: [...acc.filteredQuestions, question],
      providedAnswers: acc.providedAnswers
    };
  }, {filteredQuestions: [], providedAnswers: {}});

  return {...await prompt(filteredQuestions), ...providedAnswers};
}
