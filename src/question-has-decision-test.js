import {assert} from 'chai';
import any from '@travi/any';
import questionHasDecision from './question-has-decision';

suite('question has decision', () => {
  const questionName = any.word();

  test('that `false` is returned when no decision is defined', () => {
    assert.isFalse(questionHasDecision(any.word(), any.simpleObject()));
  });

  test('that `true` is returned for a string value decision', () => {
    assert.isTrue(questionHasDecision(questionName, {...any.simpleObject(), [questionName]: any.word()}));
  });

  test('that `true` is returned for a `true` boolean value decision', () => {
    assert.isTrue(questionHasDecision(questionName, {...any.simpleObject(), [questionName]: true}));
  });

  test('that `true` is returned for a `false` boolean value decision', () => {
    assert.isTrue(questionHasDecision(questionName, {...any.simpleObject(), [questionName]: false}));
  });
});
