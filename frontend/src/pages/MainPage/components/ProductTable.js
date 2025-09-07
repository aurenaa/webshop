import { use } from "react";
import "./ProductTable.css";
import { useNavigate } from "react-router-dom";

export default function ProductTable({ products }) {
  const navigate = useNavigate();
  
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  const handleRowClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>Category</th>
          <th>Date posted</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} onClick={() => handleRowClick(p.id)}>
            <td>{p.name}</td>
            <td>{p.price}</td>
            <td>{p.category}</td>
            <td>{new Date(p.datePosted).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}