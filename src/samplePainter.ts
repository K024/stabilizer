import { EventSource, PoinerEventListener, ActionEventListener, ConfigSource } from "./event"

export function initSamplePainter(
  canvas: HTMLCanvasElement,
  pointerSource: EventSource<PoinerEventListener>,
  actionSource: EventSource<ActionEventListener>,
  config: ConfigSource,
) {
  const { width, height } = canvas
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#ffaa00"

  let cursorDown = false

  pointerSource({
    move({ x, y }) {
      if (cursorDown && config.paintSample) {
        ctx.fillRect(x - 2, y - 2, 4, 4)
      }
    },
    down({ x, y }) {
      cursorDown = true
      if (cursorDown && config.paintSample) {
        ctx.fillRect(x - 2, y - 2, 4, 4)
      }
    },
    up() {
      cursorDown = false
    },
    out() {
      cursorDown = false
    },
  })

  actionSource({
    clear() {
      ctx.clearRect(0, 0, width, height)
    },
    clearSample() {
      ctx.clearRect(0, 0, width, height)
    },
  })
}
