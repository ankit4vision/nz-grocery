import React, { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useColorModes } from '@coreui/react'
import './scss/style.scss'
import '../styles/theme.css'

// Import Providers
import { ToastProvider } from './components'
import { AuthProvider } from './context/AuthContext'

// Import Routes
import AppRoutes from './routes'

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
