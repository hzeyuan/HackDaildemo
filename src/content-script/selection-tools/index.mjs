import { CardList, EmojiSmile, Translate } from 'react-bootstrap-icons'
import {
  QuestionCircleOutlined,
  FileDoneOutlined,
  ExceptionOutlined,
  CommentOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import { getPreferredLanguage } from '../../config/language.mjs'

export const config = {
  explain: {
    icon: <QuestionCircleOutlined style={{ width: '20px', height: '20px' }} />,
    label: 'Explain',
    genPrompt: async (selection) => {
      const preferredLanguage = await getPreferredLanguage()
      return `Reply in ${preferredLanguage}.Explain the following:\n"${selection}"`
    },
  },
  translate: {
    icon: <Translate style={{ width: '20px', height: '20px' }} />,
    label: 'Translate',
    genPrompt: async (selection) => {
      const preferredLanguage = await getPreferredLanguage()
      return `Translate the following into ${preferredLanguage} and only show me the translated content:\n${selection}`
    },
  },
  // translateToEn: {
  //   icon: <TranslationOutlined />,
  //   label: 'Translate (To English)',
  //   genPrompt: async (selection) => {
  //     return `Translate the following into English and only show me the translated content:\n${selection}`
  //   },
  // },
  // translateToZh: {
  //   icon: <Globe />,
  //   label: 'Translate (To Chinese)',
  //   genPrompt: async (selection) => {
  //     return `Translate the following into Chinese and only show me the translated content:\n${selection}`
  //   },
  // },
  // translateBidi: {
  //   icon: <Globe />,
  //   label: 'Translate (Bidirectional)',
  //   genPrompt: async (selection) => {
  //     const preferredLanguage = await getPreferredLanguage()
  //     return (
  //       `Translate the following into ${preferredLanguage} and only show me the translated content.` +
  //       `If it is already in ${preferredLanguage},` +
  //       `translate it into English and only show me the translated content:\n${selection}`
  //     )
  //   },
  // },
  summary: {
    icon: <ExceptionOutlined style={{ width: '20px', height: '20px', fontSize: '20px' }} />,
    label: 'Summary',
    genPrompt: async (selection) => {
      const preferredLanguage = await getPreferredLanguage()
      return `Reply in ${preferredLanguage}.Summarize the following as concisely as possible:\n"${selection}"`
    },
  },
  polish: {
    icon: <FileDoneOutlined style={{ width: '20px', height: '20px', fontSize: '20px' }} />,
    label: 'Polish',
    genPrompt: async (selection) =>
      `Check the following content for possible diction and grammar problems,and polish it carefully:\n"${selection}"`,
  },
  sentiment: {
    icon: <EmojiSmile style={{ width: '20px', height: '20px' }} />,
    label: 'Sentiment Analysis',
    genPrompt: async (selection) => {
      const preferredLanguage = await getPreferredLanguage()
      return `Reply in ${preferredLanguage}.Analyze the sentiments expressed in the following content and make a brief summary of the sentiments:\n"${selection}"`
    },
  },
  divide: {
    icon: <CardList style={{ width: '20px', height: '20px' }} />,
    label: 'Divide Paragraphs',
    genPrompt: async (selection) =>
      `Divide the following into paragraphs that are easy to read and understand:\n"${selection}"`,
  },
  code: {
    icon: <CodeOutlined style={{ width: '20px', height: '20px', fontSize: '20px' }} />,
    label: 'Code Explain',
    genPrompt: async (selection) => {
      const preferredLanguage = await getPreferredLanguage()
      return `Reply in ${preferredLanguage}.Explain the following code:\n"${selection}"`
    },
  },
  ask: {
    icon: <CommentOutlined style={{ width: '20px', height: '20px', fontSize: '20px' }} />,
    label: 'Ask',
    genPrompt: async (selection) => {
      const preferredLanguage = await getPreferredLanguage()
      return `Reply in ${preferredLanguage}.Analyze the following content and express your opinion,or give your answer:\n"${selection}"`
    },
  },
}
