import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useColorModes } from '@coreui/react'
import { Button, Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faPalette } from '@fortawesome/free-solid-svg-icons'

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const currentTheme = useSelector((state) => state.theme)

  const themes = [
    { key: 'light', label: 'Light', icon: faSun },
    { key: 'dark', label: 'Dark', icon: faMoon },
    { key: 'auto', label: 'Auto', icon: faPalette }
  ]

  const handleThemeChange = (themeKey) => {
    // Update Redux store
    dispatch({ type: 'set', theme: themeKey })
    
    // Update CoreUI theme
    setColorMode(themeKey)
    
    // Store in localStorage for persistence
    localStorage.setItem('theme', themeKey)
  }

  const getCurrentThemeIcon = () => {
    const theme = themes.find(t => t.key === currentTheme)
    return theme ? theme.icon : faSun
  }

  const getCurrentThemeLabel = () => {
    const theme = themes.find(t => t.key === currentTheme)
    return theme ? theme.label : 'Light'
  }

  return (
    <div className="theme-toggle-container d-flex align-items-center">
      {/* Quick Toggle Button */}
      <Button
        variant="outline-secondary"
        size="sm"
        className="d-flex align-items-center me-2"
        onClick={() => handleThemeChange(currentTheme === 'light' ? 'dark' : 'light')}
        title={`Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} theme`}
        style={{ minWidth: '40px' }}
      >
        <FontAwesomeIcon 
          icon={getCurrentThemeIcon()} 
          style={{ fontSize: '0.875rem' }}
        />
      </Button>

      {/* Theme Options Dropdown */}
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          size="sm"
          className="d-flex align-items-center"
          title="Theme Options"
          style={{ minWidth: '60px' }}
        >
          <FontAwesomeIcon icon={faPalette} style={{ fontSize: '0.875rem' }} />
          <span className="d-none d-md-inline ms-1" style={{ fontSize: '0.8rem' }}>
            Theme
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-end">
          {themes.map((theme) => (
            <Dropdown.Item
              key={theme.key}
              onClick={() => handleThemeChange(theme.key)}
              className={`d-flex align-items-center ${
                currentTheme === theme.key ? 'active' : ''
              }`}
              style={{ fontSize: '0.875rem' }}
            >
              <FontAwesomeIcon 
                icon={theme.icon} 
                className="me-2" 
                style={{ fontSize: '0.8rem' }}
              />
              {theme.label}
              {currentTheme === theme.key && (
                <FontAwesomeIcon 
                  icon={faSun} 
                  className="ms-auto text-success" 
                  style={{ fontSize: '0.7rem' }}
                />
              )}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default ThemeToggle
