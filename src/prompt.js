import {prompt} from 'inquirer';
import questionHasDecision from './question-has-decision';

export default async function (questions, decisions = {}) {
  const {filteredQuestions, providedAnswers} = questions.reduce((acc, question) => {
    if (questionHasDecision(question.name, decisions)) {
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
