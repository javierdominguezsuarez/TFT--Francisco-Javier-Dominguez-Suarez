import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent {
  @ViewChild('canvasRef', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>
  @Output() squareCreated = new EventEmitter<{ x: number, y: number, width: number, height: number, canvasWidth: number, canvasHeight: number }>()
  context: CanvasRenderingContext2D
  originPosition: { x: number, y: number }
  lastPosition: { x: number, y: number }
  canvasWidth: number
  canvasHeight: number
  isCropping: boolean = false

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement
    this.context = canvas.getContext('2d')

    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    this.canvasWidth = canvas.width
    this.canvasHeight = canvas.height

    console.log("Canvas Width:", canvas.width)
    console.log("Canvas Hegiht:", canvas.height)
    canvas.style.width = canvas.offsetWidth + 'px'
    canvas.style.height = canvas.offsetHeight + 'px'

    this.context.setLineDash([5, 3])
    this.context.lineWidth = 1
    this.context.strokeStyle = 'white'
    this.isCropping = true
    this.setCursor()
    canvas.addEventListener('mousedown', this.startPointerMoveInteraction.bind(this))
    canvas.addEventListener('mouseup', this.stopPointerMoveInteraction.bind(this))
  }

  getBackingStorePixelRatio(): number {
    return (
      this.context['webkitBackingStorePixelRatio'] ||
      this.context['mozBackingStorePixelRatio'] ||
      this.context['msBackingStorePixelRatio'] ||
      this.context['oBackingStorePixelRatio'] ||
      this.context['backingStorePixelRatio'] ||
      1
    )
  }
  startPointerMoveInteraction(event: MouseEvent) {
    console.log('start moving...')
    this.originPosition = this.getCursorPosition(event)
    this.canvasRef.nativeElement.addEventListener('pointermove', this.pointerMoveEvent.bind(this))

  }

  private stopPointerMoveInteraction = (event: MouseEvent) => {
    this.canvasRef.nativeElement.removeEventListener('pointermove', this.pointerMoveEvent.bind(this))
    this.canvasRef.nativeElement.removeEventListener('mousedown', this.startPointerMoveInteraction.bind(this))

    const width = Math.abs(this.lastPosition.x - this.originPosition.x)
    const fx = this.originPosition.x
    const fy = this.originPosition.y
    const height = Math.abs(this.lastPosition.y - this.originPosition.y)
    const square = { fx, fy, width, height }

    this.squareCreated.emit({
      x: this.originPosition.x,
      y: this.originPosition.y,
      width: square.width,
      height: square.height,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight
    })

    this.isCropping = false
    this.setCursor()

  }

  getCursorPosition(event: MouseEvent): { x: number, y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x, y }
  }

  private setCursor() {
    if (this.isCropping) {
      this.canvasRef.nativeElement.classList.add('scissor-cursor')
    } else {
      this.canvasRef.nativeElement.classList.remove('scissor-cursor')
    }
  }

  pointerMoveEvent(event: MouseEvent) {
    this.lastPosition = this.getCursorPosition(event)
    this.context.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height)

    const x = Math.min(this.originPosition.x, this.lastPosition.x)
    const y = Math.min(this.originPosition.y, this.lastPosition.y)
    const width = Math.abs(this.lastPosition.x - this.originPosition.x)
    const height = Math.abs(this.lastPosition.y - this.originPosition.y)

    this.drawSquare(x, y, width, height)

  }


  generateCorrectAspectRatioSquare(): { x: number, y: number, width: number, height: number } {
    const ratio = 16 / 9;
    const width = Math.abs(this.lastPosition.x - this.originPosition.x)
    const height = Math.abs(this.lastPosition.y - this.originPosition.y)

    let x, y
    if (width > height) {
      const newHeight = width / ratio
      x = this.originPosition.x
      y = this.originPosition.y - newHeight
      return { x, y, width, height: newHeight }
    } else {
      const newWidth = height * ratio
      x = this.originPosition.x - newWidth
      y = this.originPosition.y
      return { x, y, width: newWidth, height }
    }
  }

  drawSquare(x: number, y: number, width: number, height: number) {
    this.context.beginPath()
    this.context.rect(Math.round(x),Math.round(y), Math.round(width), Math.round(height))
    this.context.stroke()
    this.context.closePath()
  }

}
