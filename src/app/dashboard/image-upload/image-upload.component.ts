import { Component, output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  onFileSelected = output<File>();
  dragOn = false;

  fileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.onFileSelected.emit(file);
  }

  setDrag(value: boolean) {
    this.dragOn = value;
  }
}
