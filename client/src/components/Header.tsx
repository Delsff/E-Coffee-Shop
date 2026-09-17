import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
}
export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenAuth }) => {
  const { user, logout } = useAuthStore();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <>
      <header className='border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <span className='text-2xl'>☕</span>
            <span className='font-bold text-lg text-stone-100 tracking-wide'>
              ROAST<span className='text-amber-500'>&</span>CRAFT
            </span>
          </div>
          <div className='flex items-center space-x-4'>
            {user ? (
              <div className='flex items-center space-x-3'>
                <span className='text-sm text-stone-300 font-medium'>
                  {user.name || user.email.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className='text-xs text-stone-400 hover:text-red-400 transition-colors border border-stone-800 rounded-lg px-3 py-2 cursor-pointer'
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className='text-sm font-semibold text-stone-300 hover:text-amber-500 transition-colors cursor-pointer'
              >
                Sign In
              </button>
            )}
            <button
              onClick={onOpenCart}
              className='relative bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center space-x-2 cursor-pointer'
            >
              <span>Cart</span>
              {totalItems > 0 && (
                <span className='bg-stone-950 text-amber-500 text-xs px-2 py-1 rounded-full'>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
