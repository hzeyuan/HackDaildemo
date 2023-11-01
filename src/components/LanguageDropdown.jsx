import React from 'react'
import { Translate } from 'react-bootstrap-icons'
import { Dropdown } from 'antd'
import { PropTypes } from 'prop-types'

const LanguageDropdown = (props) => {
  const languageItems = [
    { key: '中文', label: '中文' },
    { key: 'English', label: 'English' },
    { key: 'Español', label: 'Español' },
    { key: 'Français', label: 'Français' },
    { key: 'Deutsch', label: 'Deutsch' },
    { key: 'Italiano', label: 'Italiano' },
    { key: '日本語', label: '日本語' },
    { key: '한국어', label: '한국어' },
    { key: 'Português', label: 'Português' },
    { key: 'Русский', label: 'Русский' },
    { key: 'Türkçe', label: 'Türkçe' },
    { key: 'Tiếng Việt', label: 'Tiếng Việt' },
    { key: 'Bahasa Indonesia', label: 'Bahasa Indonesia' },
    { key: 'ไทย', label: 'ไทย' },
    { key: 'العربية', label: 'العربية' },
    { key: 'हिन्दी', label: 'हिन्दी' },
    { key: 'עברית', label: 'עברית' },
    { key: 'Nederlands', label: 'Nederlands' },
  ]

  const items = languageItems.map((item) => ({
    key: item.key,
    label: item.label,
  }))

  return (
    <Dropdown
      placement="bottom"
      menu={{
        items,
        selectable: true,
        onClick: (e) => {
          // alert(e.key)
          props.selectLanguage()
        },
        defaultSelectedKeys: ['中文'],
      }}
      trigger={['hover', 'click']}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Translate size={20} />
      </a>
    </Dropdown>
  )
}

LanguageDropdown.prototype = {
  selectLanguage: PropTypes.func.isRequired,
}

export default LanguageDropdown
