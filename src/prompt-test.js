import inquirer from 'inquirer';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import prompt from './prompt';

suite('prompt', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(inquirer, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that details are passed to inquirer', async () => {
    const answers = any.simpleObject();
    const questions = any.listOf(any.simpleObject);
    inquirer.prompt.withArgs(questions).resolves(answers);

    assert.equal(await prompt(questions), answers);
  });
});
