import { cropText, limitedFetch } from '../../../utils'

const getPatchUrl = async () => {
  const patchUrl = location.origin + location.pathname + '.patch'
  const response = await fetch(patchUrl, { method: 'HEAD' })
  if (response.ok) return patchUrl
  return ''
}

const getPatchData = async (patchUrl) => {
  if (!patchUrl) return

  let patchData = await limitedFetch(patchUrl, 1024 * 40)
  patchData = patchData.substring(patchData.indexOf('---'))
  return patchData
}

export default {
  inputQuery: async () => {
    try {
      if (location.pathname.includes('/blob')) {
        const fileData = await limitedFetch(location.href.replace('/blob/', '/raw/'), 1024 * 40)
        if (!fileData) return

        return await cropText(
          `Analyze the following file content and explain it. Use markdown syntax to make your answer more readable, such as code blocks, bold, list:` +
            `\n\`\`\`\n${fileData}\n\`\`\``,
        )
      } else {
        const patchUrl = await getPatchUrl()
        const patchData = await getPatchData(patchUrl)
        if (!patchData) return

        return await cropText(
          `Analyze the contents of a git commit,provide a suitable commit message,and summarize the contents of the commit.` +
            `The patch contents of this commit are as follows:\n${patchData}`,
        )
      }
    } catch (e) {
      console.log(e)
    }
  },
}
