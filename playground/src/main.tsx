import { IS_PROD } from 'environment'
import { LbrXManager } from 'lbrx/core'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/app.component'

if (IS_PROD) LbrXManager.enableProdMode()
LbrXManager.initializeDevTools({ showStackTrace: false })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById(`app-root`)
)
