import { Component, inject, input, output, signal } from '@angular/core';
import { BrightnessImageEffect, DesaturationImageEffect, HueShiftImageEffect, ImageEffect, TintImageEffect } from '../../core/image-processor';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ImageProcessorService } from '../../image-processor.service';
import { EffectsLibrary } from '../../core/effects-library';

@Component({
  selector: 'app-effect-item',
  imports: [ ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatSlideToggleModule, MatInputModule, MatFormFieldModule, MatSliderModule ],
  templateUrl: './effect-item.component.html',
  styleUrl: './effect-item.component.scss'
})
export class EffectItemComponent {
  imageProcessorService = inject(ImageProcessorService);
  effect = input<ImageEffect>();
  effectType = signal('');
  form = new FormGroup({
    name: new FormControl<string>(''),
    active: new FormControl<boolean>(false),
    weight: new FormControl<number>(0)
  });
  tintForm = new FormGroup({
    r: new FormControl<number>(1),
    g: new FormControl<number>(1),
    b: new FormControl<number>(1)
  });
  hueShiftForm = new FormGroup({
    shift: new FormControl<number>(0)
  });
  desaturationForm = new FormGroup({
    value: new FormControl<number>(0)
  });
  brightnessForm = new FormGroup({
    value: new FormControl<number>(1)
  });
  onUpdate = output();

  ngOnInit() {
    this.effectType.set(EffectsLibrary.GetEffectNameByClass(this.effect().constructor as any));
    this.form.controls.name.setValue(this.effect().name);
    this.form.controls.active.setValue(this.effect().active);
    this.form.controls.weight.setValue(this.effect().weight * 100);
  }

  onNameChanged() {
    if (this.form.controls.name.valid) {
      this.effect().name = this.form.controls.name.value;
    }
  }

  onActiveChanged() {
    this.effect().active = this.form.controls.active.value;
    this.imageProcessorService.processor.updateActiveEffects();
    this.imageProcessorService.applyFilters();
    this.onUpdate.emit();
  }

  onWeightChanged() {
    this.effect().weight = this.form.controls.weight.value/100;
    this.imageProcessorService.applyFilters();
    this.onUpdate.emit();
  }

  onDeleteClick() {
    this.imageProcessorService.deleteEffect(this.effect());
  }

  onTintFormChanged() {
    const effect = this.effect() as TintImageEffect;
    effect.tint.r = this.tintForm.controls.r.value;
    effect.tint.g = this.tintForm.controls.g.value;
    effect.tint.b = this.tintForm.controls.b.value;
    this.imageProcessorService.applyFilters();
  }

  onHueShiftFormChanged() {
    const effect = this.effect() as HueShiftImageEffect;
    effect.angle = this.hueShiftForm.controls.shift.value;
    this.imageProcessorService.applyFilters();
  }

  onDesaturationFormChanged() {
    const effect = this.effect() as DesaturationImageEffect;
    effect.value = this.desaturationForm.controls.value.value;
    this.imageProcessorService.applyFilters();
  }

  onBrightnessFormChanged() {
    const effect = this.effect() as BrightnessImageEffect;
    effect.value = this.brightnessForm.controls.value.value;
    this.imageProcessorService.applyFilters();
  }
}
