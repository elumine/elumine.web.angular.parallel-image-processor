import { Component, computed, inject, signal } from '@angular/core';
import { EffectItemComponent } from "./effect-item/effect-item.component";
import { ImageProcessorService } from '../image-processor.service';
import { ImageEffect } from '../core/image-processor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EffectsLibrary } from '../core/effects-library';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-effects-panel',
  imports: [
    EffectItemComponent, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './effects-panel.component.html',
  styleUrl: './effects-panel.component.scss'
})
export class EffectsPanelComponent {
  imageProcessorService = inject(ImageProcessorService);
  effects = signal<ImageEffect[]>([]);
  effectsCount = computed(() => this.effects().length);
  activeEffectsCount = computed(() => this.effects().filter(e=>e.active).length);
  libraryEffectsList = signal<string[]>(EffectsLibrary.GetEffectNamesList());
  addEffectForm = new FormGroup({
    effectType: new FormControl('', [ Validators.required ]),
  });

  ngOnInit() {
    console.info(this);
    this.imageProcessorService.processor.onInitialized.subscribe(() => this._updateEffectsList());
    this.imageProcessorService.processor.onEffectsListChanged.subscribe(() => this._updateEffectsList());
  }

  _updateEffectsList() {
    this.effects.set([...this.imageProcessorService.processor.effects]);
  }
  
  createEffect() {
    this.imageProcessorService.createEffect(this.addEffectForm.value.effectType);
  }

  onEffectUpdate() {
    //
  }
}
