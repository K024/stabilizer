
export interface EventSource<T> {
  (listener: T): void
}

export interface PointerSample {
  readonly x: number
  readonly y: number
  readonly p: number
  readonly t: number
}

export interface PoinerEventListener {
  move?(s: PointerSample): void
  up?(s: PointerSample): void
  down?(s: PointerSample): void
  out?(s: PointerSample): void
}

export function createPointerEventSource(el: HTMLElement, width: number, height: number) {

  function getRelPosition(e: PointerEvent) {
    const { x, y, width: w, height: h } = el.getBoundingClientRect()
    const { x: ex, y: ey } = e
    const cx = (ex - x) * width / w
    const cy = (ey - y) * height / h
    return [cx, cy] as const
  }

  const listeners: PoinerEventListener[] = []

  el.addEventListener("pointermove", e => {
    const [x, y] = getRelPosition(e)
    listeners.forEach(l => l.move?.({ x, y, p: e.pressure, t: e.timeStamp }))
  })

  el.addEventListener("pointerdown", e => {
    const [x, y] = getRelPosition(e)
    listeners.forEach(l => l.down?.({ x, y, p: e.pressure, t: e.timeStamp }))
  })

  el.addEventListener("pointerup", e => {
    const [x, y] = getRelPosition(e)
    listeners.forEach(l => l.up?.({ x, y, p: e.pressure, t: e.timeStamp }))
  })

  el.addEventListener("pointerout", e => {
    const [x, y] = getRelPosition(e)
    listeners.forEach(l => l.out?.({ x, y, p: e.pressure, t: e.timeStamp }))
  })

  return function addListener(listener: PoinerEventListener) {
    listeners.push(listener)
  }
}

export interface ActionEventListener {
  clear?(): void
  clearSample?(): void
}

export function createActionEventSource(clearBtn: HTMLElement, paintSample: HTMLInputElement) {
  const listeners: ActionEventListener[] = []

  clearBtn.addEventListener("pointerdown", () => {
    listeners.forEach(l => l.clear?.())
  })

  paintSample.addEventListener("change", () => {
    if (paintSample.checked === false)
      listeners.forEach(l => l.clearSample?.())
  })

  return function addListener(listener: ActionEventListener) {
    listeners.push(listener)
  }
}

export interface ConfigSource extends ReturnType<typeof createConfigSource> { }

export function createConfigSource(
  colorInput: HTMLInputElement,
  brushSizeInput: HTMLInputElement,
  stablizerRatio: HTMLInputElement,
  sampleInterval: HTMLInputElement,
  upSamples: HTMLInputElement,
  paintSample: HTMLInputElement,
) {
  return {
    get color() { return colorInput.value },
    get brushSize() { return +brushSizeInput.value },
    get stablizerRatio() { return +stablizerRatio.value },
    get sampleInterval() { return +sampleInterval.value },
    get upSamples() { return +upSamples.value },
    get paintSample() { return paintSample.checked },
  }
}
