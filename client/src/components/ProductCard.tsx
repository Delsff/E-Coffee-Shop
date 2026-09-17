import React, { useState } from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import type { Product, CoffeeWeight, GrindOption } from '../types';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
  product: Product;
}
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedWeight, setSelectedWeight] = useState<CoffeeWeight>(product.weight[0] || 250);
  const [selectedGrind, setSelectedGrind] = useState<GrindOption>(
    product.grindOptions[0] || 'In the grains',
  );
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const currentPrice = Math.round(product.price * (selectedWeight === 1000 ? 3.6 : 1));
  const handleAddToCart = () => {
    addToCart(product, selectedWeight, selectedGrind);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };
  return (
    <div className='bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all group'>
      <div>
        <div className='relative aspect-4/3 overflow-hidden bg-stone-800'>
          <img
            src={product.image}
            alt={product.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
          <div className='absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-stone-300 border border-stone-800'>
            {product.origin}
          </div>
          <div className='absolute top-3 right-3 bg-amber-500/90 text-stone-950 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md'>
            <Star className='w-3 h-3 fill-stone-950' />
            <span>{product.score} Q</span>
          </div>
        </div>
        <div className='p-5'>
          <div className='text-xs font-medium text-stone-400 uppercase tracking-wider mb-1'>
            {product.roastLevel} • {product.processing}
          </div>
          <h3 className='text-lg font-bold text-stone-100 group-hover:text-amber-500 transition-colors'>
            {product.title}
          </h3>
          <p className='text-sm text-stone-400 mt-2 line-clamp-2 leading-relaxed'>
            {product.description}
          </p>
          <div className='flex flex-wrap gap-1.5 mt-3'>
            {product.flavorProfile.map((flavor) => (
              <span
                key={flavor}
                className='bg-stone-800 text-amber-400/90 text-xs px-2.5 py-0.5 rounded-md border border-stone-700/50'
              >
                {flavor}
              </span>
            ))}
          </div>
          <div className='mt-5'>
            <label className='text-xs text-stone-400 block mb-1.5 font-medium'>
              Select Weight:
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {product.weight.map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    selectedWeight === weight
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500 cursor-pointer'
                      : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700 cursor-pointer'
                  }`}
                >
                  {weight}g
                </button>
              ))}
            </div>
          </div>
          <div className='mt-3'>
            <label className='text-xs text-stone-400 block mb-1.5 font-medium'>Select Grind:</label>
            <select
              value={selectedGrind}
              onChange={(e) => setSelectedGrind(e.target.value as GrindOption)}
              className='w-full bg-stone-950 border border-stone-800 text-stone-300 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500'
            >
              {product.grindOptions.map((grind) => (
                <option key={grind} value={grind}>
                  {grind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='p-5 mt-2 flex items-center justify-between border-t border-stone-800/60 pt-4'>
        <div>
          <span className='text-xs text-stone-400 block'>Price</span>
          <span className='text-xl font-bold text-amber-500'>${currentPrice}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer'
          }`}
        >
          {isAdded ? (
            <>
              <Check className='w-4 h-4' />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className='w-4 h-4' />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
