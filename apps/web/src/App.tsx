import { Route, Routes } from 'react-router-dom'
import CollectionsPage from './pages/CollectionsPage'
import CollectionItemsPage from './pages/CollectionItemsPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemFormPage from './pages/ItemFormPage'
import LoginPage from './pages/LoginPage'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { AuthBar } from './components/AuthBar'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-rgx-bg" />
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <>
      <AuthBar />
      <Routes>
        <Route path="/" element={<CollectionsPage />} />
        <Route path="/collections/:collectionId" element={<CollectionItemsPage />} />
        <Route path="/collections/:collectionId/items/new" element={<ItemFormPage />} />
        <Route path="/collections/:collectionId/items/:itemId" element={<ItemDetailPage />} />
        <Route path="/collections/:collectionId/items/:itemId/edit" element={<ItemFormPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
