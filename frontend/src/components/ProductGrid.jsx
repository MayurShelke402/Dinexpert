import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import { motion } from "framer-motion";

const gridVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProductGrid({ loading, products }) {
  return (
    <motion.div
      variants={gridVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6"
    >
      {loading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        : products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
    </motion.div>
  );
}
