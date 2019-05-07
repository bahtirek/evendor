import{ AbstractControl} from '@angular/forms';

export function phoneValidator(control: AbstractControl): { [key: string]: any } {
        if(!control.value) return null;
        let value = control.value;
        let phoneRegex = /\(\d{3}\) \d{3}-\d{4}/;
        
    
        let result = phoneRegex.test(value);
    
        if (result) {
            return null;
        } else {
            return { "phoneValidator": { value } }
        }
    }