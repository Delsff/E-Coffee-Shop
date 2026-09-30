import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const orderPayload = {
      customer: formData,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
      })),
      totalAmount: getTotalPrice(),
    };
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      setCreatedOrderId(data.id);
      clearCart();
    } catch (err) {
      console.error("Order submit error:", err);
      setError(
        "Failed to place order. Check if the backend server is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (createdOrderId) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-center py-16">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">
          Thank you for your order!
        </h2>
        <p className="text-sm font-semibold text-brand-accent mb-4">
          Order ID: {createdOrderId}
        </p>
        <p className="text-gray-600 mb-8">
          We have received your specialty coffee order and sent a confirmation
          email to <span className="font-semibold">{formData.email}</span>.
        </p>
        <Link
          to="/"
          className="bg-brand-accent text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-colors"
        >
          Back to Catalog
        </Link>
      </main>
    );
  }
  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Add some specialty coffee to proceed with checkout.
        </p>
        <Link
          to="/"
          className="bg-brand-accent text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-colors"
        >
          Explore Coffee
        </Link>
      </main>
    );
  }
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">
        Checkout Order
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 border border-stone-200 rounded-lg"
        >
          <h3 className="text-lg font-bold text-brand-dark mb-2">
            Shipping Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            <textarea
              required
              rows={3}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-accent text-white py-3 rounded-md font-bold hover:opacity-90 disabled:opacity-50 transition-colors mt-4 cursor-pointer"
          >
            {isSubmitting
              ? "Processing Order..."
              : `Place Order ($${(getTotalPrice() / 100).toFixed(2)})`}
          </button>
        </form>
        <div className="bg-stone-50 p-6 border border-stone-200 rounded-lg h-fit">
          <h3 className="text-lg font-bold text-brand-dark mb-4">
            Order Summary
          </h3>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span>
                  {product.name} x {quantity}
                </span>
                <span className="font-semibold">
                  ${((product.price * quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-300 pt-3 flex justify-between font-bold text-brand-dark">
            <span>Total Amount:</span>
            <span className="text-brand-accent">
              ${(getTotalPrice() / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
