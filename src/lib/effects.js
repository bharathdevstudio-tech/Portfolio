// Shared toggle storage for visual effects.
// Keys match the deployed site's localStorage conventions:
//   spotlight -> pf-spot    (off by default)
//   sparkles  -> pf-sparkles (off by default)
import { useEffect, useState } from 'react'

export const EFFECTS = {
  spotlight: 'pf-spot',
  sparkles: 'pf-sparkles',
}

export const EFFECT_LABELS = {
  [EFFECTS.spotlight]: 'Spotlight',
  [EFFECTS.sparkles]: 'Particles',
}

function defaultValue() {
  return false
}

export function getEffectEnabled(key) {
  try {
    const v = window.localStorage.getItem(key)
    if (v === null || v === undefined || v === '') return defaultValue()
    return v === 'on'
  } catch {
    return defaultValue()
  }
}

export function setEffectEnabled(key, enabled) {
  try {
    window.localStorage.setItem(key, enabled ? 'on' : 'off')
  } catch {
    /* ignore storage errors */
  }
  window.dispatchEvent(new CustomEvent(`${key}-change`, { detail: enabled }))
}

// React hook that tracks an effect toggle and re-renders on change.
export function useEffectToggle(key) {
  const [enabled, setEnabled] = useState(() => getEffectEnabled(key))

  useEffect(() => {
    const onChange = (e) => setEnabled(e.detail)
    window.addEventListener(`${key}-change`, onChange)
    return () => window.removeEventListener(`${key}-change`, onChange)
  }, [key])

  return enabled
}