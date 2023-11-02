import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { openUrl } from '../../utils/index.mjs'
import {
  isUsingApiKey,
  isUsingAzureOpenAi,
  isUsingClaude2Api,
  isUsingCustomModel,
  isUsingCustomNameOnlyModel,
  isUsingGithubThirdPartyApi,
  isUsingMultiModeModel,
  ModelMode,
  Models,
  ThemeMode,
  TriggerMode,
} from '../../config/index.mjs'
import Browser from 'webextension-polyfill'
import { languageList } from '../../config/language.mjs'
import PropTypes from 'prop-types'
import { config as menuConfig } from '../../content-script/menu-tools'
import { Form, Select, Space, Switch, Flex } from 'antd'
GeneralPart.propTypes = {
  config: PropTypes.object.isRequired,
  updateConfig: PropTypes.func.isRequired,
}

export function GeneralPart({ config, updateConfig }) {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <div
        style={{
          gap: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>谷歌，百度搜索时,是否自动触发回答:</div>
          <div>
            <Switch
              checked={config.triggerMode === 'always'}
              onChange={(checked) => {
                updateConfig({ triggerMode: checked ? 'always' : 'manually' })
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{t('Insert ChatGPT at the top of search results')}</div>
          <div>
            <Switch
              checked={config.insertAtTop}
              onChange={(checked) => {
                updateConfig({ insertAtTop: checked })
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{t('Display selection tools next to input box to avoid blocking')}</div>
          <div>
            <Switch
              checked={config.selectionToolsNextToInputBox}
              onChange={(checked) => {
                updateConfig({ selectionToolsNextToInputBox: checked })
              }}
            />
          </div>
        </div>

        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>工具栏配置</div>
          <div>
            <Switch
              defaultChecked
              onChange={(e) => {
                const mode = e.target.value
                updateConfig({ triggerMode: mode })
              }}
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}
