import { Component, Input, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-my-text-input',
  imports: [FormsModule],
  templateUrl: './my-text-input.component.html',
  styleUrl: './my-text-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: MyTextInputComponent,
    multi: true
  }]
})
export class MyTextInputComponent implements ControlValueAccessor {
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
