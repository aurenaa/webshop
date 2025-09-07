import { useState, useEffect } from "react";
import axios from "axios";

export function useProductsList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/WebShopAppREST/rest/mainpage/");
      setProducts(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return products;
}
