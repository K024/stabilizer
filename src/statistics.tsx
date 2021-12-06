import { EventSource, PoinerEventListener, ActionEventListener, ConfigSource } from "./event"

export function initStatistics(
  statistics: HTMLElement,
  pointerSource: EventSource<PoinerEventListener>,
) {

  const sampleRate: HTMLSpanElement = <span />
  const pressure: HTMLSpanElement = <span />

  statistics.append(
    <p>Sample Rate: {sampleRate}</p>,
    <p>Pressusure: {pressure}</p>,
  )

  let cursorDown = false
  let timeSamples: number[] = []

  pointerSource({
    move({ p, t }) {
      if (cursorDown) {
        pressure.innerText = (p * 100).toFixed(0)
        timeSamples.push(t)
        while (timeSamples.length > 30)
          timeSamples.shift()

        const sr = (timeSamples.length / (timeSamples[timeSamples.length - 1] - timeSamples[0]) * 1000)
        sampleRate.innerText = sr.toFixed(0)
        if (sr < 160) sampleRate.classList.add("warn")
        else sampleRate.classList.remove("warn")
      }
    },
    down() {
      cursorDown = true
    },
    up() {
      cursorDown = false
      timeSamples.length = 0
    },
  })
}
