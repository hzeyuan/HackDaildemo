import React, { useEffect, useState } from 'react'
import { Avatar, List, Skeleton, Checkbox, Button, Typography, Tooltip } from 'antd'
import { fetchCharacters } from '../../services/apis/characters-api.mjs'
import { PropTypes } from 'prop-types'
import _ from 'lodash-es'
import { CharacterItemDropdown } from './CharacterItemDropdown'

function CharacterCheckbox({ character, config, updateConfig }) {
  const isChecked = _.find(config.activeSelectionCharacters, { id: character.id })

  const [checked, setChecked] = useState(isChecked)
  const onChange = async (e) => {
    const checked = e.target.checked
    setChecked(checked)
    console.log('activeSelectionCharacters', config.activeSelectionCharacters)
    const activeSelectionCharacters = config.activeSelectionCharacters.filter(
      (i) => i.id !== character.id,
    )
    console.log('activeSelectionCharacters', activeSelectionCharacters)

    if (checked)
      activeSelectionCharacters.push({
        id: character.id,
        attributes: {
          title: character.attributes.title,
          avatar: character.attributes.avatar,
        },
      })
    updateConfig({ activeSelectionCharacters })
  }
  return <Checkbox checked={checked} onChange={onChange} />
}

CharacterCheckbox.propTypes = {
  character: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  updateConfig: PropTypes.func.isRequired,
}

export const Characters = ({ config, updateConfig }) => {
  const [initLoading, setInitLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [filterParams, setFilterParams] = useState({
    pagination: { page: 1, pageSize: 20 },
    order: [
      { field: 'order', order: 'asc' },
      { field: 'createdAt', order: 'desc' },
    ],
    filters: [
      {
        field: 'category_id',
        operator: '$eq',
        value: 0,
      },
    ],
  })
  const [data, setData] = useState([])
  const [list, setList] = useState([])
  useEffect(() => {
    fetchCharacters(filterParams.pagination, filterParams.filters, filterParams.order).then(
      (res) => {
        const results = res.data
        setInitLoading(false)
        setData(results)
        setList(results)
      },
    )
  }, [])

  const handleUpdateMainCharacter = (character) => {
    console.log('设置默认角色', character)
    updateConfig({ character })
  }

  const onLoadMore = () => {
    setLoading(true)

    // 递增当前的页面
    const newPage = filterParams.pagination.page + 1

    fetchCharacters(
      { ...filterParams.pagination, page: newPage },
      filterParams.filters,
      filterParams.order,
    ).then((res) => {
      const results = res.data

      // 将新数据添加到现有数据
      const newData = [...data, ...results]

      setData(newData)
      setList(newData)
      setLoading(false)

      // 更新当前的页面
      setFilterParams({
        ...filterParams,
        pagination: { ...filterParams.pagination, page: newPage },
      })

      window.dispatchEvent(new Event('resize'))
    })
  }
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null
  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        width: '100%',
      }}
    >
      {/* <Alert message='你可以选择至多三个添加到工具栏'></Alert> */}
      <div>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
            }}
          >
            <div>当前主要角色:</div>
            <div>{_.get(config.character, 'attributes.title', '暂无')}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
          }}
        >
          <div>工具栏:</div>
          {config.activeSelectionCharacters.length > 0 ? (
            <Avatar.Group shape="square" maxPopoverTrigger="hover" maxCount={5}>
              {config.activeSelectionCharacters?.map((item) => (
                <Tooltip key={`avatar-${item.id}`} title={item.attributes.title}>
                  <Avatar src={item.attributes?.avatar}></Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
          ) : (
            '勾选角色添加到工具栏'
          )}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'scroll' }}>
        <List
          bordered={false}
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          size="small"
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              className="character-item"
              actions={[
                <CharacterCheckbox
                  key={item.id}
                  character={item}
                  config={config}
                  updateConfig={updateConfig}
                />,
                <CharacterItemDropdown
                  key={`dropdown-${item.id}`}
                  onSetDefault={() => handleUpdateMainCharacter(item)}
                ></CharacterItemDropdown>,
              ]}
            >
              <Skeleton size="small" avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar src={item.attributes.avatar} />}
                  description={<Typography.Text>{item.attributes.title}</Typography.Text>}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

Characters.propTypes = {
  config: PropTypes.object.isRequired,
  updateConfig: PropTypes.func.isRequired,
}
