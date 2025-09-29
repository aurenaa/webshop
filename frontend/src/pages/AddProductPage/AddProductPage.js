import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useProducts } from "../../contexts/ProductsContext";
import axios from "axios";
import "./AddProductPage.css";

export default function AddProductPage() {
    const navigate = useNavigate();
    const { isLoggedIn, userId } = useAuthorize();
    const { dispatch } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        saleType: "FIXED_PRICE"
    });

    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [productImage, setProductImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            if (newCategory) {
                await axios.post(
                    "http://localhost:8080/WebShopAppREST/rest/categories/add-category",
                    { name: newCategory }
                );
            }

            const productToSend = {
                ...selectedProduct,
                sellerId: userId,
                category: { name: selectedProduct.category }
            };

            const productResponse = await axios.post(
                "http://localhost:8080/WebShopAppREST/rest/mainpage/",
                productToSend
            );

            const createdProduct = productResponse.data;

            const formData = new FormData();
            formData.append("productImage", productImage);
            formData.append("id", createdProduct.id);

            const imageResponse = await axios.post(
                "http://localhost:8080/WebShopAppREST/products/upload-image",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            createdProduct.image = imageResponse.data.productImage;

            dispatch({ type: "ADD", payload: createdProduct });
            setMessage("Listing added.");
            navigate("/"); 
        } catch (err) {
            console.error(err);
            setMessage("Error while posting listing.");
        }
    };

    useEffect(() => {
    axios
        .get("http://localhost:8080/WebShopAppREST/rest/categories/")
        .then((res) => {
            console.log("Fetched categories:", res.data);
            setCategories(res.data)
        })
        .catch((err) => console.error("Failed to fetch categories:", err));
    }, []);

    return (
        <div className="add-product-page">

        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <span className="navbar-brand" onClick={() => navigate("/")}>WebShop</span>
            <div className="d-flex align-items-center ms-auto">
            <button onClick={() => navigate("/add-product")} className="btn btn-success me-2">Add a Listing</button>
            <button onClick={() => navigate("/signup")} className="btn btn-outline-primary me-2">Sign Up</button>
            <span onClick={() => navigate("/login")} className="nav-link" style={{ cursor: "pointer" }}>Log in</span>
            </div>
        </nav>

        <div className="container mt-4">
            <h2>Add a New Product</h2>
            <p>Fill in the details below to post your product for sale.</p>
            <div className="form-border p-4">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                    required
                />
                <label>Category:</label>
                <select
                    value={selectedProduct.category || "NEW"}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "NEW") {
                        setSelectedProduct({ ...selectedProduct, category: "" });
                        } else {
                        setSelectedProduct({ ...selectedProduct, category: value });
                        }
                    }}
                >
                <option value="">-- Choose category --</option>
                {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                    {cat.name}
                    </option>
                ))}
                <option value="NEW">+ Add new category</option>
                </select>

                {selectedProduct.category === "" && (
                    <input
                        type="text"
                        placeholder="New category"
                        value={newCategory}
                        onChange={(e) => {
                        setNewCategory(e.target.value);
                        setSelectedProduct({ ...selectedProduct, category: e.target.value });
                        }}
                    />
                )}
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={selectedProduct.description}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    />
                <select
                    name="saleType"
                    value={selectedProduct.saleType}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, saleType: e.target.value })}
                >
                <option value="FIXED_PRICE">Fixed Price</option>
                <option value="AUCTION">Auction</option>
                </select>
                <label>Product Image *</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setProductImage(e.target.files[0])} 
                        required
                        />
                <button className="btn btn-secondary mt-2" type="submit">Add Product</button>
            </form>
            </div>
            {message && <p className="mt-2">{message}</p>}
        </div>
    </div>
    );
}