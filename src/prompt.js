import {prompt as promptWithInquirer} from 'inquirer';

import questionHasDecision from './question-has-decision.js';
import enhancePredicate from './predicate-enhancer.js';

async function ensureProvidedAnswerIsValid(question, answer) {
  if (!question.validate) return;

  const validationResult = await question.validate(answer);

  if (true === validationResult) return;

  if ('string' === typeof validationResult) {
    throw new Error(validationResult);
  }

  throw new Error(`Invalid value "${answer}" provided for question "${question.name}"`);
}

export default async function prompt(questions, decisions) {
  const {filteredQuestions, providedAnswers} = await questions
    .map(questionToEnhance => ({
      ...questionToEnhance,
      ...questionToEnhance.when && {when: enhancePredicate(questionToEnhance.when, decisions)}
    }))
    .reduce(async (accPromise, question) => {
      const acc = await accPromise;

      if (questionHasDecision(question.name, decisions)) {
        const answer = decisions[question.name];

        await ensureProvidedAnswerIsValid(question, answer);

        acc.providedAnswers[question.name] = answer;

        return acc;
      }

      acc.filteredQuestions.push(question);

      return acc;
    }, Promise.resolve({
      filteredQuestions: [],
      providedAnswers: {}
    }));

  return {...0 < filteredQuestions.length && await promptWithInquirer(filteredQuestions), ...providedAnswers};
}
