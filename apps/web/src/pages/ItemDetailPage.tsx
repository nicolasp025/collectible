import { useParams } from 'react-router-dom'

export default function ItemDetailPage() {
  const { collectionId, itemId } = useParams()
  return (
    <div>
      Détail de l'item {itemId} (collection {collectionId}) (à venir)
    </div>
  )
}
