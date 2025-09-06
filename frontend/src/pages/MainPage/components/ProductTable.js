import "./ProductTable.css";

export default function ProductTable({ products }) {
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <table className="tabel">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Date posted</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.price}</td>
            <td>{p.category}</td>
            <td>{p.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}