export default function questionHasDecision(questionName, decisions = {}) {
  return undefined !== decisions[questionName];
}
