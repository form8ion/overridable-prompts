import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import enhancePredicate from './predicate-enhancer';

suite('predicate enhancer', () => {
  test('that the decisions and answers get merged', () => {
    const predicate = sinon.stub();
    const answers = any.simpleObject();
    const decisions = any.simpleObject();
    const result = any.boolean();
    predicate.withArgs({...answers, ...decisions}).returns(result);

    assert.equal(enhancePredicate(predicate, decisions)(answers), result);
  });
});
