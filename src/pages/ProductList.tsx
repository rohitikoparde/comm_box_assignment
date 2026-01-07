import { useEffect, useState } from "react";
import { getProducts, type Product } from "../api/products.api";
import ProductCard from "../components/ProductCard";

const LIMIT = 8;
const MIN_SEARCH_LENGTH = 3; // ~75%

function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "title">("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const debouncedQuery = useDebounce(query, 500);

  const categories = ["All Categories", "Electronics", "Furniture", "Home & Kitchen", "Photography", "Sports", "Bags"];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    const close = () => setIsCategoryOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

 useEffect(() => {
   const params = new URLSearchParams({
     limit: LIMIT.toString(),
     skip: skip.toString(),
     sortBy,
     order,
   });

   fetch(`https://dummyjson.com/products?${params}`)
     .then((res) => res.json())
     .then((res) => {
       let data = res.products;

       // 🔍 Client-side search
       if (debouncedQuery.length >= MIN_SEARCH_LENGTH) {
         const q = debouncedQuery.toLowerCase();
         data = data.filter((p: Product) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
       }

       // 📦 Category filter
       if (selectedCategory !== "All Categories") {
         data = data.filter((p: Product) => p.category.toLowerCase() === selectedCategory.toLowerCase());
       }

       setProducts(data);
       setTotal(data.length);
     });
 }, [skip, debouncedQuery, sortBy, order, selectedCategory]);



  return (
    <div className="max-w-[1320px] mx-auto px-6 py-10">
      {/* Header */}
      <h1 className="text-[24px] leading-[32px] font-semibold text-gray-900">Product Catalog</h1>
      <p className="mt-1 text-sm text-gray-500">Discover our wide selection of quality products</p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        {/* Search */}
        <div className="flex items-center h-10 w-full md:w-[420px] rounded-md bg-gray-100 px-3">
          <span className="text-gray-400 mr-2 text-sm">🔍</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSkip(0);
            }}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />{" "}
        </div>

        {/* Category */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setIsCategoryOpen((prev) => !prev)} className="flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50">
            <span>☰</span>
            <span>{selectedCategory}</span>
            <span className="ml-2 text-gray-400">▾</span>
          </button>

          {isCategoryOpen && (
            <div className="absolute left-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsCategoryOpen(false);
                    setSkip(0);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${selectedCategory === category ? "bg-gray-100 font-medium" : ""}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <select
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split("-");
            setSortBy(s as "price" | "title");
            setOrder(o as "asc" | "desc");
            setSkip(0);
          }}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm text-gray-600"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A → Z</option>
          <option value="title-desc">Title: Z → A</option>
        </select>
      </div>

      {/* Count */}
      <p className="mt-4 text-sm text-gray-500">
        Showing {products.length} of {total} products
      </p>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-4 text-sm text-gray-600">
        <button disabled={skip === 0} onClick={() => setSkip(skip - LIMIT)} className="disabled:opacity-40">
          ‹ Previous
        </button>

        <span className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-900">{skip / LIMIT + 1}</span>

        <button disabled={skip + LIMIT >= total} onClick={() => setSkip(skip + LIMIT)} className="disabled:opacity-40">
          Next ›
        </button>
      </div>
    </div>
  );
}
