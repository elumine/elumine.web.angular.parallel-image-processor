import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageEffect, ImageProcessor, ImageProcessorInstance } from './core/image-processor';
import { EffectsLibrary } from './core/effects-library';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  processor = new ImageProcessor();
  onChange = new BehaviorSubject(null);

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  initProcessor() {
    const SUBDIVISION_W = 4, SUBDIVISION_H = 4,
      w = this.canvas.width / SUBDIVISION_W, 
      h = this.canvas.height / SUBDIVISION_H;
    for (let i = 0; i < SUBDIVISION_W; i++) {
      for (let j = 0; j < SUBDIVISION_H; j++) {
        const x = i * w, y = j * h;
        const data = this.ctx.getImageData(x, y, w, h);
        const instance = new ImageProcessorInstance();
        this.processor.instanceList.push(instance);
        instance.init(data.data, x, y, w, h);
        instance.onOutputChanged.subscribe((data) => {
          if (data) {
            const i2 = new ImageData(data.data, data.width, data.height);
            this.ctx.putImageData(i2, data.x, data.y);
          }
        });
      }
    }
    this.processor.init();
    this.applyFilters();
  }

  applyFilters() {
    this.processor.apply();
  }

  createEffect(type: string) {
    this.processor.createEffect(EffectsLibrary.GetEffectClassByName(type));
    this.applyFilters();
  }

  deleteEffect(effect: ImageEffect) {
    this.processor.deleteEffect(effect);
    this.applyFilters();
  }

  downloadImage() {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.setAttribute('download', 'output.png');
    link.setAttribute('href', this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
    link.remove();
  }
}
