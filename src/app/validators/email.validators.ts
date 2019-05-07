import{ AbstractControl} from '@angular/forms';

export function emailValidator(control: AbstractControl): { [key: string]: any } {
        if(!control.value) return null;
        let value = control.value;
        let emailRegex = /[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;
        
    
        let result = emailRegex.test(value);
    
        if (result) {
            return null;
        } else {
            return { "emailValidator": { value } }
        }
    }