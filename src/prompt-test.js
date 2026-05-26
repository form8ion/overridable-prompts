import inquirer from 'inquirer';

import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as decisionFinder from './question-has-decision.js';
import * as predicateEnhancer from './predicate-enhancer.js';
import prompt from './prompt.js';

suite('prompt', () => {
  let sandbox;
  const answers = any.simpleObject();
  const questions = any.listOf(() => ({
    ...any.simpleObject(),
    name: any.word()
  }));
  const questionNames = any.listOf(any.word);
  const decisions = any.objectWithKeys(questionNames);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(decisionFinder, 'default');
    sandbox.stub(predicateEnhancer, 'default');

    decisionFinder.default.returns(false);
  });

  teardown(() => sandbox.restore());

  test('that details are passed to inquirer', async () => {
    inquirer.prompt.withArgs(questions).resolves(answers);

    assert.deepEqual(await prompt(questions), answers);
  });

  test('that decisions are provided to the defined predicates', async () => {
    const predicates = questions.map(() => () => undefined);
    const enhancedPredicates = questions.map(() => () => undefined);
    const questionsWithPredicates = questions.map((question, index) => ({...question, when: predicates[index]}));
    const questionsWithEnhancedPredicates = questions
      .map((question, index) => ({...question, when: enhancedPredicates[index]}));
    questionsWithPredicates.forEach(
      (question, index) => predicateEnhancer.default
        .withArgs(predicates[index], decisions)
        .returns(enhancedPredicates[index])
    );
    inquirer.prompt.withArgs(questionsWithEnhancedPredicates).resolves(answers);

    assert.deepEqual(await prompt(questionsWithPredicates, decisions), answers);
  });

  test('that decisions are directly included in answers, with those questions excluded from prompts', async () => {
    inquirer.prompt.withArgs(questions).resolves(answers);
    questionNames.forEach(name => decisionFinder.default.withArgs(name, decisions).returns(true));

    assert.deepEqual(
      await prompt([...questions, ...questionNames.map(name => ({...any.simpleObject(), name}))], decisions),
      {...answers, ...decisions}
    );
  });

  test('that inquirer is not invoked if all questions have decisions provided', async () => {
    questionNames.forEach(name => decisionFinder.default.withArgs(name, decisions).returns(true));

    assert.deepEqual(await prompt(questionNames.map(name => ({...any.simpleObject(), name})), decisions), decisions);
    assert.notCalled(inquirer.prompt);
  });

  test('that a provided answer that fails validation with an explicit message throws that error', async () => {
    const validationErrorMessage = any.word();
    const questionName = any.word();
    const invalidAnswer = any.word();
    const validate = sinon.stub().withArgs(invalidAnswer).returns(validationErrorMessage);
    const questionsWithValidation = [{
      ...any.simpleObject(),
      name: questionName,
      validate
    }];
    const decisionsWithAnswer = {[questionName]: invalidAnswer};

    decisionFinder.default.withArgs(questionName, decisionsWithAnswer).returns(true);

    try {
      await prompt(questionsWithValidation, decisionsWithAnswer);
      assert.fail('Expected prompt to throw for invalid provided answer');
    } catch (error) {
      assert.equal(error.message, validationErrorMessage);
    }
  });

  test('that a provided answer that fails async predicate validation throws a default error', async () => {
    const questionName = any.word();
    const invalidAnswer = any.word();
    const questionsWithValidation = [{
      ...any.simpleObject(),
      name: questionName,
      validate: sinon.stub().resolves(false)
    }];
    const decisionsWithAnswer = {[questionName]: invalidAnswer};

    decisionFinder.default.withArgs(questionName, decisionsWithAnswer).returns(true);

    try {
      await prompt(questionsWithValidation, decisionsWithAnswer);
      assert.fail('Expected prompt to throw for invalid provided answer');
    } catch (error) {
      assert.equal(error.message, `Invalid value "${invalidAnswer}" provided for question "${questionName}"`);
    }
  });

  test('that a provided answer that passes predicate validation is accepted', async () => {
    const questionName = any.word();
    const validAnswer = any.word();
    const questionsWithValidation = [{
      ...any.simpleObject(),
      name: questionName,
      validate: sinon.stub().resolves(true)
    }];
    const decisionsWithAnswer = {[questionName]: validAnswer};

    decisionFinder.default.withArgs(questionName, decisionsWithAnswer).returns(true);

    assert.deepEqual(await prompt(questionsWithValidation, decisionsWithAnswer), decisionsWithAnswer);
  });
});
