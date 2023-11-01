export function getConversationPairs(records) {
  const pairs = []
  for (const record of records) {
    pairs.push({ question: record.question, answer: record.answer })
  }
  return pairs
}
