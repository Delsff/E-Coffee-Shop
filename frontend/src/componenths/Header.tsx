import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
export const Header = () => {
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  return (
    <header className="bg-brand-dark text-white p-6 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="block">
          <h1 className="text-2xl font-bold tracking-wide">Roast & Bean</h1>
          <span className="text-sm text-amber-200">Specialty Coffee Store</span>
        </Link>
        <button
          onClick={toggleCart}
          className="relative bg-brand-accent px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="cursor-pointer">Cart</span>
          {totalItems > 0 && (
            <span className="bg-white text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
