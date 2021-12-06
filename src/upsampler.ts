import { EventSource, PoinerEventListener, ConfigSource, PointerSample } from "./event"
import { lerp } from "./utils"

export function createLinearUpsampler(
  pointerSource: EventSource<PoinerEventListener>,
  config: ConfigSource
) {
  const listeners: PoinerEventListener[] = []

  let lastSample: PointerSample | null = null

  pointerSource({
    move(s) {
      if (lastSample) {
        const upsamples = config.upSamples
        for (let i = 0; i < upsamples; i++) {
          const x = lerp(-1, upsamples, i, s.x, lastSample.x)
          const y = lerp(-1, upsamples, i, s.y, lastSample.y)
          const p = lerp(-1, upsamples, i, s.p, lastSample.p)
          const t = lerp(-1, upsamples, i, s.t, lastSample.t)
          listeners.forEach(l => l.move?.({ x, y, p, t }))
        }
      }
      lastSample = s
      listeners.forEach(l => l.move?.(s))
    },
    down(s) {
      lastSample = s
      listeners.forEach(l => l.down?.(s))
    },
    up(s) {
      listeners.forEach(l => l.up?.(s))
    },
  })

  return function addListener(listener: PoinerEventListener) {
    listeners.push(listener)
  }
}
