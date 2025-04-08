import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { GameManager } from './game-manager';

@Component({
  selector: 'app-game-view',
  imports: [],
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.scss'
})
export class GameViewComponent {
  @ViewChild('viewport') viewport: ElementRef<HTMLCanvasElement>;
  game = new GameManager();

  constructor() { }

  ngOnInit(): void {
    console.info(this);
  }
  ngAfterViewInit() {
    this.game.init(this.viewport.nativeElement);
  }

  onMouseDown(e: MouseEvent) {
    this.game.input.mouseDown = true;
  }
  onMouseUp(e: MouseEvent) {
    this.game.input.mouseDown = false;
  }
  onMouseMove(e: MouseEvent) {
    this.game.input.mouse.x = e.clientX - this.viewport.nativeElement.getBoundingClientRect().left;
    this.game.input.mouse.y = e.clientY - this.viewport.nativeElement.getBoundingClientRect().top;
    if (this.game.input.mouseDown) {
      this.game.registerInput();
    }
  }
  onKeyDown(e: KeyboardEvent) {}
  onKeyUp(e: Event) {}
}
