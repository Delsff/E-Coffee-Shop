import { useEffect } from "react";
import type { Product } from "../pages/CatalogPage";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80";

const getImageUrl = (url?: string) => {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:5001${url.startsWith("/") ? "" : "/"}${url}`;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
};

export const ProductModal = ({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) => {
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm h-dvh w-screen overscroll-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[85dvh] md:max-h-none overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white text-stone-700 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all cursor-pointer"
        >
          ✕
        </button>
        <div className="w-full md:w-1/2 relative min-h-55 sm:min-h-65 md:min-h-95bg-stone-100 shrink-0 overflow-hidden">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {product.roastLevel && (
            <span className="absolute top-4 left-4 z-10 bg-stone-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium capitalize shadow">
              {product.roastLevel} roast
            </span>
          )}
        </div>
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {product.category.replace("-", " ")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 mb-2">
              {product.name}
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mb-3 sm:mb-4">
              ${(product.price / 100).toFixed(2)}
            </p>
            <div className="border-t border-stone-100 pt-3 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Flavor & Profile
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span className="text-stone-400">Processing:</span>
                <span className="font-medium text-stone-700">
                  Washed / Natural
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Stock Status:</span>
                <span
                  className={`font-medium ${
                    product.inStock ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-stone-100 flex gap-3">
            <button
              disabled={!product.inStock}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 bg-amber-700 text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer text-center text-sm sm:text-base"
            >
              {product.inStock
                ? `Add to Cart • $${(product.price / 100).toFixed(2)}`
                : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
