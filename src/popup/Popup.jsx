import '@picocss/pico'
import { useEffect, useState } from 'react'
import {
  defaultConfig,
  getPreferredLanguageKey,
  getUserConfig,
  setUserConfig,
} from '../config/index.mjs'
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { Tabs, Button, Flex } from 'antd'
// import 'react-tabs/style/react-tabs.css'
import './styles.scss'
import { MarkGithubIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import { useWindowTheme } from '../hooks/use-window-theme.mjs'
import { isMobile } from '../utils/index.mjs'
import { useTranslation } from 'react-i18next'
import { GeneralPart } from './sections/GeneralPart'
import { FeaturePages } from './sections/FeaturePages'
import { Characters } from './sections/Characters'
import { AdvancedPart } from './sections/AdvancedPart'
import { ModulesPart } from './sections/ModulesPart'
import { Alert } from 'antd'

// eslint-disable-next-line react/prop-types
function Footer({ currentVersion, latestVersion }) {
  const { t } = useTranslation()

  return (
    <div className="footer">
      <div style={{ width: '300px' }}>
        <Alert
          type="info"
          message={
            <div>
              {`${t('Current Version')}: ${currentVersion} `}
              {/* {currentVersion === latestVersion ? (
                `(${t('Latest')})`
              ) : (
                <>
                  ({`${t('Latest')}: `}
                  <a
                    href={'https://github.com/josStorer/chatGPTBox/releases/tag/v' + latestVersion}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {latestVersion}
                  </a>
                  )
                </>
              )} */}
            </div>
          }
          action={
            <div>
              <a href="https://ai2.usesless.net" target="_blank" rel="nofollow noopener noreferrer">
                <span>{t('Help | Changelog ')}</span>
              </a>
            </div>
          }
        ></Alert>
      </div>
    </div>
  )
}

function Popup() {
  const { t, i18n } = useTranslation()
  const [config, setConfig] = useState(defaultConfig)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentVersion, setCurrentVersion] = useState('')
  const [latestVersion, setLatestVersion] = useState('')
  const theme = useWindowTheme()

  const updateConfig = (value) => {
    setConfig({ ...config, ...value })
    setUserConfig(value)
  }

  useEffect(() => {
    getPreferredLanguageKey().then((lang) => {
      i18n.changeLanguage(lang)
    })
    getUserConfig().then((config) => {
      setConfig(config)
      setCurrentVersion(Browser.runtime.getManifest().version.replace('v', ''))
      fetch('https://api.github.com/repos/josstorer/chatGPTBox/releases/latest').then((response) =>
        response.json().then((data) => {
          setLatestVersion(data.tag_name.replace('v', ''))
        }),
      )
    })
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = config.themeMode === 'auto' ? theme : config.themeMode
  }, [config.themeMode, theme])

  // 跳转到ai2.usesless.net

  const handleSignIn = () => {
    console.log('跳转')
    Browser.tabs.create({
      url: 'http://127.0.0.1:1002/login',
    })
  }

  // 判断用户是否已经登录
  useEffect(async () => {
    const token = await Browser.storage.local.get('token')
    setIsLoggedIn(!!token)
  }, [])
  const search = new URLSearchParams(window.location.search)
  const popup = !isMobile() && search.get('popup') // manifest v2

  return (
    <div className={popup === 'true' ? 'container-popup-mode' : 'container-page-mode'}>
      {/* {isLoggedIn ? '已登录' : '未登录'} */}

      {!isLoggedIn && (
        <div style="display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center;">
          <img
            style="width: 4rem; height: 4rem;"
            src="https://d345tjjtvpi848.cloudfront.net/character/1739avatar.png"
            alt=""
          />
          <div style="margin-bottom: 0.5rem; font-size: 1.5rem; font-weight: 600; color: #3b82f6;">
            Welcome back!
          </div>
          <div style="margin-bottom: 1rem; font-size: 1.125rem; font-weight: 500;">
            Sign in to continue
          </div>
          <Button variant="primary" onClick={() => handleSignIn()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="res-icon-big"
            >
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
            </svg>
            <span>Sign In</span>
          </Button>
        </div>
      )}

      {isLoggedIn && (
        <div style="width:100%">
          <div className="logoContainer">
            <div>logo</div>
            <div>设置按钮</div>
          </div>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: t('General'),
                children: <GeneralPart config={config} updateConfig={updateConfig} />,
              },
              // {
              //   key: '2',
              //   label: t('Feature Pages'),
              //   children: <FeaturePages config={config} updateConfig={updateConfig} />,
              // },
              {
                key: '2',
                label: '角色',
                children: <Characters config={config} updateConfig={updateConfig} />,
              },
              {
                key: '3',
                // label: t('Modules'),
                label: '工具栏',
                children: <ModulesPart config={config} updateConfig={updateConfig} />,
              },
              {
                key: '4',
                label: t('Advanced'),
                children: <AdvancedPart config={config} updateConfig={updateConfig} />,
              },
            ]}
          />
          <Footer currentVersion={currentVersion} latestVersion={latestVersion} />{' '}
        </div>
      )}
      <br />
    </div>
  )
}

export default Popup
