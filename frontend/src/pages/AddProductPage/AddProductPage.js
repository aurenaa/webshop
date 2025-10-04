import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import { useProducts } from "../../contexts/ProductsContext";
import axios from "axios";

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';

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
        saleType: "FIXED_PRICE",
        location: null
    });

    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [productImage, setProductImage] = useState(null);

    const mapRef = useRef();
    const popupRef = useRef();
    const [map, setMap] = useState(null);

    const fetchAddress = async (lat, lon) => {
        try {
            const res = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const addr = res.data.address;

            const road = addr.road || "";
            const houseNumber = addr.house_number ? `${addr.house_number} ` : "";
            const city = addr.city || addr.town || addr.village || "";
            const postcode = addr.postcode || "";

            return `${road} ${houseNumber}, ${city} ${postcode}`.trim();
        } catch (err) {
            console.error("Failed to fetch address:", err);
            return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
        }
    };

    useEffect(() => {
        if (!mapRef.current) return;

        const initialMap = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([19.8335, 45.2671]),
                zoom: 10
            })
        });

        const popup = new Overlay({
            element: popupRef.current,
            positioning: 'bottom-center',
            stopEvent: false,
        });

        initialMap.addOverlay(popup);

        initialMap.on('click', async (event) => {
            const coordinates = event.coordinate;
            const lonLat = toLonLat(coordinates);
            const lat = lonLat[1];
            const lon = lonLat[0];
            const address = await fetchAddress(lat, lon);
            const location = {
                latitude: lonLat[1],
                longitude: lonLat[0],
                address: address
            };

            setSelectedProduct(prev => ({
                ...prev,
                location: location
            }));

            popup.setPosition(coordinates);
        });

        setMap(initialMap);

        return () => {
            if (initialMap) {
                initialMap.setTarget(null);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (!selectedProduct.location) {
            setMessage("Please select a location on the map.");
            return;
        }

        try {
            if (newCategory) {
                await axios.post(
                    "http://localhost:8080/WebShopAppREST/rest/categories/add-category",
                    { name: newCategory }
                );
            }

            const locationResponse = await axios.post(
                "http://localhost:8080/WebShopAppREST/rest/locations/",
                selectedProduct.location
            );

            const productToSend = {
                ...selectedProduct,
                sellerId: userId,
                category: { name: selectedProduct.category },
                location: locationResponse.data
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
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
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

                    <div className="map-section">
                            <label>Select Location *</label>
                            <p className="text-muted">Click on the map to choose product location</p>
                            <div 
                                ref={mapRef} 
                                className="map-container" 
                                style={{ height: '400px', width: '100%', marginBottom: '10px' }}
                            ></div>
                            
                            <div ref={popupRef} className="popup">
                                <div className="popup-content">
                                    Location selected!
                                </div>
                            </div>

                            {selectedProduct.location && (
                                <div className="selected-location">
                                    <strong>Selected Location:</strong><br/>
                                    Latitude: {selectedProduct.location.latitude.toFixed(4)}<br/>
                                    Longitude: {selectedProduct.location.longitude.toFixed(4)}<br/>
                                    Address: {selectedProduct.location.address}
                                </div>
                            )}
                        </div>                
                <button className="btn btn-secondary mt-2" type="submit">Add Product</button>
            </form>
            </div>
            {message && <p className="mt-2">{message}</p>}
        </div>
    </div>
    );
}