import { useParams } from 'react-router-dom'

export default function ItemFormPage() {
  const { collectionId, itemId } = useParams()
  return (
    <div>
      Formulaire item {itemId ?? '(nouveau)'} (collection {collectionId}) (à venir)
    </div>
  )
}
