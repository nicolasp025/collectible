import { useState, type CSSProperties } from 'react'
import { colors } from '../theme'

function Placeholder({ name, style }: { name: string; style?: CSSProperties }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'repeating-linear-gradient(135deg, #12160F 0px, #12160F 10px, #161C13 10px, #161C13 20px)',
        border: `1px solid ${colors.borderStrong}`,
        color: '#3A4A35',
        fontFamily: "'Chakra Petch', sans-serif",
        fontWeight: 700,
        ...style,
      }}
    >
      <span style={{ fontSize: '2.5rem' }}>{letter}</span>
    </div>
  )
}

export function ItemImage({
  name,
  image,
  style,
}: {
  name: string
  image: string | null
  style?: CSSProperties
}) {
  const [broken, setBroken] = useState(false)
  if (!image || broken) {
    return <Placeholder name={name} style={style} />
  }
  return (
    <img
      src={image}
      alt={name}
      onError={() => setBroken(true)}
      style={{ objectFit: 'cover', ...style }}
    />
  )
}
