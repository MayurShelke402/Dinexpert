import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CategoryHeader from "../components/CategoryHeader";
import ProductGrid from "../components/ProductGrid";
import { getMenuItems } from "../api/menuAPI";
import { useSessionStore } from "../store/useSessionStore"; // Adjust the import path as needed
import FloatingCartButton from "../components/CartButton";
import CartModal from "../components/CartModel";

const subcategories = ["All", "Paneer", "Indian", "Western"];
const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Rating"];

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcat, setSubcat] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [foodType, setFoodType] = useState("All");
  const [page, setPage] = useState(1); // support for pagination
  const hotelId = useSessionStore((s) => s.hotelId); // Get hotel ID from session store

  const fetchData = async () => {
    setLoading(true);

    const params = {
      category: categoryName,
      vegOrNonVeg: foodType !== "All" ? foodType : undefined,
      tags: subcat !== "All" ? subcat : undefined,
      sortBy: sortBy === "Default" ? undefined : sortBy.split(":")[0].toLowerCase(),
      order: sortBy.includes("Low to High") ? "asc" : "desc",
      page,
      hotelId,
      limit: 12, // you can adjust this value or make it dynamic
    };

    try {
      const res = await getMenuItems(params);
    
      
      
      setAllProducts(res.data.items || []);

    } catch (err) {
      console.error("Error fetching menu items:", err);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryName, subcat, sortBy, foodType, page]);

  const clearFilters = () => {
    setSubcat("All");
    setSortBy("Default");
    setFoodType("All");
  };

  return (
    <>
    <div className="p-2 bg-gray-50 min-h-screen">
      <CategoryHeader
        categoryName={categoryName}
        subcat={subcat}
        setSubcat={setSubcat}
        sortBy={sortBy}
        setSortBy={setSortBy}
        foodType={foodType}
        setFoodType={setFoodType}
        clearFilters={clearFilters}
        subcategories={subcategories}
        sortOptions={sortOptions}
        
      />

      <ProductGrid loading={loading} products={allProducts} />
    </div>

    <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
 }

 
