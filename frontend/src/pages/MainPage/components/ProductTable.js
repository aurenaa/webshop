import { use } from "react";
import "./ProductTable.css";
import { useNavigate } from "react-router-dom";

export default function ProductTable({ products }) {
  const navigate = useNavigate();
  
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="product-grid">
      {products
        .filter((p) => p.status !== "SOLD")
        .map((p) => (
          <div key={p.id} className="product-card" onClick={() => handleClick(p.id)}>
            <img
              src={
                p.productPictures && p.productPictures.length > 0
                  ? `http://localhost:8080/WebShopAppREST/images/products/${p.productPictures[0]}`
                  : "/icons/no_image.jpg"
              }
              alt={p.name}
              className="product-image"
            />
            <div className="product-name">{p.name}</div>
            <div className="product-price">{p.price} RSD</div>
          </div>
        ))}
    </div>
  );
}