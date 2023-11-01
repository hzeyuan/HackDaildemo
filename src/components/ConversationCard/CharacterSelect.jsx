import React, { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { PropTypes } from 'prop-types'

const handleChange = (value) => {
  console.log(`Selected Character ID: ${value}`)
}

export const CharacterSelect = ({ characters, defaultValue }) => {
  const [options, setOptions] = useState([{}])

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
}
