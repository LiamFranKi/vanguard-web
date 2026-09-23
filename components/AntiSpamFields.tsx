'use client'

import { useState } from 'react'

export function useAntiSpam() {
  const [startedAt] = useState(() => Date.now())
  const [honeypot, setHoneypot] = useState('')

  return {
    startedAt,
    honeypot,
    setHoneypot,
    payload: () => ({
      sitio_web_extra: honeypot,
      form_started_at: startedAt,
    }),
  }
}

/** Campo invisible para bots + marca de tiempo. Va dentro del <form>. */
export default function AntiSpamFields({
  honeypot,
  onHoneypot,
  startedAt,
}: {
  honeypot: string
  onHoneypot: (v: string) => void
  startedAt: number
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
      <label htmlFor="sitio_web_extra">Sitio web</label>
      <input
        id="sitio_web_extra"
        name="sitio_web_extra"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => onHoneypot(e.target.value)}
      />
      <input type="hidden" name="form_started_at" value={String(startedAt)} />
    </div>
  )
}
