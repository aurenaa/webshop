import "./ProductTable.css";

export default function ProductTable({ products }) {
  console.log("Products in table:", products); // Dodajte ovo
  
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  // Proverite da li objekti imaju ove property-e
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
            <td>{p.datePosted}</td> {/* Verovatno je datePosted umesto date */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}