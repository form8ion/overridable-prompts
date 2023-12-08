// #### Import
import {prompt} from './lib/index.cjs.js';

// #### Execute

// remark-usage-ignore-next 2
(async function () {
// eslint-disable-next-line no-unused-vars
  const answers = await prompt(
    [
      {
        name: 'Question #1',
        message: 'What should we ask first?'
      },
      {
        name: 'Question #2',
        message: 'What should we ask second?',
        when: answerList => 'Provided answer for `Question #1`' === answerList['Question #1']
      }
    ],
    {
      'Question #1': 'Provided answer for `Question #1`',
      'Question #2': 'Provided answer for `Question #2`'
    }
  );
// remark-usage-ignore-next
}());
