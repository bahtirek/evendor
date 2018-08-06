export class Vendor{
    constructor(
        public name: string,
        public id: number,
        public vendorRepresent?: boolean,
        public submit?: boolean,
        public shopList?: boolean
    ){}
}
