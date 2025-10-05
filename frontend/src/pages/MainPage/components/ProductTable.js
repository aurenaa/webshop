import "./ProductTable.css";
import { useNavigate } from "react-router-dom";
import { useUsersList } from "../../../hooks/useUsersList";
export default function ProductTable({ products }) {
  const navigate = useNavigate();
  const users = useUsersList() || [];

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };

  const filteredProducts = products;

  return (
    <div className="product-grid">
      {filteredProducts.map((p) => {
        let firstPicture = null;
        if (Array.isArray(p.productPictures) && p.productPictures.length > 0) {
          firstPicture = p.productPictures[0];
        }
        else if (typeof p.productPictures === 'string' && p.productPictures.trim() !== '') {
          let pictureString = p.productPictures.trim();
          if (pictureString.includes('|')) {
            firstPicture = pictureString.split('|')[0];
          } else {
            firstPicture = pictureString;
          }
        }

        if (firstPicture) {
          firstPicture = firstPicture.replace(/;+$/, '').trim();
        }

        const imageUrl = firstPicture 
          ? `http://localhost:8080/WebShopAppREST/images/products/${firstPicture}`
          : "/icons/no_image.jpg";

        return (
          <div key={p.id} className="product-card" onClick={() => handleClick(p.id)}>
            <img
              src={imageUrl}
              alt={p.name}
              className="product-image"
              onError={(e) => {
                e.target.src = "/icons/no_image.jpg";
              }}
            />
            <div className="product-name">{p.name}</div>
            <div className="product-price">{p.price} RSD</div>
          </div>
        );
      })}
    </div>
  );
}