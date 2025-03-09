import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../interfaces/Product";
import './ProductCard.css'

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product.id);
    }
  };

  return (
    <div className="product-card bg-white rounded-lg shadow overflow-hidden">
      <div className="product-card-image-container h-48 w-full overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={`${process.env.VITE_UPLOADS_URL}/${product.images[0].filename}`}
            alt={product.name}
            className="product-card-image w-full h-full object-cover"
          />
        ) : (
          <div className="product-card-no-image w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="product-card-content p-4">
        <div className="product-card-header flex justify-between items-start">
          <div>
            <h3 className="product-card-title text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="product-card-sku text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          <p className="product-card-price text-lg font-bold text-indigo-600">{Number(product.price).toFixed(2)} Rs.</p>
        </div>
        <div className="product-card-actions mt-4 flex justify-between">
          <Link
            to={`/products/edit/${product.id}`}
            className="product-card-edit-btn inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="product-card-delete-btn inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;