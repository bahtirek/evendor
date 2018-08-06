import { Vendor } from './vendor';

export class Recipient{
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public vendors: Vendor[],
        public salesPerson?: boolean, 
        public id?: number,
        public index?: number
    ){}
}