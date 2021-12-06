import { EventSource, PoinerEventListener, ActionEventListener, ConfigSource } from "./event"

export function initCursorPainter(
  cursorLayer: HTMLCanvasElement,
  pointerSource: EventSource<PoinerEventListener>,
  actionSource: EventSource<ActionEventListener>,
  config: ConfigSource,
) {
  const { width, height } = cursorLayer

  const ctxCur = cursorLayer.getContext("2d")!

  pointerSource({
    move({ x, y }) {
      ctxCur.clearRect(0, 0, width, height)
      ctxCur.beginPath();
      ctxCur.arc(x, y, config.brushSize, 0, Math.PI * 2)
      ctxCur.stroke()
    },
    out() {
      ctxCur.clearRect(0, 0, width, height)
    },
  })
}
