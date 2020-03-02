import inquirer from 'inquirer';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as decisionFinder from './question-has-decision';
import prompt from './prompt';

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

    decisionFinder.default.returns(false);
  });

  teardown(() => sandbox.restore());

  test('that details are passed to inquirer', async () => {
    inquirer.prompt.withArgs(questions).resolves(answers);

    assert.deepEqual(await prompt(questions), answers);
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
});
