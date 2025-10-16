import { legacy_createStore as createStore } from 'redux'

// Get theme from localStorage or default to 'light'
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  return savedTheme || 'light'
}

const initialState = {
  sidebarShow: true,
  theme: getInitialTheme(),
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
