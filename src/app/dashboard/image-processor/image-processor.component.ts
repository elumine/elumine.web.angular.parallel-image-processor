import { Component, inject, input } from '@angular/core';
import { ImageViewComponent } from "./image-view/image-view.component";
import { EffectsPanelComponent } from "./effects-panel/effects-panel.component";
import { ImageProcessorService } from './image-processor.service';
import { StatusPanelComponent } from "./status-panel/status-panel.component";

@Component({
  selector: 'app-image-processor',
  imports: [ImageViewComponent, EffectsPanelComponent, 
    StatusPanelComponent, StatusPanelComponent],
  templateUrl: './image-processor.component.html',
  styleUrl: './image-processor.component.scss'
})
export class ImageProcessorComponent {
  imageProcessorService = inject(ImageProcessorService);
  image = input<File>();

  ngOnInit() {
    console.log(this);
  }

  onDownloadClick() {
    this.imageProcessorService.downloadImage();
  }
}
