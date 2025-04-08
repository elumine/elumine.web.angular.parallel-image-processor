import { Component, inject, signal } from '@angular/core';
import { ImageProcessorService } from '../image-processor.service';
import { ImageProcessorInstance } from '../core/image-processor';

@Component({
  selector: 'app-status-panel',
  imports: [],
  templateUrl: './status-panel.component.html',
  styleUrl: './status-panel.component.scss'
})
export class StatusPanelComponent {
  imageProcessorService = inject(ImageProcessorService);
  instanceList = signal<ImageProcessorInstance[]>([]);

  ngOnInit() {
    this.imageProcessorService.processor.onInitialized.subscribe(() => {
      this.imageProcessorService.processor.instanceList.forEach((instance, index) => {
        instance.onInitialized.subscribe(() => {
          instance.onStatusChanged.subscribe((instance) => {
            this.instanceList.set([...this.imageProcessorService.processor.instanceList]);
          });
        });
      });
    });
  }
}
