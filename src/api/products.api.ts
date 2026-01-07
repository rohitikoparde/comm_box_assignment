import axios from "axios";

const API_URL = "https://dummyjson.com/products";

export interface Product {
  category: any;
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const getProducts = async (limit = 8, skip = 0): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>(`${API_URL}?limit=${limit}&skip=${skip}`);
  return response.data;
};
