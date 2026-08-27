import { useParams } from 'react-router-dom'

export default function CollectionItemsPage() {
  const { collectionId } = useParams()
  return <div>Items de la collection {collectionId} (à venir)</div>
}
