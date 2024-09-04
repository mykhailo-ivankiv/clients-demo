import { useEffect, useRef, useState } from 'react'

export function useFirstMountState() {
  const mountCounter = useRef(0)
  useEffect(() => {
    mountCounter.current += 1
  })
  return mountCounter.current === 1
}
