import { useTranslation } from 'react-i18next'
import { config as toolsConfig } from '../../content-script/selection-tools/index.mjs'
import PropTypes from 'prop-types'
import { Space, Switch } from 'antd'
SelectionTools.propTypes = {
  config: PropTypes.object.isRequired,
  updateConfig: PropTypes.func.isRequired,
}

export function SelectionTools({ config, updateConfig }) {
  const { t } = useTranslation()

  return (
    <div className="selectionToolsContainer">
      {config.selectionTools.map((key) => (
        <div key={key}>
          <Space>
            <span style={{ width: '32px' }}>{toolsConfig[key].icon}</span>
            {t(toolsConfig[key].label)}
          </Space>
          <div className="label">
            <Switch
              size="small"
              checked={config.activeSelectionTools.includes(key)}
              onChange={(e) => {
                const checked = e.target.checked
                const activeSelectionTools = config.activeSelectionTools.filter((i) => i !== key)
                if (checked) activeSelectionTools.push(key)
                updateConfig({ activeSelectionTools })
              }}
            />
          </div>

          {/* <Checkbox
            checked={config.activeSelectionTools.includes(key)}
            onChange={(e) => {
              const checked = e.target.checked
              const activeSelectionTools = config.activeSelectionTools.filter((i) => i !== key)
              if (checked) activeSelectionTools.push(key)
              updateConfig({ activeSelectionTools })
            }}
          >
             {toolsConfig[key].icon}
            {t(toolsConfig[key].label)}
          </Checkbox> */}
        </div>
      ))}
    </div>
  )
}
