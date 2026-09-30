import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "../store/useCartStore";
import { ProductModal } from "./ProductModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80";

const getImageUrl = (url?: string) => {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:5001${url.startsWith("/") ? "" : "/"}${url}`;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee-beans" | "accessories" | "equipment";
  roastLevel?: "light" | "medium" | "dark";
  imageUrl: string;
  inStock: boolean;
};ш

type RoastFilter = "all" | "light" | "medium" | "dark";
type SortOption = "default" | "price-asc" | "price-desc";

export const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roastFilter, setRoastFilter] = useState<RoastFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const { addToCart } = useCartStore();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product catalog.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const mathesSeach = product.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesRoast =
        roastFilter === "all" || product.roastLevel === roastFilter;
      return mathesSeach && matchesRoast;
    });
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, searchQuery, roastFilter, sortBy]);

  const roastOptions: { label: string; value: RoastFilter }[] = [
    { label: "All Roasts", value: "all" },
    { label: "Light", value: "light" },
    { label: "Medium", value: "medium" },
    { label: "Dark", value: "dark" },
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoastFilter("all");
    setSortBy("default");
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Specialty Coffee Catalog
        </h1>
        <p className="text-stone-600">
          Freshly roasted beans sourced from the world's finest origins
        </p>
      </div>
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name (e.g., Ethiopia)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
            Roast:
          </span>
          {roastOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setRoastFilter(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                roastFilter === option.value
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 cursor-pointer"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {isLoading && (
        <div className="text-center py-16 text-stone-500">
          Loading catalog...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mb-8">
          {error}
        </div>
      )}
      {!isLoading && !error && filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-16 bg-stone-50 rounded-xl border border-dashed border-stone-300">
          <p className="text-stone-600 font-medium mb-2">
            No products found matching your search
          </p>
          <p className="text-sm text-stone-400 mb-4">
            Try adjusting your search criteria or reset filters
          </p>
          <button
            onClick={handleResetFilters}
            className="text-sm text-amber-700 font-semibold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
      {!isLoading && !error && filteredAndSortedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => setSelected(product)}
              style={{ animationDelay: `${index * 70}ms` }}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full aspect-square bg-stone-100 overflow-hidden">
                  <img
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.roastLevel && (
                    <span className="absolute top-3 right-3 z-10 bg-stone-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium capitalize">
                      {product.roastLevel} roast
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                <span className="text-xl font-bold text-amber-700">
                  ${(product.price / 100).toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onAddToCart={addToCart}
      />
    </main>
  );
};
