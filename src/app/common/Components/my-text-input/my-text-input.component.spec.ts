import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTextInputComponent } from './my-text-input.component';

describe('MyTextInputComponent', () => {
  let component: MyTextInputComponent;
  let fixture: ComponentFixture<MyTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTextInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
