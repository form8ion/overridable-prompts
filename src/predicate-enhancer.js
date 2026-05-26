export default function enhancePredicate(predicate, decisions) {
  return answers => predicate({...answers, ...decisions});
}
