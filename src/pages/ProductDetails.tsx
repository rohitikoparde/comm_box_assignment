import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  weight?: number;
  sku?: string;
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-10 text-sm text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <img src="/src/icons/arrow.svg" alt="Back" className="h-4 w-4" />
        Back to Products
      </button>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-lg bg-gray-100 flex items-center justify-center h-[420px]">
          <img src={product.thumbnail} alt={product.title} className="max-h-full object-contain" />
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className="text-gray-500 capitalize">{product.category}</span>
            <span className="rounded bg-black px-2 py-0.5 text-white text-[10px]">In Stock</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>

          <p className="mt-2 text-sm text-gray-600">{product.description}</p>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} out of 5</span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-semibold text-gray-900">${product.price}</p>
          </div>

          <hr className="my-6" />

          {/* Meta */}
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <p className="text-gray-500">Brand</p>
              <p>{product.brand}</p>
            </div>
            <div>
              <p className="text-gray-500">SKU</p>
              <p>HL-WB-{product.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Stock</p>
              <p>{product.stock} units available</p>
            </div>
            <div>
              <p className="text-gray-500">Weight</p>
              <p>400g</p>
            </div>
          </div>

          {/* Button */}
          <button className="mt-6 w-full rounded-md bg-black py-3 text-sm text-white hover:opacity-90">Order Now</button>

          {/* Footer */}
          <div className="mt-4 flex gap-6 text-xs text-gray-500">
            <span>🚚 Fast Shipping</span>
            <span>🔒 Secure Payment</span>
          </div>
        </div>
      </div>

      {/* Extra Sections */}
      <div className="mt-12 space-y-4 text-sm">
        <details className="border-b pb-4">
          <summary className="cursor-pointer font-medium">Additional Information</summary>
          <p className="mt-2 text-gray-600">High-quality materials with long-lasting durability.</p>
        </details>

        <details className="border-b pb-4">
          <summary className="cursor-pointer font-medium">Shipping Information</summary>
          <p className="mt-2 text-gray-600">Ships within 24–48 hours.</p>
        </details>

        <details className="border-b pb-4">
          <summary className="cursor-pointer font-medium">Return Policy</summary>
          <p className="mt-2 text-gray-600">30-day hassle-free returns.</p>
        </details>
      </div>
    </div>
  );
}
