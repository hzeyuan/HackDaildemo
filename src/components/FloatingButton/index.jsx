import { FloatButton, Tooltip } from 'antd'
import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { getCoreContentText } from '../../utils/get-core-content-text'
import { useState } from 'react'
import { createElementAtPosition } from '../../utils'
import { initSession } from '../../services/init-session.mjs'
import { getUserConfig } from '../../config/index.mjs'
import FloatingToolbar from '../FloatingToolbar/index'
import { render } from 'preact'

const actionConfig = {
  newChat: {
    label: 'New Chat',
    genPrompt: async () => {
      return ''
    },
  },
  summarizePage: {
    label: 'Summarize Page',
    genPrompt: async () => {
      return `The following is the text content of a web page, analyze the core content and summarize:\n${getCoreContentText()}`
    },
  },
}

function FloatingButton() {
  const [open, setOpen] = useState(false)

  const handleCreateChat = async (action = 'newChat') => {
    const prompt = await actionConfig[action].genPrompt()

    const position = { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 200 }
    const toolbarContainer = createElementAtPosition(position.x, position.y)
    toolbarContainer.className = 'chatgptbox-toolbar-container-not-queryable'
    const config = await getUserConfig()
    const characterId = config.character.id

    const newSession = initSession({
      question: '',
      characterId: characterId,
    })
    console.log('新增卡片', config.character.id)
    render(
      <FloatingToolbar
        session={newSession}
        selection=""
        characterId={characterId}
        container={toolbarContainer}
        closeable={true}
        triggered={true}
        prompt={prompt}
      />,
      toolbarContainer,
    )
  }

  return (
    <FloatButton.Group
      open={open}
      trigger="hover"
      style={{
        right: 24,
      }}
      onClick={() => {
        setOpen(!open)
      }}
      icon={<CustomerServiceOutlined />}
    >
      <Tooltip
        onClick={() => handleCreateChat('summarizePage')}
        title="总结网页:Ctrl+N"
        placement="left"
      >
        <FloatButton />
      </Tooltip>
      <Tooltip onClick={() => handleCreateChat('newChat')} title="新建聊天:Ctrl+B" placement="left">
        <FloatButton icon={<CommentOutlined />} />
      </Tooltip>
      {/* <Tooltip onClick={() => handleCreateChat('newChat')} title="新建聊天:Ctrl+B" placement="left">
        <FloatButton icon={<CommentOutlined />} />
      </Tooltip> */}
    </FloatButton.Group>
  )
}

export { FloatingButton }
