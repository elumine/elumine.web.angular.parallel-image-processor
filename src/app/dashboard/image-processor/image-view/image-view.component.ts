import { Component, ElementRef, ViewChild, inject, input } from '@angular/core';
import { ImageProcessorService } from '../image-processor.service';

@Component({
  selector: 'app-image-view',
  imports: [],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.scss'
})
export class ImageViewComponent {
  @ViewChild('viewport') viewport: ElementRef<HTMLCanvasElement>;
  image = input<File>();
  service = inject(ImageProcessorService);

  ngAfterViewInit() {
    const canvas = this.viewport.nativeElement;
    const image = new Image();
    const reader  = new FileReader();
    reader.readAsDataURL(this.image());
    image.addEventListener('load', () => {
      canvas.width = image.width;
      canvas.height = image.height;
      this.service.setCanvas(canvas);
      this.service.ctx.drawImage(image, 0, 0, image.width, image.height);
      this.service.initProcessor();
    });
    reader.onloadend = () => {
      image.src = reader.result as string;
    }
  }
}
