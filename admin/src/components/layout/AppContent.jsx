import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Import components
const Dashboard = React.lazy(() => import('../../views/dashboard/Dashboard'))

// User Management Components
const UsersList = React.lazy(() => import('../../views/users/UsersList'))
const Profile = React.lazy(() => import('../../views/users/Profile'))
const RolesList = React.lazy(() => import('../../views/roles/RolesList'))

// Settings Components
const Settings = React.lazy(() => import('../../views/settings/Settings'))

// Masters Components
const CategoriesList = React.lazy(() => import('../../views/categories/CategoriesList'))
const SubCategoriesList = React.lazy(() => import('../../views/subcategories/SubCategoriesList'))

const AppContent = () => {
  return (
    <div className="app-content">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* User Management Routes */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roles" element={<RolesList />} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Masters Routes */}
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/subcategories" element={<SubCategoriesList />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)

