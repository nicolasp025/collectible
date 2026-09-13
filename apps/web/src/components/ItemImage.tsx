import { useState } from 'react'

function Placeholder({ name, className }: { name: string; className?: string }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      className={`flex items-center justify-center border border-rgx-border-strong bg-[repeating-linear-gradient(135deg,#15101F_0px,#15101F_10px,#1C1530_10px,#1C1530_20px)] font-heading font-bold text-[#4A3A63] ${className ?? ''}`}
    >
      <span className="text-[2.5rem]">{letter}</span>
    </div>
  )
}

export function ItemImage({
  name,
  image,
  className,
}: {
  name: string
  image: string | null
  className?: string
}) {
  const [broken, setBroken] = useState(false)
  if (!image || broken) {
    return <Placeholder name={name} className={className} />
  }
  return (
    <img src={image} alt={name} onError={() => setBroken(true)} className={`object-cover ${className ?? ''}`} />
  )
}
