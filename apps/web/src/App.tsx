import { Route, Routes } from 'react-router-dom'
import CollectionsPage from './pages/CollectionsPage'
import CollectionItemsPage from './pages/CollectionItemsPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemFormPage from './pages/ItemFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CollectionsPage />} />
      <Route path="/collections/:collectionId" element={<CollectionItemsPage />} />
      <Route path="/collections/:collectionId/items/new" element={<ItemFormPage />} />
      <Route path="/collections/:collectionId/items/:itemId" element={<ItemDetailPage />} />
      <Route path="/collections/:collectionId/items/:itemId/edit" element={<ItemFormPage />} />
    </Routes>
  )
}

export default App
