// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaLeaf, FaDrumstickBite, FaSeedling, FaMinus, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { getMenuItemBySlug } from "../api/menuAPI";
import useCartStore from "../store/CartStore";
import { toast } from "react-hot-toast";
import BottomNav from "../components/BottomNav";
import FloatingCartButton from "../components/CartButton";
import CartModal from "../components/CartModel";

export default function ProductDetail() {
  const { productSlug } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMenuItemBySlug(productSlug);
      if (res.data) {
        setProduct(res.data);
        setMainImage(res.data.images?.[0] || 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=No+Image');
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productSlug]);

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading deliciousness...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 p-4">
        <p className="text-red-700 text-lg text-center">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
        <p className="text-gray-300 text-xl text-center">Product not found.</p>
      </div>
    );
  }

  const getVegNonVegIcon = (type) => {
    switch (type) {
      case 'Veg':
        return <FaLeaf className="text-green-600" />;
      case 'Non-Veg':
        return <FaDrumstickBite className="text-red-600" />;
      case 'Vegan':
        return <FaSeedling className="text-lime-600" />;
      default:
        return null;
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${product.name} x${quantity} added to cart!`);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-32">
      <div className="container mx-auto px-4 py-1 pb-3 md:py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden md:flex md:items-start md:space-x-8 p-6 md:p-8">

          {/* Product Image Gallery */}
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md mb-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${
                      mainImage === imgUrl ? 'border-orange-500 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setMainImage(imgUrl)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="flex items-center mb-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mr-3">
                {product.name}
              </h1>
              {product.vegOrNonVeg && (
                <span className="text-lg px-3 py-1 rounded-full bg-gray-100 flex items-center gap-2 font-semibold">
                  {getVegNonVegIcon(product.vegOrNonVeg)}
                  {product.vegOrNonVeg}
                </span>
              )}
            </div>

            {product.category && (
              <p className="text-lg text-gray-600 mb-4">{product.category.name}</p>
            )}

            <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
              {product.description || "A delightful dish crafted with fresh ingredients."}
            </p>

            {/* Key Info Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {product.servingSize && (
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Serving: {product.servingSize}
                </span>
              )}
              {product.timerequired && (
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <FaClock /> {product.timerequired}
                </span>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => {
                    const normalizedTag = tag.toLowerCase().replace(/\s+/g, '');
                    const tagColors = {
                      spicy: "bg-red-100 text-red-700",
                      hot: "bg-orange-100 text-orange-700",
                      sweet: "bg-pink-100 text-pink-700",
                      vegan: "bg-green-100 text-green-800",
                      vegetarian: "bg-green-100 text-green-800",
                      glutenfree: "bg-yellow-100 text-yellow-800",
                      popular: "bg-blue-100 text-blue-700",
                      healthy: "bg-emerald-100 text-emerald-700",
                      default: "bg-gray-100 text-gray-700"
                    };
                    const tagClass = tagColors[normalizedTag] || tagColors.default;

                    return (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${tagClass}`}>
                        #{tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ✅ INLINE PRICE + QUANTITY + ADD TO CART */}
            <div className="space-y-6 border-t border-gray-100 pt-8">
              {/* Price + Quantity */}
              <div className="flex justify-between items-center">
                <span className="text-4xl font-extrabold text-orange-600">
                  ₹{(product.price * quantity).toFixed(2)}
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                  <motion.button
                    onClick={() => handleQuantityChange('decrement')}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                    disabled={quantity === 1}
                  >
                    <FaMinus />
                  </motion.button>
                  <span className="px-6 text-xl font-bold bg-gray-50 rounded-lg mx-2">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => handleQuantityChange('increment')}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    <FaPlus />
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 border-0"
              >
                 Add to Cart • ₹{(product.price * quantity).toFixed(2)}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav />

      {/* Floating Cart Button */}
      <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
