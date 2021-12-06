import { EventSource, PoinerEventListener, ConfigSource, PointerSample } from "./event"

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export function createStabilizer(
  pointerSource: EventSource<PoinerEventListener>,
  config: ConfigSource
) {
  const listeners: PoinerEventListener[] = []

  let cursorDown = false
  let samples: PointerSample[] = []

  let pointer = 0
  function pushSample(s: PointerSample) {
    pointer = (pointer + 1) % config.stablizerRatio
    samples[pointer] = s

    const x = samples.map(x => x.x).reduce((a, b) => a + b) / samples.length
    const y = samples.map(x => x.y).reduce((a, b) => a + b) / samples.length
    const p = samples.map(x => x.p).reduce((a, b) => a + b) / samples.length
    const t = samples.map(x => x.t).reduce((a, b) => a + b) / samples.length
    listeners.forEach(l => l.move?.({ x, y, p, t }))
  }

  async function tick() {
    while (true) {
      if (cursorDown && samples[pointer]) {
        pushSample(samples[pointer])
      }
      await delay(config.sampleInterval)
    }
  }
  tick()

  pointerSource({
    move(s) {
      if (cursorDown)
        pushSample(s)
      else
        listeners.forEach(l => l.move?.(s))
    },
    down(s) {
      cursorDown = true
      samples = Array(config.stablizerRatio).fill(s)

      listeners.forEach(l => l.down?.(s))
    },
    up(s) {
      cursorDown = false
      for (let i = 0; i < config.stablizerRatio; i++)
        pushSample(s)

      listeners.forEach(l => l.up?.(s))
    },
  })

  return function addListener(listener: PoinerEventListener) {
    listeners.push(listener)
  }
}
