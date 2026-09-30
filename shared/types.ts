export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee-beans" | "accessories" | "equipment";
  roastLevel?: "light" | "medium" | "dark";
  imageUrl: string;
  inStock: boolean;
};

export type CartItem = Product & {
  quantity: number;
};
