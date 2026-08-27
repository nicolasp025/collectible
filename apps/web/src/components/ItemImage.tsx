import { useState } from 'react'

function Placeholder({ name, className }: { name: string; className?: string }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      className={`flex items-center justify-center border border-rgx-border-strong bg-[repeating-linear-gradient(135deg,#12160F_0px,#12160F_10px,#161C13_10px,#161C13_20px)] font-heading font-bold text-[#3A4A35] ${className ?? ''}`}
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
