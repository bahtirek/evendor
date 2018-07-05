export class Order{    
    constructor(
        public id: number, //item id
        public vendor: number, //vendor.id
        public pack: string, // packaging
        public quantity: number, //quantity
        public vendorName?: string //vendor name
    ){}
}