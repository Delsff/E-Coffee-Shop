import type { Product } from "../types";
import { useCartStore } from "../store/useCartStore";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCartStore();
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-brand-dark">
              {product.name}
            </h3>
            {product.roastLevel && (
              <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mt-1 capitalize">
                {product.roastLevel} roast
              </span>
            )}
          </div>
          <span className="text-lg font-bold text-brand-accent">
            ${(product.price / 100).toFixed(2)}
          </span>
        </div>
        <p className="text-gray-600 text-sm my-3">{product.description}</p>
      </div>
      <button
        onClick={() => addToCart(product)}
        className="w-full mt-4 bg-brand-accent text-white py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
};
