import { Component, inject, signal } from '@angular/core';
import { ImageProcessorService } from '../image-processor.service';

@Component({
  selector: 'app-status-panel',
  imports: [],
  templateUrl: './status-panel.component.html',
  styleUrl: './status-panel.component.scss'
})
export class StatusPanelComponent {
  imageProcessorService = inject(ImageProcessorService);
  workersCount = signal(0);

  ngOnInit() {
    this.imageProcessorService.processor.onInitialized.subscribe(() => {
      this.workersCount.set(this.imageProcessorService.processor.instanceList.length);
    });
  }
}
