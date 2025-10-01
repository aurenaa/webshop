import { useState, useEffect } from "react";
import axios from "axios";

export function useProductsList() {
  const [products, setProducts] = useState([]);

const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/WebShopAppREST/rest/mainpage/");
      console.log("=== FULL RESPONSE ===");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Full response data:", response.data);

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((product, index) => {
          console.log(`=== PRODUCT ${index + 1} ===`);
          console.log("ID:", product.id);
          console.log("Name:", product.name);
          console.log("ProductPictures:", product.productPictures);
          console.log("Type of productPictures:", typeof product.productPictures);
          console.log("Is array:", Array.isArray(product.productPictures));
          if (product.productPictures) {
            console.log("Length:", product.productPictures.length);
            console.log("First element:", product.productPictures[0]);
          }
          console.log("All product keys:", Object.keys(product));
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
