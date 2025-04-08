import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectItemComponent } from './effect-item.component';

describe('EffectItemComponent', () => {
  let component: EffectItemComponent;
  let fixture: ComponentFixture<EffectItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EffectItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
