import { useNavigate } from "react-router-dom";
import type { Product } from "../api/products.api";

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition">
      {" "}
      <div className="bg-gray-100 rounded-md h-[180px] flex items-center justify-center">
        <img src={product.thumbnail} alt={product.title} className="h-full object-contain p-4" />
      </div>
      <h3 className="text-sm font-medium mt-4">{product.title}</h3>
      {/* Rating */}
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">
            ★
          </span>
        ))}
        <span className="text-xs text-gray-500">({product.rating})</span>
      </div>
      {/* Price */}
      <p className="font-semibold text-sm mt-2">${product.price}</p>
    </div>
  );
}
