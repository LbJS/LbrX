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

export default function Footer(): JSX.Element {
  return <footer className="page-footer deep-purple lighten-3">
    <div className="container">
      <div className="row">
        <div className="col s6">
          <span className="hide-on-med-and-down footer-title">Info</span>
          <span>Version: </span>
          <b style={{ marginRight: `.5em` }}>1.0.0</b>
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