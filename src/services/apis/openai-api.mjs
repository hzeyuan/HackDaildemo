// api version

import { Models, getUserConfig } from '../../config/index.mjs'
import { fetchSSE } from '../../utils/fetch-sse.mjs'
import { getConversationPairs } from '../../utils/get-conversation-pairs.mjs'
import { isEmpty } from 'lodash-es'
import Browser from 'webextension-polyfill'
import {
  getChatSystemPromptBase,
  getCompletionPromptBase,
  pushRecord,
  setAbortController,
} from './shared.mjs'

/**
 * @param {Browser.Runtime.Port} port
 * @param {string} question
 * @param {Session} session
 * @param {string} apiKey
 * @param {string} modelName
 */
export async function generateAnswersWithGptCompletionApi(
  port,
  question,
  session,
  apiKey,
  modelName,
) {
  const { controller, messageListener, disconnectListener } = setAbortController(port)

  const config = await getUserConfig()
  const prompt =
    (await getCompletionPromptBase()) +
    getConversationPairs(
      session.conversationRecords.slice(-config.maxConversationContextLength),
      true,
    ) +
    `Human: ${question}\nAI: `
  const apiUrl = config.customOpenAiApiUrl

  let answer = ''
  await fetchSSE(`${apiUrl}/v1/completions`, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      model: Models[modelName].value,
      stream: true,
      max_tokens: config.maxResponseTokenLength,
      temperature: config.temperature,
      stop: '\nHuman',
    }),
    onMessage(message) {
      console.debug('sse message', message)
      if (message.trim() === '[DONE]') {
        pushRecord(session, question, answer)
        console.debug('conversation history', { content: session.conversationRecords })
        port.postMessage({ answer: null, done: true, session: session })
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (error) {
        console.debug('json error', error)
        return
      }
      answer += data.choices[0].text
      port.postMessage({ answer: answer, done: false, session: null })
    },
    async onStart() {},
    async onEnd() {
      port.postMessage({ done: true })
      port.onMessage.removeListener(messageListener)
      port.onDisconnect.removeListener(disconnectListener)
    },
    async onError(resp) {
      port.onMessage.removeListener(messageListener)
      port.onDisconnect.removeListener(disconnectListener)
      if (resp instanceof Error) throw resp
      const error = await resp.json().catch(() => ({}))
      throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${resp.statusText}`)
    },
  })
}

export async function generateAnswersWithChatgptApi(port, question, session, apiKey, modelName) {
  const { controller, messageListener, disconnectListener } = setAbortController(port)

  const config = await getUserConfig()
  const prompt = getConversationPairs(
    session.conversationRecords.slice(-config.maxConversationContextLength),
    false,
  )
  prompt.unshift({ role: 'system', content: await getChatSystemPromptBase() })
  prompt.push({ role: 'user', content: question })
  const apiUrl = config.customOpenAiApiUrl

  let answer = ''
  await fetchSSE(`${apiUrl}/v1/chat/completions`, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: prompt,
      model: Models[modelName].value,
      stream: true,
      max_tokens: config.maxResponseTokenLength,
      temperature: config.temperature,
    }),
    onMessage(message) {
      console.debug('sse message', message)
      if (message.trim() === '[DONE]') {
        pushRecord(session, question, answer)
        console.debug('conversation history', { content: session.conversationRecords })
        port.postMessage({ answer: null, done: true, session: session })
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (error) {
        console.debug('json error', error)
        return
      }
      answer +=
        data.choices[0]?.delta?.content ||
        data.choices[0]?.message?.content ||
        data.choices[0]?.text ||
        ''
      port.postMessage({ answer: answer, done: false, session: null })
    },
    async onStart() {},
    async onEnd() {
      port.postMessage({ done: true })
      port.onMessage.removeListener(messageListener)
      port.onDisconnect.removeListener(disconnectListener)
    },
    async onError(resp) {
      port.onMessage.removeListener(messageListener)
      port.onDisconnect.removeListener(disconnectListener)
      if (resp instanceof Error) throw resp
      const error = await resp.json().catch(() => ({}))
      throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${resp.statusText}`)
    },
  })
}

/**
 * @param {Browser.Runtime.Port} port
 * @param {string} question
 * @param {Session} session
 */
export async function generateAnswersWithUseslessApi(port, question, session) {
  const { controller, messageListener, disconnectListener } = setAbortController(port)

  const config = await getUserConfig()
  const history = getConversationPairs(
    session.conversationRecords.slice(-config.maxConversationContextLength),
  )
  const data = await Browser.storage.local.get('token')
  console.log('请求时发送的token', data.token, history)

  if (!data.token) {
    throw new Error('请先登录')
  }

  let answer = ''
  await fetchSSE(`https://aibackend.usesless.com/api/cms/prompt`, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      prompt: question,
      characterId: session.characterId,
      history,
    }),
    onMessage(message) {
      // console.debug('sse message', message)
      let data
      try {
        data = JSON.parse(message)
      } catch (error) {
        console.debug('json error', error)
        return
      }

      if (data?.error) {
        console.log('error', data.error)
        port.onMessage.removeListener(messageListener)
        port.onDisconnect.removeListener(disconnectListener)
        throw new Error(data.error)
      }

      if (data?.done) {
        pushRecord(session, question, answer)
        console.debug('conversation history', { content: session.conversationRecords })
        port.postMessage({ answer: null, done: true, session: session })
        return
      }

      answer += data.content?.token || ''
      // console.log('answer', answer)
      port.postMessage({ answer: answer, done: false, session: null })
    },
    async onStart() {},
    async onEnd() {
      port.postMessage({ done: true })
      port.onMessage.removeListener(messageListener)
      port.onDisconnect.removeListener(disconnectListener)
    },
    async onError(resp) {
      port.onMessage.removeListener(messageListener)
      console.log('error', resp)
      port.onDisconnect.removeListener(disconnectListener)
      if (resp instanceof Error) throw resp
      const error = await resp.json().catch(() => ({}))
      throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${resp.statusText}`)
    },
  })
}
