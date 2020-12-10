export default function (predicate, decisions) {
  return answers => predicate({...answers, ...decisions});
}
