import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './footer.component.scss'

const BADGES = [
  {
    url: `https://github.com/LbJS/LbrX#readme`,
    text: `Docs`,
    classes: `teal darken-3`
  },
  {
    url: `https://www.npmjs.com/package/lbrx`,
    text: `NPM`,
    classes: `pink darken-3`
  },
  {
    url: `https://github.com/LbJS/LbrX/issues`,
    text: `Issues`,
    classes: `orange darken-3`
  },
  {
    url: `https://github.com/LbJS/LbrX/tree/master`,
    text: `Code`,
    classes: `light-blue darken-3`
  }
]

type VersionState = [string, Dispatch<SetStateAction<string>>]

export default function Footer(): JSX.Element {
  const [version, setVersion]: VersionState = useState(`--`)

  useEffect(() => {
    getAppVersion()
  }, [])

  async function getAppVersion(): Promise<void> {
    const result = (await fetch(`https://raw.githubusercontent.com/LbJS/LbrX/master/package.json`).then(r => r.json())).version as string
    setVersion(result)
  }

  return <footer className="page-footer deep-purple lighten-3">
    <div className="container">
      <div className="row">
        <div className="col s6">
          <span className="hide-on-med-and-down footer-title">Info</span>
          <span>Version: </span>
          <b style={{ marginRight: `.5em` }}>{version}</b>
          <span>By: </span>
          <b>LbJS</b>
        </div>
        <div className="col s6">
          <div className="right">
            <span className="hide-on-med-and-down footer-title">GoTo</span>
            <span className="badges-container light-text">
              {BADGES.map(badge =>
                <a href={badge.url}
                  key={badge.text}
                  target="_blank">
                  <span className={`app-badge ` + badge.classes}>{badge.text}</span>
                </a>)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
}
