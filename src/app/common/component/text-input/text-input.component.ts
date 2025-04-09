import { Component, Input, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-text-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TextInputComponent,
    multi: true
  }]
})
export class TextInputComponent implements ControlValueAccessor {
  value: string;
  isDisabled: boolean;

  placeholder = input<string>();

  onChange: (value: string) => void;
  onTouched: () => void;

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (value !== this.value) {
      this.value = value;
      this.onChange(value);
      this.onTouched();
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  updateValue(newValue: string) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.onChange(newValue);
      this.onTouched();
    }
  }
}
