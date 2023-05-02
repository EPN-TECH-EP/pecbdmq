import {
  Directive,
  ElementRef,
  HostListener,
  Optional,
  Self,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Attribute,
  EventEmitter,
  Output,
} from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[inputValidation]',
})
export class InputValidationDirective implements OnInit, OnChanges {
  @Input() inputValidation: string; // type: 'entero' or 'decimal'
  @Input() ngModel;
  @Output() ngModelChange = new EventEmitter();
  

  private min: number;
  private max: number;

  constructor(
    private el: ElementRef,
    @Optional() @Self() private control: NgControl,
    @Attribute('min') private minAttr: string,
    @Attribute('max') private maxAttr: string    
  ) {}

  ngOnInit() {
    if (this.inputValidation === 'entero') {
      if (this.minAttr) {
        this.min = parseInt(this.minAttr);
      }  
      if (this.maxAttr) {
        this.max = parseInt(this.maxAttr);
      }
    } else 
    if (this.inputValidation === 'decimal') {
      if (this.minAttr) {
        this.min = parseFloat(this.minAttr);
      }  
      if (this.maxAttr) {
        this.max = parseFloat(this.maxAttr);
      }
    }    
  }

  ngOnChanges(changes: SimpleChanges) {
    // update the min and max values when they change
    if (this.inputValidation === 'entero') {
      if (changes.minAttr && changes.minAttr.currentValue) {
        this.min = parseInt(changes.minAttr.currentValue);
      }
      if (changes.maxAttr && changes.maxAttr.currentValue) {
        this.max = parseInt(changes.maxAttr.currentValue);
      }
    } else if(this.inputValidation === 'decimal') {
      if (changes.minAttr && changes.minAttr.currentValue) {
        this.min = parseFloat(changes.minAttr.currentValue);
      }
      if (changes.maxAttr && changes.maxAttr.currentValue) {
        this.max = parseFloat(changes.maxAttr.currentValue);
      }
    }
  }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {

    const input = event.target as HTMLInputElement;

    let allowedChars: RegExp;
    if (this.inputValidation === 'entero') {
      allowedChars = /^[0-9]*$/;
    } else if (this.inputValidation === 'decimal') {
      allowedChars = /^[0-9]*\.?[0-9]*$/;7
    }

    let newValue = '';
    for (let i = 0; i < input.value.length; i++) {
      if (allowedChars.test(input.value[i])) {
        newValue += input.value[i];
      }
    }
    input.value = newValue;

    if (!(event.data !== null && event.data === '.')) {
      // validate numeric ranges
      if (
        this.inputValidation === 'entero' ||
        this.inputValidation === 'decimal'
      ) {
        
        let value;  
        if (this.inputValidation === 'entero') {
          value = parseInt(input.value);
        } else {
          value = parseFloat(input.value);  
        }


        if (!isNaN(this.min) && value < this.min) {
          input.value = this.min.toString();
          if (this.control) {
            this.control.control.setValue(this.min); // update the form control value
          }
        } else if (!isNaN(this.max) && value > this.max) {
          input.value = this.max.toString();
          if (this.control) {
            this.control.control.setValue(this.max); // update the form control value
          }
        } else {
          if (this.control) {
            this.control.control.setValue(value); // update the form control value
          }
        }
      }
    } else {
      if (event.data !== null && event.data === '.'){
        this.control.control.setValue(newValue); // update the form control value
      }
    }

    this.ngModelChange.emit(this.control.control.value);

  }

  
}
