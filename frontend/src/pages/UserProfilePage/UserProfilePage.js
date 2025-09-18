import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from "../../contexts/ProductsContext";
import { useUser } from "../../contexts/UserContext";
import { useAuthorize } from "../../contexts/AuthorizeContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./UserProfilePage.css";

export default function UserProfilePage() {

    return (
        <h1>Hello world</h1>
    );
}