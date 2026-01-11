import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import useCartStore from "../store/CartStore";
import { toast } from "react-hot-toast";

export default function ProductCard({ product }) {
  const fallbackImg = "/fallback.jpg";

  const cartItems = useCartStore((state) => state.cartItems);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const quantity = cartItems.find((item) => item._id === product._id)?.quantity || 0;

  const updateCartQuantity = (type, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "increment") {
      addToCart(product);
      toast.success(`${product.name} added`);
    } else if (type === "decrement") {
      if (quantity === 1) {
        removeFromCart(product._id);
      } else {
        decreaseQuantity(product._id);
      }
      toast.success(`${product.name} removed`);
    }
  };

  return (
    <div className="relative  flex flex-col items-center text-center transition-transform hover:scale-[1.02] duration-200 bg-transparent">
      {/* Cooking Time Badge */}
      {product.timerequired && (
        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-semibold m-1 px-2 py-0.5 rounded-full shadow z-10 flex items-center gap-1">
          ⏱ {product.timerequired} min
        </div>
      )}

      <Link to={`/product/${product.slug}`} className="w-full">
        <div className="w-full h-32 flex justify-center items-center overflow-hidden mb-2 border-2 border-gray-100 rounded-3xl">
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = fallbackImg;
              e.target.onerror = null;
            }}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

        <div className="relative h-8 overflow-hidden px-2 pt-2 bg-transparent">
            <div className="flex animate-marquee whitespace-nowrap hover:pause">
              <h3 className="font-semibold text-sm text-gray-900 px-2 flex-shrink-0">
                {product.name}
              </h3>
              {/* Duplicate for seamless loop */}
              <h3 className="font-semibold text-sm text-gray-900 px-2 flex-shrink-0 ml-4">
                {product.name}
              </h3>
            </div>
          </div>

        <div className="flex justify-between items-center w-full mt-1 text-xs text-gray-500 p-1">
          <div className="flex items-center gap-1 px-2">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating || "4.5"}
            </span>
          </div>

          <div className="bg-green-400 text-white rounded-full px-1 py-0.5 flex p-2 items-center gap-1">
            <span className="text-white font-bold text-sm">
              ₹{product.price}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex justify-between items-center w-full px-2 mt-3">
        <div className="flex w-full justify-center shadow-md rounded-lg pl-1">
          <button
            onClick={(e) => updateCartQuantity("decrement", e)}
            className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            disabled={quantity === 0}
          >
            <FaMinus size={12} />
          </button>
          <span className="p-1 text-lg font-semibold">{quantity}</span>
          <button
            onClick={(e) => updateCartQuantity("increment", e)}
            className="p-1 text-gray-600 hover:text-gray-900"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
