import { Item } from './item';

class AllItem{
    constructor(
        public name: string,
        public id: string,
        public items: Item[]
    ){}
}

export const allItems = [
    new AllItem('Dairy', 'dai', []),
    new AllItem('Meat', 'mea', []),
    new AllItem('Packging', 'pac', []),
    new AllItem('Seafood', 'sea', []),
    new AllItem('Spices, Dressing, Sauce', 'spi', []),
    new AllItem('Janitorial', 'jan', []),
    new AllItem('Flour, Bread', 'flo', []),
    new AllItem('Produce, canned fruit & veggie', 'pro', []),
    new AllItem('Other', 'oth', []),
    new AllItem('Dessert', 'des', []),
    new AllItem('Custom', 'cus', [])
];

