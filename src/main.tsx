import './style.css'
import { createActionEventSource, createConfigSource, createPointerEventSource } from './event'
import { initCursorPainter } from './cursorPainter'
import { initPainter } from './painter'
import { createStabilizer } from './stabilizer'
import { initSamplePainter } from './samplePainter'
import { initStatistics } from './statistics'
import { createLinearUpsampler } from './upsampler'

const app = document.querySelector<HTMLDivElement>('#app')!

const width = 1200
const height = 1200

const canvas: HTMLCanvasElement =
  <canvas width={width} height={height} />

const cursorLayer: HTMLCanvasElement =
  <canvas width={width} height={height} />

const samplesLayer: HTMLCanvasElement =
  <canvas width={width} height={height} />

const stack: HTMLDivElement =
  <div className="stack">
    {samplesLayer}
    {canvas}
    {cursorLayer}
  </div>

function bindValue(input: HTMLInputElement, text: HTMLElement) {
  text.innerText = input.value
  input.addEventListener("input", () => text.innerText = input.value)
  return [input, text] as const
}

const clearBtn: HTMLButtonElement =
  <button>Clear</button>

const colorPicker: HTMLInputElement =
  <input id="color-picker" type="color" value="#00aaff" />

const [sizePicker, sizePickerValue] =
  bindValue(<input id="size-picker" type="range" min="1" max="30" value="10" step="1" />, <span />)

const [stabilizerRatio, stabilizerRatioValue] =
  bindValue(<input id="ratio-picker" type="range" min="1" max="60" value="10" step="1" />, <span />)

const [sampleInterval, sampleIntervalValue] =
  bindValue(<input id="sample-picker" type="range" min="5" max="100" value="30" step="1" />, <span />)

const [upsamples, upsamplesValue] =
  bindValue(<input id="upsample-picker" type="range" min="0" max="3" value="1" step="1" />, <span />)

const paintSample: HTMLInputElement =
  <input id="sample-paint" type="checkbox" style={{ width: "auto" }} />

const statistics: HTMLDivElement = <div className="statistics" />

app.append(
  <div className="tools">
    {clearBtn}
    <div>
      <label htmlFor="color-picker">Brush Color</label>
      {colorPicker}
    </div>
    <div>
      <label htmlFor="size-picker">Brush Size: {sizePickerValue}px</label>
      {sizePicker}
    </div>
    <div>
      <label htmlFor="ratio-picker">Stabilizer Sample Size: {stabilizerRatioValue}</label>
      {stabilizerRatio}
    </div>
    <div>
      <label htmlFor="sample-picker">Resample Interval: {sampleIntervalValue}ms</label>
      {sampleInterval}
    </div>
    <div>
      <label htmlFor="upsample-picker">UpSample Count: {upsamplesValue}</label>
      {upsamples}
    </div>
    <div>
      {paintSample}
      <label htmlFor="sample-paint">Paint Sample</label>
    </div>
    {statistics}
    <p className="notice">
      Feel free to zoom the page.
      Try adjust the sample rate to above at least 160 by UpSample Count.
      Tablet pressure only works in Windows Ink mode.
    </p>
  </div>,
  <div className="main">
    {stack}
  </div>
)

const pointerSource = createPointerEventSource(stack, width, height)
const actionSource = createActionEventSource(clearBtn, paintSample)

const config = createConfigSource(
  colorPicker,
  sizePicker,
  stabilizerRatio,
  sampleInterval,
  upsamples,
  paintSample,
)

const upsampledSource = createLinearUpsampler(pointerSource, config)
const stablizedSource = createStabilizer(upsampledSource, config)

initStatistics(statistics, upsampledSource)
initSamplePainter(samplesLayer, upsampledSource, actionSource, config)
initPainter(canvas, stablizedSource, actionSource, config)
initCursorPainter(cursorLayer, pointerSource, actionSource, config)
