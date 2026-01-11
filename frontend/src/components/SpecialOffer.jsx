import React, { useState, useEffect } from "react";
import { useSessionStore } from "../store/useSessionStore";
import { fetchActivePresets } from "../api/presetAPI";

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useSessionStore((s) => s.hotelId);

  useEffect(() => {
    if (hotelId) {
      loadSpecialOffers();
    }
  }, [hotelId]);

  const loadSpecialOffers = async () => {
    try {
      setLoading(true);
      // ✅ Use API function
      const response = await fetchActivePresets(hotelId);

      if (response.success && response.data) {
        // Find "Special Offers" preset
        const specialOffersPreset = response.data.find(
          (preset) => 
            preset.name.toLowerCase() === "special offers" || 
            preset.tag.toLowerCase() === "specialoffers"
        );

        if (specialOffersPreset && specialOffersPreset.items) {
          const formattedOffers = specialOffersPreset.items.map((presetItem) => ({
            id: presetItem.item._id,
            title: presetItem.item.name,
            originalPrice: presetItem.item.price,
            discountedPrice: presetItem.specialPrice || presetItem.item.price * 0.8,
            description: presetItem.description || presetItem.item.description || "Delicious special offer!",
            badge: presetItem.badge || "SPECIAL!",
            image: presetItem.item.images?.[0] || "/images/placeholder.png",
          }));

          setOffers(formattedOffers);
        }
      }
    } catch (error) {
      console.error("Error fetching special offers:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-300 to-pink-500 p-3">
        <h2 className="text-white text-3xl font-semibold mb-6">Special Offers</h2>
        <div className="flex gap-6 overflow-x-auto">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl w-72 shrink-0 p-4 animate-pulse">
              <div className="bg-gray-300 rounded-2xl w-full h-40"></div>
              <div className="h-4 bg-gray-300 rounded mt-4"></div>
              <div className="h-4 bg-gray-300 rounded mt-2 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-300 to-pink-500 p-3">
        <h2 className="text-white text-3xl font-semibold mb-6">Special Offers</h2>
        <div className="flex gap-6 overflow-x-auto">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl w-72 shrink-0 p-4 animate-pulse">
              <div className="bg-gray-300 rounded-2xl w-full h-40"></div>
              <div className="h-4 bg-gray-300 rounded mt-4"></div>
              <div className="h-4 bg-gray-300 rounded mt-2 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return null; // Don't show section if no offers
  }

  return (
    <div className="bg-gradient-to-br from-red-300 to-pink-500 p-3">
      <h2 className="text-white text-3xl font-semibold mb-6">Special Offers</h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-3xl shadow-xl w-72 shrink-0 p-4 relative"
          >
            <div className="relative">
              <img
                src={offer.image}
                alt={offer.title}
                className="rounded-2xl w-full h-40 object-cover"
              />
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {offer.badge}
              </span>
            </div>

            <h3 className="text-lg font-bold mt-4 line-clamp-1">{offer.title}</h3>
            <div className="mt-2">
              <span className="line-through text-gray-500 text-sm mr-2">
                ₹{offer.originalPrice.toFixed(2)}
              </span>
              <span className="text-pink-400 font-bold text-lg">
                ₹{offer.discountedPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{offer.description}</p>

            <button className="mt-4 w-full bg-gradient-to-r from-orange-300 to-pink-500 text-white font-semibold py-2 rounded-full shadow hover:scale-105 transition">
              Grab Offer Now!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;
