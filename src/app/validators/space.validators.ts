import{ AbstractControl} from '@angular/forms';

export function spaceValidator(control: AbstractControl): { [key: string]: any } {
        if(!control.value) return null;
        let value = control.value;
        let stringRegex = /^\S*$/;
        
    
        let result = stringRegex.test(value);
    
        if (result) {
            return null;
        } else {
            return { "spaceValidator": { value } }
        }
    }
