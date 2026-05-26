import {prompt as promptWithInquirer} from 'inquirer';

import questionHasDecision from './question-has-decision.js';
import enhancePredicate from './predicate-enhancer.js';

export default async function prompt(questions, decisions) {
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

  return {...0 < filteredQuestions.length && await promptWithInquirer(filteredQuestions), ...providedAnswers};
}
