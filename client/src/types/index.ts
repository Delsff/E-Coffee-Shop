export type GrindOption =
  'In the grains' | 'Espresso' | 'Under the filter' | 'Under the geyser' | 'Under the Turk';
export type CoffeeWeight = 250 | 1000;

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  origin: string;
  processing: string;
  roastLevel: string;
  flavorProfile: string[];
  score: number;
  image: string;
  inStock: boolean;
  weight: CoffeeWeight[];
  grindOptions: GrindOption[];
}

export interface CartItem {
  cartItemId: string;
  id: string;
  title: string;
  image: string;
  price: number;
  weight: CoffeeWeight;
  grind: GrindOption;
  quantity: number;
}
