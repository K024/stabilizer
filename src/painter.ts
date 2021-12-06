import { EventSource, PoinerEventListener, ActionEventListener, ConfigSource, PointerSample } from "./event"
import { distance, lerp } from "./utils"

export function initPainter(
  canvas: HTMLCanvasElement,
  pointerSource: EventSource<PoinerEventListener>,
  actionSource: EventSource<ActionEventListener>,
  config: ConfigSource,
) {
  const { width, height } = canvas

  let last: PointerSample = { x: 0, y: 0, p: 0, t: 0 }
  let cursor: PointerSample = { x: 0, y: 0, p: 0, t: 0 }
  let cursorDown = false

  function drawDelta() {
    const stepSize = 2
    const divisions = 10 + distance(last.x, last.y, cursor.x, cursor.y)
    for (let i = stepSize / 2; i <= divisions + stepSize / 2; i++) {
      const p = lerp(0, divisions, i, last.p, cursor.p)
      ctx.strokeStyle = calcColor(p / 2)
      ctx.lineWidth = p * config.brushSize
      ctx.beginPath()
      ctx.moveTo(
        lerp(0, divisions, i - stepSize, last.x, cursor.x),
        lerp(0, divisions, i - stepSize, last.y, cursor.y),
      )
      ctx.lineTo(
        lerp(0, divisions, i, last.x, cursor.x),
        lerp(0, divisions, i, last.y, cursor.y),
      )
      ctx.stroke()
    }
  }

  pointerSource({
    move(s) {
      last = cursor
      cursor = s
      if (cursorDown)
        drawDelta()
    },
    down(s) {
      cursor = last = s
      cursorDown = true
    },
    up() {
      cursorDown = false
    },
  })

  const ctx = canvas.getContext("2d")!

  actionSource({
    clear() {
      ctx.clearRect(0, 0, width, height)
    },
  })

  function calcColor(pressure: number) {
    const baseColor = parseInt(config.color.substr(1), 16)
    const r = (baseColor & 0xff0000) >> 16
    const g = (baseColor & 0xff00) >> 8
    const b = (baseColor & 0xff)
    return `rgba(${r},${g},${b},${pressure})`
  }
}
