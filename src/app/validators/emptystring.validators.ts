import{ AbstractControl, ValidationErrors } from '@angular/forms';

export function emptyStringValidator(control: AbstractControl): { [key: string]: any } {
        if(!control.value) return null;
        let value = control.value;
        let stringRegex = /^(?!\s*$).+/i;
        
    
        let result = stringRegex.test(value);
    
        if (result) {
            return null;
        } else {
            return { "emptyStringValidator": { value } }
        }
    }

    