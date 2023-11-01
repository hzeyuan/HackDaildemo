import React, { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { PropTypes } from 'prop-types'
// import { updateSession } from '../../services/local-session.mjs'
// import _ from 'lodash-es'
// import { setUserConfig } from '../../config/index.mjs'

export const CharacterSelect = ({ onChange, characters, defaultValue }) => {
  const [options, setOptions] = useState([{}])

  const handleChange = async (id) => {
    onChange && onChange(id)
  }

  useEffect(() => {
    if (characters && characters.length > 0) {
      const newOptions = characters.map((character) => ({
        value: character?.id,
        label: (
          <Space align="center" justify="center">
            <div style={{ height: '20px' }}>
              <img
                src={character?.attributes?.avatar}
                alt={character?.attributes?.title}
                style={{ width: '20px', height: '20px' }}
              />
            </div>
            <span style={{ fontSize: '14px' }}> {character?.attributes?.title}</span>
          </Space>
        ),
      }))
      setOptions(newOptions)
    }
  }, [characters])

  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: '168px', zIndex: 999999 }}
      onChange={handleChange}
      options={options}
    />
  )
}

CharacterSelect.propTypes = {
  characters: PropTypes.array.isRequired,
  defaultValue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
