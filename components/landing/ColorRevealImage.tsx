/**
 * Module: Cursor color reveal image
 * Purpose: Reveal the original image color through a monochrome portfolio image.
 * Used by: Public Gallery cards.
 * Dependencies: React pointer events and global reveal accessibility styles.
 * Public functions: ColorRevealImage().
 * Side effects: Tracks pointer position locally; does not perform network calls.
 */
'use client'

import { PointerEvent, useState } from 'react'

export default function ColorRevealImage({ src, alt }: { src: string; alt: string }) {
  const [pointer, setPointer] = useState({ x: 50, y: 50, active: false })

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setPointer({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100, active: true })
  }

  return (
    <div className="relative h-full w-full" onPointerMove={move} onPointerLeave={() => setPointer((current) => ({ ...current, active: false }))}>
      <img src={src} alt={alt} className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-110" />
      <img src={src} alt="" aria-hidden="true" className="color-reveal-layer pointer-events-none absolute inset-0 h-full w-full object-cover transition-[clip-path,transform] duration-300 ease-out group-hover:scale-110" style={{ clipPath: `circle(${pointer.active ? 24 : 0}% at ${pointer.x}% ${pointer.y}%)` }} />
    </div>
  )
}
