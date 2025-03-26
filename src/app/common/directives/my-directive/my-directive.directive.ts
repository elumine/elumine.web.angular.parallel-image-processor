import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMyDirective]'
})
export class MyDirectiveDirective {

  constructor(
    private element: ElementRef
  ) {
    this.element.nativeElement.style.backgroundColor = 'yellow';
  }
}
