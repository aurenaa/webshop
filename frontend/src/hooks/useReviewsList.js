import { useState, useEffect } from "react";
import axios from "axios";

export function useReviewsList() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/WebShopAppREST/rest/reviews");
      setReviews(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return reviews;
}