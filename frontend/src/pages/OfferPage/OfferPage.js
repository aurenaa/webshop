import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";

export default function OfferPage() {
  const { id: productId } = useParams();
  const { user } = useUser();
  const [offer, setOffer] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!user || !user.id) {
      alert("Please log in first!");
      return;
    }

    if (!productId) {
      alert("Product ID is missing!");
      return;
    }

    const offerValue = parseFloat(offer);
    if (isNaN(offerValue) || offerValue <= 0) {
      alert("Enter a valid offer amount!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/WebShopAppREST/rest/purchases/${productId}/bid`,
        {
          buyerId: user.id,
          offer: offerValue
        }
      );

      if (!response.data) {
        alert("Bid not accepted. Make sure product is available and your offer is higher than current max bid.");
      } else {
        alert("Bid placed successfully!");
        console.log("Updated product:", response.data);
        navigate("/mainpage");
      }
    } catch (err) {
      console.error("Error while submitting offer:", err);
      alert("Failed to submit offer. Check if the server is running and the product exists.");
    }
  };

  return (
    <div className="container">
      <h3>Place your offer</h3>
      <input
        type="number"
        value={offer}
        onChange={(e) => setOffer(e.target.value)}
        placeholder="Enter your bid"
        className="form-control mb-2"
      />
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit offer
      </button>
    </div>
  );
}