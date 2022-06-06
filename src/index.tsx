import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Routers from './router/index'
import 'react-notifications/lib/notifications.css'
import {NotificationContainer} from 'react-notifications'

ReactDOM.render(
  <React.StrictMode>
    <NotificationContainer />
    <Routers />
  </React.StrictMode>,
  document.getElementById('root'),
)
