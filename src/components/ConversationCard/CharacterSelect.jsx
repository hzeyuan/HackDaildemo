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
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div style={{ height: '22px' }}>
              <img
                src={character?.attributes?.avatar}
                alt={character?.attributes?.title}
                style={{ width: '18px', height: '18px' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '14px' }}> {character?.attributes?.title}</span>
            </div>
          </div>
        ),
      }))
      setOptions(newOptions)
    }
  }, [characters])

  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: '150px', zIndex: 999999 }}
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
