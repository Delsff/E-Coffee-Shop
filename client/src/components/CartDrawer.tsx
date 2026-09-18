import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { API_URL } from '../config';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const handleCheckout = async () => {
    if (!token) {
      setError('Please sign in to place an order.');
      return;
    }
    if (cart.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: getTotalPrice(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm'>
      <div className='absolute inset-y-0 right-0 max-w-full flex pl-10'>
        <div className='w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl'>
          <div className='p-6 border-b border-stone-800 flex items-center justify-between'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              <span>🛒</span> Your Cart
            </h2>
            <button
              onClick={onClose}
              className='text-stone-400 hover:text-stone-100 text-lg transition-colors cursor-pointer'
            >
              ✕
            </button>
          </div>
          <div className='flex-1 overflow-y-auto p-6 space-y-4'>
            {success ? (
              <div className='text-center py-16 space-y-4'>
                <div className='text-5xl'>🎉</div>
                <h3 className='text-2xl font-bold text-amber-500'>Order Placed!</h3>
                <p className='text-stone-400 text-sm'>
                  Thank you for your purchase. We are preparing your fresh specialty coffee!
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className='text-center py-16 text-stone-500'>
                Your cart is empty. Add some fresh coffee beans!
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className='bg-stone-950 border border-stone-800 p-4 rounded-xl flex gap-4 items-center'
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className='w-16 h-16 object-cover rounded-lg bg-stone-900'
                  />
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold text-sm text-stone-100 truncate'>{item.title}</h4>
                    <p className='text-xs text-stone-400 mt-0.5'>
                      {item.weight}g • {item.grind}
                    </p>
                    <p className='text-amber-500 font-bold text-sm mt-1'>
                      ${item.price * item.quantity}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2 bg-stone-900 border border-stone-800 rounded-lg p-1'>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className='px-2 text-stone-400 hover:text-stone-100 font-bold'
                    >
                      -
                    </button>
                    <span className='text-xs font-semibold px-1'>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className='px-2 text-stone-400 hover:text-stone-100 font-bold'
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className='text-stone-500 hover:text-red-400 text-sm transition-colors'
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>
          {!success && cart.length > 0 && (
            <div className='p-6 border-t border-stone-800 bg-stone-950/50 space-y-4'>
              {error && (
                <div className='bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl'>
                  {error}
                </div>
              )}
              {!user && (
                <p className='text-xs text-stone-400 text-center'>
                  💡 Sign in required to complete your checkout.
                </p>
              )}
              <div className='flex justify-between items-center text-lg font-bold'>
                <span className='text-stone-400'>Total:</span>
                <span className='text-amber-500'>${getTotalPrice()}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className='w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm cursor-pointer'
              >
                {loading ? 'Processing Order...' : 'Checkout Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
