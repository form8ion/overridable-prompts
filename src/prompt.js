import {prompt} from 'inquirer';
import questionHasDecision from './question-has-decision';
import enhancePredicate from './predicate-enhancer';

export default async function (questions, decisions) {
  const {
    filteredQuestions,
    providedAnswers
  } = questions
    .map(question => ({...question, ...question.when && {when: enhancePredicate(question.when, decisions)}}))
    .reduce((acc, question) => {
      if (questionHasDecision(question.name, decisions)) {
        return {
          filteredQuestions: acc.filteredQuestions,
          providedAnswers: {
            ...acc.providedAnswers,
            [question.name]: decisions[question.name]
          }
        };
      }

      return {
        filteredQuestions: [...acc.filteredQuestions, question],
        providedAnswers: acc.providedAnswers
      };
    }, {
      filteredQuestions: [],
      providedAnswers: {}
    });

  return {...0 < filteredQuestions.length && await prompt(filteredQuestions), ...providedAnswers};
}
