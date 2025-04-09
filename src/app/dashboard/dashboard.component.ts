import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ImageProcessorComponent } from './image-processor/image-processor.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  imports: [ ImageProcessorComponent, ImageUploadComponent,
    MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  image = null;

  constructor(
    private readonly authService: AuthService) {}


  ngOnInit() {
    //
  }

  logout() {
    this.authService.logout()
      .subscribe();
  }

  onFileSelected(file: File) {
    this.image = file;
  }
}
