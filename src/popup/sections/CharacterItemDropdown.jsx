import React from 'react'
import { MoreOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space } from 'antd'
import { PropTypes } from 'prop-types'

const CharacterItemDropdown = ({ onSetDefault }) => {
  const menu = (
    <Menu>
      <Menu.Item key="setDefault" onClick={onSetDefault}>
        设为默认
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <MoreOutlined />
        </Space>
      </a>
    </Dropdown>
  )
}

CharacterItemDropdown.propTypes = {
  onSetDefault: PropTypes.func.isRequired,
}

export { CharacterItemDropdown }
