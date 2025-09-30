import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";

export default function OfferPage() {
  const { productId } = useParams();
  const userId = localStorage.getItem("userId");
  const { user } = useUser();
  const navigate = useNavigate();
  const [offer, setOffer] = useState("");

  const handleSubmit = async () => {
    if (!user || !user.id) {
    alert("Log in first!");
    return;
  }
    try{
        const response = await axios.post(`http://localhost:8080/WebShopAppREST/rest/mainpage/${productId}/offer`,
            {
                buyerId: productId,
                offer: offer
            }
        );
        console.log("Updated product:", response.data);
        navigate(`/product/${productId}`);
    } catch(err)
    {
        console.error("Error while submitting offer:", err);
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