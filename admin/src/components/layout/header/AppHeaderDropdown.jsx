import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilSettings,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToast } from '../../common/ToastProvider'
import { useAuth } from '../../../context/AuthContext'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { success } = useToast()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      success('Logged out successfully!')
      navigate('/login')
    }
  }

  // Get user avatar or generate initials
  const getAvatarSrc = () => {
    if (user?.avatar) {
      return user.avatar
    }
    // Generate initials avatar if no profile image
    if (user?.firstName && user?.lastName) {
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
      return `https://ui-avatars.com/api/?name=${initials}&background=22c55e&color=ffffff&size=40`
    }
    return `https://ui-avatars.com/api/?name=User&background=22c55e&color=ffffff&size=40`
  }

  // Get user initials for alt text
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar 
          src={getAvatarSrc()} 
          size="md"
          alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
          onError={(e) => {
            // Fallback to initials if image fails to load
            const initials = getUserInitials()
            e.target.src = `https://ui-avatars.com/api/?name=${initials}&background=22c55e&color=ffffff&size=40`
          }}
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
        </CDropdownHeader>
        
        <CDropdownItem onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          My Profile
        </CDropdownItem>
        
        <CDropdownItem onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        
        <CDropdownDivider />
        
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

