import { useState, useEffect } from "react";
import axios from "axios";

export function useProductsList() {
  const [products, setProducts] = useState([]);

const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/WebShopAppREST/rest/mainpage/");
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((product, index) => {
          if (product.productPictures) {
          }
        });
      }
      
      setProducts(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return products;
}
