import { useState, useEffect } from "react";
import axios from "axios";

export function useProductsList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      const response = await axios.get("http://localhost:8081/WebShopAppREST/rest/mainpage/");
      console.log("Response received:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error response:", error.response);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return products;
}
